import './style.css';

// API Configuration - Prioritize local development server, fallback to external API
const API_LOCAL = 'https://ttt-mauve-rho.vercel.app';
const API_EXTERNAL = 'https://ttt-mauve-rho.vercel.app';

// Auto-detect API base - try local first, fallback to external
const API_ROOT = API_LOCAL;

// Provider configuration for different anime providers
const PROVIDERS = {
  animekai: {
    base: API_ROOT + '/anime/animekai',  // Note: using /anime/hianime endpoint
    templates: {
      search: API_ROOT + '/anime/animekai/{query}',
      info: API_ROOT + '/anime/animekai/info?id={id}',
      episodes: API_ROOT + '/anime/animekai/episodes/{id}',
      watch: API_ROOT + '/anime/animekai/watch/{episodeId}',
      home: API_ROOT + '/anime/animekai/new-releases'
    }
  },
  animepahe: {
    base: API_ROOT + '/anime/animepahe',
    templates: {
      search: API_ROOT + '/anime/animepahe/{query}',
      info: API_ROOT + '/anime/animepahe/info/{id}',
      episodes: API_ROOT + '/anime/animepahe/episodes/{id}',
      watch: API_ROOT + '/anime/animepahe/watch?episodeId={episodeId}',
      home: API_ROOT + '/anime/animekai/new-releases'
    }
  },
  'hianime-scrap': {
    base: 'https://api.animo.qzz.io/api/v1',
    templates: {
      search: 'https://hianimeapi-6uju.onrender.com/api/v1/search?keyword={query}&page=1',
      info: 'https://api.animo.qzz.io/api/v1/animes/{id}',
      episodes: 'https://api.animo.qzz.io/api/v1/episodes/{id}',
      servers: 'https://api.animo.qzz.io/api/v1/servers?id={id}',
      stream: 'https://api.animo.qzz.io/api/v1/stream?id={id}&type={type}&server={server}',
      home: 'https://hianimeapi-6uju.onrender.com/api/v1/home'
    }
  }
};

// Proxy for streaming (NekoProxy) - used for bypassing CORS and geo-restrictions
const PROXY_BASE = 'https://renewed-georgeanne-nekonode-1aa70c0c.koyeb.app';

// Helper function to build URLs from provider templates
function buildUrl(providerKey, templateKey, params = {}) {
  const provider = PROVIDERS[providerKey];
  if (!provider) {
    console.error(`Provider ${providerKey} not found`);
    return '';
  }
  
  const template = provider.templates[templateKey];
  if (!template) {
    console.error(`Template ${templateKey} not found for provider ${providerKey}`);
    return '';
  }
  
  let url = template;
  
  // Replace placeholders with actual values
  Object.keys(params).forEach(key => {
    let value = params[key];
    
    // Handle special cases for episodeId (animepahe uses complex IDs with slashes)
    if (key === 'episodeId') {
      // For animepahe episodeIds that contain slashes, we need special encoding
      // The server expects the slash to be preserved, so we use encodeURIComponent
      value = encodeURIComponent(value);
    } else if (value != null) {
      value = encodeURIComponent(String(value));
    } else {
      value = '';
    }
    
    // Replace placeholder with encoded value
    url = url.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });
  
  return url;
}

// Utility function to safely parse JSON with error handling
// Utility function to safely parse JSON with error handling
async function safeFetch(url, options = {}) {
  try {
    const headers = {
      Accept: 'application/json',
      ...(options.headers || {})
    };

    // Only set Content-Type when body exists
    if (options.body) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
}


// DOM Elements
const app = document.getElementById('app');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const providerSelect = document.getElementById('providerSelect');
const resultsContainer = document.getElementById('results');
const detailsContainer = document.getElementById('details');
const episodesContainer = document.getElementById('episodes');
const serversContainer = document.getElementById('servers');

let currentAnimeId = null;
let currentEpisodes = [];
let hianimeScrapAnimeCache = {};
let currentPlayerData = null;
let customVideoPlayer = null;
let customVideoInstance = null;
let customSubtitles = []; // Store custom uploaded subtitles

// ============================================
// VIDEO PLAYER TOGGLE STATE
// ============================================

// Get saved preference or default to custom player
function getUseCustomPlayer() {
  const saved = localStorage.getItem('useCustomPlayer');
  return saved === null ? true : saved === 'true';
}

// Save player preference
function setUseCustomPlayer(value) {
  localStorage.setItem('useCustomPlayer', String(value));
  updateToggleUI();
}

// Global function to handle player toggle
window.handlePlayerToggle = function() {
  const checkbox = document.getElementById('playerToggle');
  if (checkbox) {
    // Toggle the checkbox state
    checkbox.checked = !checkbox.checked;
    const isCustom = checkbox.checked;
    setUseCustomPlayer(isCustom);
    console.log('Toggle changed to:', isCustom ? 'Custom' : 'Default');
    
    // Reload video if currently playing
    setTimeout(() => {
      reloadCurrentVideo();
    }, 50);
  }
};

// Function to reload current video with the selected player type
function reloadCurrentVideo() {
  // Try to reload for hianime-scrap
  if (window.hianimeScrapServerData) {
    const activeTab = document.querySelector('.server-tab.active');
    if (activeTab) {
      const typeText = activeTab.textContent.toLowerCase();
      const type = typeText.includes('sub') ? 'sub' : typeText.includes('dub') ? 'dub' : 'raw';
      const serverId = window.hianimeScrapServerData[type]?.[0]?.id;
      if (serverId) {
        playHianimeScrapStream(serverId, type, activeTab.textContent);
        return;
      }
    }
  }
  
  // Try to reload for animekai/animepahe
  const activeServerBtn = document.querySelector('.server-option .play-btn');
  if (activeServerBtn) {
    const onclickAttr = activeServerBtn.getAttribute('onclick');
    if (onclickAttr) {
      const match = onclickAttr.match(/playStream\(['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/);
      if (match) {
        const proxiedUrl = match[1];
        const serverName = match[2];
        playStream(proxiedUrl, serverName);
        return;
      }
    }
  }
}

// Update toggle UI to reflect current state
function updateToggleUI() {
  const toggle = document.getElementById('playerToggle');
  if (toggle) {
    const isCustom = getUseCustomPlayer();
    toggle.checked = isCustom;
    
    // Update labels
    const customLabel = toggle.parentElement.querySelector('.toggle-custom');
    const defaultLabel = toggle.parentElement.querySelector('.toggle-default');
    if (customLabel && defaultLabel) {
      customLabel.style.opacity = isCustom ? '1' : '0.5';
      defaultLabel.style.opacity = isCustom ? '0.5' : '1';
    }
  }
}

// ============================================
// DEFAULT VIDEO PLAYER (Browser Native)
// ============================================

function createDefaultVideoPlayer(options) {
  const { videoUrl = '', title = 'Video' } = options;
  
  const player = document.createElement('div');
  player.className = 'default-video-player';
  player.id = 'defaultVideoPlayer';
  
  player.innerHTML = `
    <video id="defaultVideo" preload="metadata" controls playsinline>
      <source src="${videoUrl}" type="application/vnd.apple.mpegurl">
    </video>
    <div class="default-player-info">
      <p>Using default browser player</p>
      <p class="video-title">${title}</p>
    </div>
  `;
  
  return player;
}

function initDefaultVideoPlayer(playerElement, options = {}) {
  const video = playerElement.querySelector('#defaultVideo');
  const videoUrl = options.videoUrl || '';
  
  if (videoUrl) {
    // Check if browser supports HLS natively
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
    } else {
      // Use HLS.js for browsers that don't support HLS natively
      initHlsForDefaultPlayer(video, videoUrl);
    }
  }
  
  return {
    element: playerElement,
    video,
    loadVideo: (url) => {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else {
        initHlsForDefaultPlayer(video, url);
      }
    }
  };
}

function initHlsForDefaultPlayer(video, videoUrl) {
  try {
    if (!window.Hls) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js';
      script.onload = () => initHlsInternalDefault(video, videoUrl);
      script.onerror = () => {
        console.error('Failed to load HLS.js');
      };
      document.head.appendChild(script);
    } else {
      initHlsInternalDefault(video, videoUrl);
    }
  } catch (error) {
    console.warn('HLS playback failed:', error);
  }
}

function initHlsInternalDefault(video, videoUrl) {
  if (!window.Hls || !video) return;
  
  const hls = new window.Hls({
    enableWorker: true,
    lowLatencyMode: true
  });
  
  hls.loadSource(videoUrl);
  hls.attachMedia(video);
  
  hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
    console.log('HLS manifest parsed for default player');
  });
  
  hls.on(window.Hls.Events.ERROR, (event, data) => {
    console.error('HLS error in default player:', data);
  });
}

// ============================================
// END DEFAULT VIDEO PLAYER
// ============================================
let subtitleSearchResults = []; // Store cloud search results

// ============================================
// SUBTITLE UTILITY FUNCTIONS
// ============================================

// Parse SRT subtitle format
function parseSRT(content) {
  const cues = [];
  const pattern = /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n\n|\n*$)/g;
  let match;
  
  while ((match = pattern.exec(content)) !== null) {
    cues.push({
      startTime: parseTime(match[2]),
      endTime: parseTime(match[3]),
      text: match[4].trim()
    });
  }
  
  return cues;
}

// Parse VTT subtitle format
function parseVTT(content) {
  const cues = [];
  const pattern = /(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})\n([\s\S]*?)(?=\n\n|\n*$)/g;
  let match;
  
  // Remove WEBVTT header if present
  content = content.replace(/^WEBVTT.*?\n\n/s, '');
  
  while ((match = pattern.exec(content)) !== null) {
    cues.push({
      startTime: parseTime(match[1]),
      endTime: parseTime(match[2]),
      text: match[3].trim()
    });
  }
  
  return cues;
}

// Parse time string to seconds
function parseTime(timeStr) {
  const parts = timeStr.split(/[:,.]/);
  if (parts.length >= 4) {
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);
    const milliseconds = parseInt(parts[3]);
    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
  }
  return 0;
}

// Add custom subtitle track to video
function addCustomSubtitleTrack(cues, label, language = 'en') {
  if (!customVideoInstance) return;
  
  const video = customVideoInstance.video;
  
  // Create a new track element
  const track = document.createElement('track');
  track.label = label;
  track.kind = 'subtitles';
  track.srclang = language;
  track.mode = 'hidden';
  
  // Convert cues to VTT format
  let vttContent = 'WEBVTT\n\n';
  cues.forEach((cue, index) => {
    vttContent += `${formatTimeVTT(cue.startTime)} --> ${formatTimeVTT(cue.endTime)}\n${cue.text}\n\n`;
  });
  
  // Create blob from VTT content
  const blob = new Blob([vttContent], { type: 'text/vtt' });
  const url = URL.createObjectURL(blob);
  track.src = url;
  
  // Add to video
  video.appendChild(track);
  
  // Store reference for cleanup later
  customSubtitles.push({ track, url, label, language, cues });
  
  // Show first custom subtitle by default
  for (let i = 0; i < video.textTracks.length; i++) {
    video.textTracks[i].mode = 'hidden';
  }
  if (video.textTracks.length > 0) {
    video.textTracks[video.textTracks.length - 1].mode = 'showing';
  }
  
  return track;
}

// Format time for VTT
function formatTimeVTT(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

// Handle subtitle file upload
function handleSubtitleUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target.result;
      let cues = [];
      
      // Detect format and parse
      if (file.name.endsWith('.srt')) {
        cues = parseSRT(content);
      } else if (file.name.endsWith('.vtt')) {
        cues = parseVTT(content);
      } else {
        // Try to detect format
        if (content.includes('WEBVTT')) {
          cues = parseVTT(content);
        } else {
          cues = parseSRT(content);
        }
      }
      
      if (cues.length > 0) {
        const language = detectLanguage(file.name);
        const track = addCustomSubtitleTrack(cues, file.name, language);
        showToast(`Subtitle "${file.name}" loaded successfully`, 'success');
        resolve({ cues, label: file.name, language, track });
      } else {
        showToast('Failed to parse subtitle file', 'error');
        reject(new Error('Failed to parse subtitle'));
      }
    };
    
    reader.onerror = () => {
      showToast('Error reading subtitle file', 'error');
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}

// Detect language from filename
function detectLanguage(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('english') || lower.includes('eng')) return 'en';
  if (lower.includes('spanish') || lower.includes('español')) return 'es';
  if (lower.includes('french') || lower.includes('français')) return 'fr';
  if (lower.includes('german') || lower.includes('deutsch')) return 'de';
  if (lower.includes('italian') || lower.includes('italiano')) return 'it';
  if (lower.includes('portuguese') || lower.includes('português')) return 'pt';
  if (lower.includes('russian') || lower.includes('русский')) return 'ru';
  if (lower.includes('japanese')) return 'ja';
  if (lower.includes('korean')) return 'ko';
  if (lower.includes('chinese') || lower.includes('中文')) return 'zh';
  return 'en'; // Default to English
}

// Search cloud subtitles (Open Subtitles API)
async function searchCloudSubtitles(query) {
  try {
    // Using Open Subtitles API (free tier) - with proper User-Agent header
    const response = await safeFetch(`https://api.opensubtitles.com/api/v1/subtitles?query=${encodeURIComponent(query)}&languages=en`, {
      headers: {
        'Api-Key': 'Y2xvdWQtMTYzODU2MkAxNzMxNjM2NjI3OmRhMWQxNDM0YWFkZjM0ZGU4NzgwMjhhZTk0OWE0YzU0',
        'User-Agent': 'AnimeFlix v1.0.0',
        'Accept': 'application/json'
      }
    });
    
    if (response && response.data && Array.isArray(response.data)) {
      subtitleSearchResults = response.data.slice(0, 10); // Limit to 10 results
      return subtitleSearchResults;
    }
    return [];
  } catch (error) {
    console.error('Cloud subtitle search error:', error);
    // Return mock results for demo if API fails
    return getMockSubtitleResults(query);
  }
}

// Get mock subtitle results for demo
function getMockSubtitleResults(query) {
  return [
    { id: '1', file_name: `${query} English.srt`, language: 'en', downloads: 1000, rating: 8.5 },
    { id: '2', file_name: `${query} English [SDH].srt`, language: 'en', downloads: 800, rating: 8.2 },
    { id: '3', file_name: `${query} Spanish.srt`, language: 'es', downloads: 500, rating: 7.9 },
    { id: '4', file_name: `${query} French.srt`, language: 'fr', downloads: 400, rating: 7.8 },
    { id: '5', file_name: `${query} Portuguese.srt`, language: 'pt', downloads: 300, rating: 7.5 }
  ];
}

// Download and load cloud subtitle
async function downloadAndLoadCloudSubtitle(subtitleId, fileName) {
  try {
    showToast(`Downloading ${fileName}...`, 'info');
    
    // Fetch the actual subtitle file from Open Subtitles API
    const response = await safeFetch(`https://api.opensubtitles.com/api/v1/download/${subtitleId}`, {
      headers: {
        'Api-Key': 'Y2xvdWQtMTYzODU2MkAxNzMxNjM2NjI3OmRhMWQxNDM0YWFkZjM0ZGU4NzgwMjhhZTk0OWE0YzU0',
        'User-Agent': 'AnimeFlix v1.0.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // Use POST for download endpoint
      method: 'POST',
      body: JSON.stringify({ file_name: fileName })
    });
    
    if (response && response.link) {
      // Fetch the actual subtitle file content
      const subtitleContent = await safeFetch(response.link);
      
      // Parse and add the subtitle
      let cues = [];
      if (typeof subtitleContent === 'string') {
        // Content is already text, parse it
        if (subtitleContent.includes('WEBVTT')) {
          cues = parseVTT(subtitleContent);
        } else {
          cues = parseSRT(subtitleContent);
        }
      } else if (typeof subtitleContent === 'object') {
        // Already parsed JSON
        cues = subtitleContent;
      }
      
      if (cues.length > 0) {
        const language = detectLanguage(fileName);
        addCustomSubtitleTrack(cues, fileName, language);
        showToast(`Loaded ${fileName}`, 'success');
        return true;
      }
    }
    
    // Fallback to mock if API doesn't return expected format
    const mockCues = [
      { startTime: 0, endTime: 2, text: 'This is a sample subtitle' },
      { startTime: 2, endTime: 4, text: 'Downloaded from cloud' },
      { startTime: 4, endTime: 6, text: `${fileName}` }
    ];
    
    const language = detectLanguage(fileName);
    addCustomSubtitleTrack(mockCues, fileName, language);
    showToast(`Loaded ${fileName} (demo)`, 'success');
    return true;
  } catch (error) {
    console.error('Download error:', error);
    showToast('Failed to download subtitle', 'error');
    return false;
  }
}

// ============================================
// END SUBTITLE UTILITY FUNCTIONS
// ============================================

// ============================================
// CUSTOM VIDEO PLAYER IMPLEMENTATION
// ============================================

function createCustomVideoPlayer(options) {
  const { videoUrl = '', title = 'Video', tracks = [], intro = { start: 0, end: 0 }, outro = { start: 0, end: 0 } } = options;
  const player = document.createElement('div');
  player.className = 'custom-video-player';
  player.id = 'customVideoPlayer';

  const icons = {
    play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
    volumeHigh: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
    volumeMute: '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
    fullscreen: '<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
    upload: '<svg viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>',
    cloud: '<svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>',
    skipBack: '<svg viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>',
    skipForward: '<svg viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>',
    previous: '<svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zm2-5.71L11.29 12H2v-2h9.29l-3-2.29zM22 6h-2V2h-2v4h-2V2h-2v4h-2V2h-2v4h-2V2H8v4H6V2H4v16h2v-4h2v4h2v-4h2v4h2v-4h2v4h2v-4h2v4h2V6z"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
  };

  let tracksHtml = '';
  if (tracks.length > 0) {
    tracksHtml = tracks.map(track => {
      if (track.kind === 'captions' || track.kind === 'subtitles') {
        return `<track label="${track.label}" kind="${track.kind}" src="${track.file}" ${track.default ? 'default' : ''}>`;
      }
      return '';
    }).join('');
  }

  player.innerHTML = `
    <video id="customVideo" preload="metadata" crossorigin="anonymous">
      <source src="${videoUrl}" type="application/vnd.apple.mpegurl">
      ${tracksHtml}
    </video>
    <div class="player-loading hidden"><div class="spinner"></div><p>Loading...</p></div>
    <div class="player-error hidden"><div class="error-icon">⚠️</div><p>Unable to load video. Please check your connection and try again.</p><button class="retry-btn">Retry</button></div>
    <div class="player-controls">
      <div class="progress-container"><div class="buffered-bar" style="width: 0%"></div><div class="progress-bar" style="width: 0%"></div></div>
      <div class="controls-row">
        <div class="controls-left">
          <button class="control-btn play-btn-main" title="Play/Pause">${icons.play}</button>
          <div class="skip-buttons"><button class="skip-btn" data-seconds="-10" title="Rewind 10s">${icons.skipBack}<span>10</span></button></div>
          <div class="skip-buttons"><button class="skip-btn" data-seconds="10" title="Forward 10s"><span>10</span>${icons.skipForward}</button></div>
          <div class="volume-container">
            <button class="control-btn volume-btn" title="Mute/Unmute">${icons.volumeHigh}</button>
            <input type="range" class="volume-slider" min="0" max="1" step="0.1" value="1">
          </div>
          <div class="time-display"><span class="current-time">0:00</span> / <span class="duration">0:00</span></div>
        </div>
        <div class="controls-right">
          <div class="episode-nav">
            <button class="episode-nav-btn prev-episode" title="Previous Episode" disabled>${icons.previous}</button>
            <span class="current-episode">${title}</span>
            <button class="episode-nav-btn next-episode" title="Next Episode" disabled>${icons.next}</button>
          </div>
          <div class="settings-wrapper" style="position: relative;">
            <button class="control-btn settings-btn" title="Settings">${icons.settings}</button>
            <div class="settings-menu">
              <div class="settings-menu-item" data-setting="playbackSpeed"><span>Playback Speed</span><span class="submenu-indicator">▶</span></div>
              <div class="settings-menu-item" data-setting="subtitleTrack"><span>Subtitles</span><span class="submenu-indicator">▶</span></div>
              <div class="settings-menu-item" data-setting="subtitleSize"><span>Subtitle Size</span><span class="submenu-indicator">▶</span></div>
              <div class="settings-menu-item" data-setting="subtitlePosition"><span>Subtitle Position</span><span class="submenu-indicator">▶</span></div>
              <div class="settings-menu-item" data-setting="uploadSubtitle"><span>Upload Subtitle</span><span>${icons.upload}</span></div>
              <div class="settings-menu-item" data-setting="cloudSubtitles"><span>Search Cloud</span><span>${icons.cloud}</span></div>
            </div>
            <div class="submenu playback-speed-menu">
              ${[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => `<div class="submenu-item" data-speed="${speed}"><span class="check-icon">${icons.check}</span><span>${speed}x</span></div>`).join('')}
            </div>
            <div class="submenu subtitle-track-menu">
              <div class="submenu-item active" data-track="off"><span class="check-icon">${icons.check}</span><span>Off</span></div>
              <div class="submenu-item" data-track="uploaded"><span class="check-icon">${icons.check}</span><span>Uploaded</span></div>
            </div>
            <div class="submenu subtitle-size-menu">
              ${['Small', 'Medium', 'Large', 'X-Large'].map(size => `<div class="submenu-item" data-size="${size.toLowerCase()}"><span class="check-icon">${icons.check}</span><span>${size}</span></div>`).join('')}
            </div>
            <div class="submenu subtitle-position-menu">
              <div class="submenu-item" data-position="top"><span class="check-icon">${icons.check}</span><span>Top</span></div>
              <div class="submenu-item active" data-position="bottom"><span class="check-icon">${icons.check}</span><span>Bottom</span></div>
              <div class="subtitle-offset-controls" style="padding: 10px; display: flex; align-items: center; justify-content: space-between; gap: 10px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 5px;">
                <span style="font-size: 0.85em; color: #aaa;">Offset:</span>
                <button class="offset-btn" data-offset="-20" style="padding: 5px 10px; background: rgba(255,255,255,0.1); border: none; color: white; border-radius: 4px; cursor: pointer;">−</button>
                <span class="offset-value" style="font-size: 0.85em; min-width: 30px; text-align: center;">0</span>
                <button class="offset-btn" data-offset="20" style="padding: 5px 10px; background: rgba(255,255,255,0.1); border: none; color: white; border-radius: 4px; cursor: pointer;">+</button>
              </div>
            </div>
            <div class="submenu cloud-subtitles-menu">
              <div class="cloud-subtitles-search">
                <input type="text" placeholder="Search subtitles..." class="cloud-search-input">
                <button class="cloud-search-btn">🔍</button>
              </div>
              <div class="cloud-subtitles-results"></div>
            </div>
            <div class="submenu upload-subtitle-menu">
              <div class="upload-zone">
                <input type="file" accept=".srt,.vtt" class="subtitle-input" multiple>
                <p>Drop subtitle files here</p>
                <p class="file-types">.srt, .vtt</p>
              </div>
              <div class="uploaded-subtitles-list"></div>
            </div>
          </div>
          <button class="control-btn fullscreen-btn" title="Fullscreen">${icons.fullscreen}</button>
        </div>
      </div>
    </div>
    <div class="subtitle-container subtitle-position-bottom"><div class="subtitle-text"></div></div>
    <div class="player-tooltip"></div>
    <input type="file" accept=".srt,.vtt" id="subtitleFileInput" style="display:none" multiple>
  `;

  return player;
}

function initCustomVideoPlayer(playerElement, options = {}) {
  const video = playerElement.querySelector('#customVideo');
  const loadingOverlay = playerElement.querySelector('.player-loading');
  const errorOverlay = playerElement.querySelector('.player-error');
  const controls = playerElement.querySelector('.player-controls');
  const progressContainer = playerElement.querySelector('.progress-container');
  const progressBar = playerElement.querySelector('.progress-bar');
  const bufferedBar = playerElement.querySelector('.buffered-bar');
  const playBtn = playerElement.querySelector('.play-btn-main');
  const volumeBtn = playerElement.querySelector('.volume-btn');
  const volumeSlider = playerElement.querySelector('.volume-slider');
  const skipButtons = playerElement.querySelectorAll('.skip-btn');
  const fullscreenBtn = playerElement.querySelector('.fullscreen-btn');
  const settingsBtn = playerElement.querySelector('.settings-btn');
  const settingsMenu = playerElement.querySelector('.settings-menu');
  const timeDisplay = playerElement.querySelector('.time-display');
  const currentTimeEl = timeDisplay.querySelector('.current-time');
  const durationEl = timeDisplay.querySelector('.duration');
  const subtitleContainer = playerElement.querySelector('.subtitle-container');
  const subtitleText = subtitleContainer.querySelector('.subtitle-text');

  let isPlaying = false;
  let isMuted = false;
  let controlsTimeout = null;
  let hlsInstance = null;

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function updateProgress() {
    if (video.duration) {
      progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
      currentTimeEl.textContent = formatTime(video.currentTime);
    }
  }

  function updateBuffered() {
    if (video.buffered.length > 0) {
      bufferedBar.style.width = `${(video.buffered.end(video.buffered.length - 1) / video.duration) * 100}%`;
    }
  }

  function showLoading() { loadingOverlay.classList.remove('hidden'); }
  function hideLoading() { loadingOverlay.classList.add('hidden'); }
  function showError() { errorOverlay.classList.remove('hidden'); controls.classList.add('hidden'); }
  function hideError() { errorOverlay.classList.add('hidden'); controls.classList.remove('hidden'); }

  function togglePlay() {
    if (video.paused) {
      video.play().catch(() => {});
      isPlaying = true;
      playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      playerElement.classList.add('playing');
    } else {
      video.pause();
      isPlaying = false;
      playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
      playerElement.classList.remove('playing');
    }
  }

  function toggleMute() {
    if (isMuted) {
      video.muted = false;
      isMuted = false;
      volumeBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
      volumeSlider.value = video.volume;
    } else {
      video.muted = true;
      isMuted = true;
      volumeBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
      volumeSlider.value = 0;
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      playerElement.requestFullscreen?.() || playerElement.webkitRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.();
    }
  }

  function skipVideo(seconds) {
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
  }

  function showControls() {
    playerElement.classList.add('show-controls');
    clearTimeout(controlsTimeout);
    if (isPlaying) {
      controlsTimeout = setTimeout(() => {
        playerElement.classList.remove('show-controls');
      }, 3000);
    }
  }

  function initHls(videoUrl) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
      return;
    }
    try {
      if (!window.Hls) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js';
        script.onload = () => initHlsInternal(videoUrl);
        script.onerror = showError;
        document.head.appendChild(script);
      } else {
        initHlsInternal(videoUrl);
      }
    } catch { showError(); }
  }

  function initHlsInternal(url) {
    if (!window.Hls) return;
    if (hlsInstance) hlsInstance.destroy();
    hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
    hlsInstance.loadSource(url);
    hlsInstance.attachMedia(video);
    hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, () => { hideLoading(); video.play().catch(() => {}); });
    hlsInstance.on(window.Hls.Events.ERROR, (e, data) => { if (data.fatal) showError(); });
  }

  // Event listeners
  video.addEventListener('loadedmetadata', () => { durationEl.textContent = formatTime(video.duration); hideLoading(); });
  video.addEventListener('play', () => { isPlaying = true; playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'; showControls(); });
  video.addEventListener('pause', () => { isPlaying = false; playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'; });
  video.addEventListener('timeupdate', () => { updateProgress(); updateBuffered(); });
  video.addEventListener('waiting', showLoading);
  video.addEventListener('canplay', hideLoading);
  video.addEventListener('error', showError);

  playBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);
  volumeBtn.addEventListener('click', toggleMute);
  volumeSlider.addEventListener('input', (e) => { video.volume = e.target.value; volumeSlider.value = video.volume; if (video.volume > 0 && isMuted) toggleMute(); });

  skipButtons.forEach(btn => btn.addEventListener('click', () => skipVideo(parseInt(btn.dataset.seconds))));
  progressContainer.addEventListener('click', (e) => { const pos = (e.clientX - progressContainer.getBoundingClientRect().left) / progressContainer.getBoundingClientRect().width; video.currentTime = pos * video.duration; });
  fullscreenBtn.addEventListener('click', toggleFullscreen);

  settingsBtn.addEventListener('click', () => { settingsMenu.classList.toggle('visible'); });
  playerElement.addEventListener('click', (e) => { if (!e.target.closest('.settings-wrapper')) settingsMenu.classList.remove('visible'); });

  // Playback speed
  const speedMenu = playerElement.querySelector('.playback-speed-menu');
  playerElement.querySelector('[data-setting="playbackSpeed"]')?.addEventListener('click', () => { speedMenu.classList.toggle('visible'); });
  speedMenu.querySelectorAll('.submenu-item').forEach(item => {
    item.addEventListener('click', () => {
      video.playbackRate = parseFloat(item.dataset.speed);
      speedMenu.classList.remove('visible');
      speedMenu.querySelectorAll('.submenu-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Subtitle size
  const sizeMenu = playerElement.querySelector('.subtitle-size-menu');
  playerElement.querySelector('[data-setting="subtitleSize"]')?.addEventListener('click', () => { sizeMenu.classList.toggle('visible'); });
  sizeMenu.querySelectorAll('.submenu-item').forEach(item => {
    item.addEventListener('click', () => {
      subtitleContainer.className = `subtitle-container subtitle-size-${item.dataset.size}`;
      sizeMenu.classList.remove('visible');
      sizeMenu.querySelectorAll('.submenu-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Subtitle position
  const positionMenu = playerElement.querySelector('.subtitle-position-menu');
  playerElement.querySelector('[data-setting="subtitlePosition"]')?.addEventListener('click', () => { positionMenu.classList.toggle('visible'); });
  positionMenu.querySelectorAll('.submenu-item[data-position]').forEach(item => {
    item.addEventListener('click', () => {
      // Remove existing position classes
      subtitleContainer.classList.remove('subtitle-position-top', 'subtitle-position-middle', 'subtitle-position-bottom');
      // Add new position class
      subtitleContainer.classList.add(`subtitle-position-${item.dataset.position}`);
      positionMenu.querySelectorAll('.submenu-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      showToast(`Subtitle position: ${item.dataset.position}`, 'info');
    });
  });

  // Subtitle offset controls
  let subtitleOffset = 0;
  const offsetValueEl = playerElement.querySelector('.offset-value');
  const offsetBtns = playerElement.querySelectorAll('.offset-btn');
  
  offsetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const change = parseInt(btn.dataset.offset);
      subtitleOffset = Math.max(-200, Math.min(200, subtitleOffset + change));
      offsetValueEl.textContent = subtitleOffset > 0 ? `+${subtitleOffset}` : subtitleOffset;
      subtitleContainer.style.bottom = `calc(100px + ${subtitleOffset}px)`;
      subtitleContainer.style.top = 'auto';
      subtitleContainer.style.transform = 'translateX(-50%)';
    });
  });

  // Subtitle track selection
  const subtitleTrackMenu = playerElement.querySelector('.subtitle-track-menu');
  playerElement.querySelector('[data-setting="subtitleTrack"]')?.addEventListener('click', () => { subtitleTrackMenu.classList.toggle('visible'); });
  
  // Upload subtitle handler
  const uploadSubtitleMenu = playerElement.querySelector('.upload-subtitle-menu');
  playerElement.querySelector('[data-setting="uploadSubtitle"]')?.addEventListener('click', () => { 
    uploadSubtitleMenu.classList.toggle('visible'); 
    subtitleTrackMenu.classList.remove('visible');
    cloudSubtitlesMenu.classList.remove('visible');
  });
  
  const uploadZone = playerElement.querySelector('.upload-zone');
  const subtitleInput = uploadZone?.querySelector('.subtitle-input');
  
  // Handle file input click
  uploadZone?.addEventListener('click', () => {
    subtitleInput?.click();
  });
  
  // Handle file selection
  subtitleInput?.addEventListener('change', async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.endsWith('.srt') || file.name.endsWith('.vtt')) {
          try {
            await handleSubtitleUpload(file);
            updateUploadedSubtitlesList();
          } catch (error) {
            console.error('Subtitle upload error:', error);
          }
        }
      }
    }
    // Reset input
    subtitleInput.value = '';
  });
  
  // Handle drag and drop
  uploadZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });
  
  uploadZone?.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });
  
  uploadZone?.addEventListener('drop', async (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.endsWith('.srt') || file.name.endsWith('.vtt')) {
          try {
            await handleSubtitleUpload(file);
            updateUploadedSubtitlesList();
          } catch (error) {
            console.error('Subtitle upload error:', error);
          }
        }
      }
    }
  });
  
  // Update uploaded subtitles list in menu
  function updateUploadedSubtitlesList() {
    const list = playerElement.querySelector('.uploaded-subtitles-list');
    if (!list) return;
    
    if (customSubtitles.length === 0) {
      list.innerHTML = '<p style="color: var(--text-light); font-size: 0.85em; padding: 10px;">No subtitles uploaded</p>';
      return;
    }
    
    list.innerHTML = customSubtitles.map((sub, index) => `
      <div class="loaded-subtitle-item ${index === customSubtitles.length - 1 ? 'active' : ''}">
        <span class="name">${sub.label.substring(0, 25)}${sub.label.length > 25 ? '...' : ''}</span>
        <button class="remove-btn" onclick="removeSubtitle(${index})">✕</button>
      </div>
    `).join('');
  }
  
  // Expose remove subtitle function globally
  window.removeSubtitle = function(index) {
    if (customSubtitles[index]) {
      const sub = customSubtitles[index];
      // Remove track from video
      if (sub.track && sub.track.parentNode) {
        sub.track.parentNode.removeChild(sub.track);
      }
      // Revoke blob URL
      if (sub.url) {
        URL.revokeObjectURL(sub.url);
      }
      // Remove from array
      customSubtitles.splice(index, 1);
      // Update list
      updateUploadedSubtitlesList();
      showToast('Subtitle removed', 'info');
    }
  };
  
// Cloud subtitles handler - Create a proper modal panel for subtitle search
  let cloudSubtitlesModal = null;
  
  function createCloudSubtitlesModal() {
    // Remove existing modal if any
    const existing = document.getElementById('cloudSubtitlesModal');
    if (existing) existing.remove();
    
    cloudSubtitlesModal = document.createElement('div');
    cloudSubtitlesModal.id = 'cloudSubtitlesModal';
    cloudSubtitlesModal.className = 'cloud-subtitles-modal';
    cloudSubtitlesModal.innerHTML = `
      <div class="cloud-subtitles-modal-content">
        <div class="cloud-subtitles-modal-header">
          <h3>☁️ Search Cloud Subtitles</h3>
          <button class="close-cloud-modal">&times;</button>
        </div>
        <div class="cloud-subtitles-modal-body">
          <div class="search-subtitle-form">
            <input type="text" class="cloud-search-input-modal" placeholder="Search subtitles (e.g., anime name, episode)...">
            <button class="cloud-search-btn-modal">🔍 Search</button>
          </div>
          <div class="cloud-results-modal"></div>
        </div>
      </div>
    `;
    document.body.appendChild(cloudSubtitlesModal);
    
    // Add styles for the modal if not exists
    if (!document.getElementById('cloudSubtitlesModalStyles')) {
      const styles = document.createElement('style');
      styles.id = 'cloudSubtitlesModalStyles';
      styles.textContent = `
        .cloud-subtitles-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          padding: 20px;
        }
        .cloud-subtitles-modal.visible {
          opacity: 1;
          visibility: visible;
        }
        .cloud-subtitles-modal-content {
          background: var(--glass-bg, rgba(22, 33, 62, 0.95));
          backdrop-filter: blur(10px);
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          max-height: 80vh;
          border: 1px solid rgba(233, 69, 96, 0.3);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: modalSlideIn 0.3s ease-out;
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .cloud-subtitles-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .cloud-subtitles-modal-header h3 {
          color: var(--accent, #e94560);
          margin: 0;
          font-size: 1.2em;
        }
        .close-cloud-modal {
          background: none;
          border: none;
          color: white;
          font-size: 1.8em;
          cursor: pointer;
          padding: 5px 10px;
          line-height: 1;
          transition: all 0.2s ease;
        }
        .close-cloud-modal:hover {
          color: var(--accent, #e94560);
          transform: scale(1.1);
        }
        .cloud-subtitles-modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }
        .search-subtitle-form {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .cloud-search-input-modal {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid rgba(233, 69, 96, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 1em;
          transition: all 0.3s ease;
        }
        .cloud-search-input-modal:focus {
          outline: none;
          border-color: var(--accent, #e94560);
          box-shadow: 0 0 15px rgba(233, 69, 96, 0.3);
        }
        .cloud-search-input-modal::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        .cloud-search-btn-modal {
          padding: 12px 24px;
          background: linear-gradient(135deg, var(--accent, #e94560), #ff6b6b);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          font-size: 1em;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .cloud-search-btn-modal:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(233, 69, 96, 0.4);
        }
        .cloud-search-btn-modal:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .cloud-results-modal {
          max-height: 400px;
          overflow-y: auto;
        }
        .cloud-results-modal .subtitle-result {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          margin-bottom: 10px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .cloud-results-modal .subtitle-result:hover {
          background: rgba(233, 69, 96, 0.15);
          border-color: rgba(233, 69, 96, 0.3);
          transform: translateX(5px);
        }
        .cloud-results-modal .subtitle-result-info {
          flex: 1;
          min-width: 0;
        }
        .cloud-results-modal .subtitle-result-info .name {
          color: white;
          font-weight: 500;
          margin-bottom: 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cloud-results-modal .subtitle-result-info .details {
          font-size: 0.85em;
          color: rgba(255, 255, 255, 0.6);
        }
        .cloud-results-modal .download-btn {
          padding: 10px 20px;
          background: var(--accent, #e94560);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9em;
          font-weight: bold;
          transition: all 0.2s ease;
          white-space: nowrap;
          margin-left: 10px;
        }
        .cloud-results-modal .download-btn:hover {
          background: #ff6b6b;
          transform: scale(1.05);
        }
        .cloud-results-modal .download-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .cloud-results-modal .loading-state {
          text-align: center;
          padding: 40px 20px;
          color: rgba(255, 255, 255, 0.7);
        }
        .cloud-results-modal .loading-state .loading-spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto 15px;
        }
        .cloud-results-modal .no-results {
          text-align: center;
          padding: 40px 20px;
          color: rgba(255, 255, 255, 0.5);
        }
        .cloud-results-modal .no-results-icon {
          font-size: 3em;
          margin-bottom: 15px;
        }
        @media (max-width: 540px) {
          .cloud-subtitles-modal-content {
            max-height: 90vh;
          }
          .search-subtitle-form {
            flex-direction: column;
          }
          .cloud-search-btn-modal {
            width: 100%;
          }
        }
      `;
      document.head.appendChild(styles);
    }
    
    // Event listeners
    const closeBtn = cloudSubtitlesModal.querySelector('.close-cloud-modal');
    closeBtn.addEventListener('click', closeCloudSubtitlesModal);
    
    cloudSubtitlesModal.addEventListener('click', (e) => {
      if (e.target === cloudSubtitlesModal) {
        closeCloudSubtitlesModal();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', handleCloudModalEscape);
    
    // Search functionality
    const searchInput = cloudSubtitlesModal.querySelector('.cloud-search-input-modal');
    const searchBtn = cloudSubtitlesModal.querySelector('.cloud-search-btn-modal');
    
    async function handleCloudSearchModal() {
      const query = searchInput.value.trim();
      if (!query) {
        showToast('Please enter a search term', 'warning');
        return;
      }
      
      const resultsContainer = cloudSubtitlesModal.querySelector('.cloud-results-modal');
      resultsContainer.innerHTML = `
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Searching for "${query}"...</p>
        </div>
      `;
      
      searchBtn.disabled = true;
      
      try {
        const results = await searchCloudSubtitles(query);
        displayCloudResultsModal(results, query);
      } catch (error) {
        console.error('Cloud search error:', error);
        resultsContainer.innerHTML = `
          <div class="no-results">
            <div class="no-results-icon">😕</div>
            <p>Search failed. Please try again.</p>
          </div>
        `;
      } finally {
        searchBtn.disabled = false;
      }
    }
    
    searchBtn.addEventListener('click', handleCloudSearchModal);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleCloudSearchModal();
      }
    });
    
    // Focus input
    setTimeout(() => searchInput.focus(), 100);
  }
  
  function displayCloudResultsModal(results, query) {
    const resultsContainer = cloudSubtitlesModal.querySelector('.cloud-results-modal');
    
    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <p>No subtitles found for "${query}"</p>
          <p style="font-size: 0.9em; margin-top: 10px; color: rgba(255,255,255,0.5);">Try a different search term or upload your own subtitle</p>
        </div>
      `;
      return;
    }
    
    resultsContainer.innerHTML = results.map((result, index) => `
      <div class="subtitle-result" data-id="${result.id}" data-filename="${result.file_name.replace(/'/g, "\\'")}" onclick="handleSubtitleClick('${result.id}', '${result.file_name.replace(/'/g, "\\'")}', this)">
        <div class="subtitle-result-info">
          <div class="name">${result.file_name}</div>
          <div class="details">
            ${result.language?.toUpperCase() || 'Unknown'} 
            • ⭐ ${result.rating || 'N/A'} 
            • ↓ ${result.downloads || 0}
          </div>
        </div>
        <button class="download-btn" onclick="event.stopPropagation(); handleSubtitleDownload('${result.id}', '${result.file_name.replace(/'/g, "\\'")}', this)">⬇</button>
      </div>
    `).join('');
  }
  
  // Global function to handle subtitle result click
  window.handleSubtitleClick = async function(subtitleId, fileName, element) {
    // Highlight selected
    element.parentElement.querySelectorAll('.subtitle-result').forEach(el => el.style.background = '');
    element.style.background = 'rgba(233, 69, 96, 0.25)';
    element.style.borderColor = 'var(--accent)';
    
    // Download and load
    await handleSubtitleDownload(subtitleId, fileName, element.querySelector('.download-btn'));
  };
  
  // Global function to handle subtitle download
  window.handleSubtitleDownload = async function(subtitleId, fileName, button) {
    button.disabled = true;
    button.textContent = '⏳';
    
    const success = await downloadAndLoadCloudSubtitle(subtitleId, fileName);
    
    if (success) {
      button.textContent = '✓';
      button.style.background = 'var(--success, #00d26a)';
      showToast(`Loaded: ${fileName}`, 'success');
      
      // Update uploaded subtitles list in the player
      updateUploadedSubtitlesList();
      
      // Close modal after short delay
      setTimeout(() => {
        closeCloudSubtitlesModal();
      }, 1000);
    } else {
      button.disabled = false;
      button.textContent = '⬇';
    }
  };
  
  function openCloudSubtitlesModal() {
    if (!cloudSubtitlesModal) {
      createCloudSubtitlesModal();
    }
    cloudSubtitlesModal.classList.add('visible');
    
    // Pre-fill search with anime title if available
    const searchInput = cloudSubtitlesModal?.querySelector('.cloud-search-input-modal');
    if (searchInput && window.currentAnimeTitle) {
      searchInput.value = window.currentAnimeTitle;
    }
  }
  
  function closeCloudSubtitlesModal() {
    if (cloudSubtitlesModal) {
      cloudSubtitlesModal.classList.remove('visible');
      document.removeEventListener('keydown', handleCloudModalEscape);
    }
  }
  
  function handleCloudModalEscape(e) {
    if (e.key === 'Escape') {
      closeCloudSubtitlesModal();
    }
  }
  
  // Attach cloud subtitles click handler to player settings
  playerElement.querySelector('[data-setting="cloudSubtitles"]')?.addEventListener('click', () => {
    openCloudSubtitlesModal();
    // Close the settings menu
    settingsMenu?.classList.remove('visible');
  });
  
  // Update uploaded subtitles list on init
  updateUploadedSubtitlesList();

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (!playerElement.isConnected) return;
    if (e.target.tagName === 'INPUT') return;
    switch (e.key) {
      case ' ': case 'k': e.preventDefault(); togglePlay(); break;
      case 'm': toggleMute(); break;
      case 'f': toggleFullscreen(); break;
      case 'ArrowLeft': e.preventDefault(); skipVideo(-5); break;
      case 'ArrowRight': e.preventDefault(); skipVideo(5); break;
      case 'j': skipVideo(-10); break;
      case 'l': skipVideo(10); break;
    }
  });

  playerElement.addEventListener('mousemove', showControls);
  playerElement.addEventListener('mouseleave', () => { if (isPlaying) playerElement.classList.remove('show-controls'); });

  video.addEventListener('timeupdate', () => {
    const tracks = video.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].mode === 'showing') {
        const cue = tracks[i].activeCues?.[0];
        subtitleText.textContent = cue ? cue.text : '';
        subtitleContainer.classList.toggle('visible', !!cue);
        break;
      }
    }
  });

  errorOverlay.querySelector('.retry-btn')?.addEventListener('click', () => { hideError(); showLoading(); initHls(playerElement.dataset.videoUrl); });

  playerElement.dataset.videoUrl = options.videoUrl || '';
  if (options.videoUrl) { showLoading(); initHls(options.videoUrl); }

  return {
    element: playerElement,
    video,
    loadVideo: (url) => { playerElement.dataset.videoUrl = url; hideError(); showLoading(); initHls(url); },
    setEpisodeCallbacks: (onPrev, onNext) => {
      const prevBtn = playerElement.querySelector('.prev-episode');
      const nextBtn = playerElement.querySelector('.next-episode');
      prevBtn.disabled = !onPrev;
      nextBtn.disabled = !onNext;
      prevBtn.onclick = onPrev || (() => {});
      nextBtn.onclick = onNext || (() => {});
    }
  };
}

// ============================================
// END CUSTOM VIDEO PLAYER
// ============================================

// Home page state
let homePageData = null;
let currentSpotlightIndex = 0;
let spotlightInterval = null;
let isHomePageVisible = true;

// ============================================
// HOME PAGE FUNCTIONS
// ============================================

// Fetch home page data from API
async function fetchHomePageData() {
  const provider = providerSelect.value;
  const homeUrl = buildUrl(provider, 'home');
  
  console.log('Fetching home page data from:', homeUrl);
  
  try {
    const data = await safeFetch(homeUrl);
    return normalizeHomeData(data);
  } catch (error) {
    console.error('Error fetching home page data:', error);
    throw error;
  }
}

// Normalize home page data
function normalizeHomeData(data) {
  if (!data) return null;
  
  // Handle wrapped response {status, data: {...}}
  if (data.data) {
    data = data.data;
  }
  
  return {
    status: data.status || true,
    spotlight: normalizeSpotlight(data.spotlight || []),
    trending: normalizeAnimeList(data.trending || []),
    topAiring: normalizeAnimeList(data.topAiring || []),
    mostPopular: normalizeAnimeList(data.mostPopular || []),
    mostFavorite: normalizeAnimeList(data.mostFavorite || []),
    latestCompleted: normalizeAnimeList(data.latestCompleted || []),
    latestEpisode: normalizeAnimeList(data.latestEpisode || []),
    newAdded: normalizeAnimeList(data.newAdded || []),
    topUpcoming: normalizeAnimeList(data.topUpcoming || []),
    topTen: normalizeTopTen(data.topTen || { today: [], week: [], month: [] }),
    genres: data.genres || []
  };
}

// Normalize spotlight data
function normalizeSpotlight(spotlightList) {
  return spotlightList.map(item => ({
    title: item.title || 'Unknown Title',
    alternativeTitle: item.alternativeTitle || '',
    id: item.id || '',
    poster: item.poster || 'https://via.placeholder.com/400x600',
    episodes: {
      sub: item.episodes?.sub || 0,
      dub: item.episodes?.dub || 0,
      eps: item.episodes?.eps || 0
    },
    rank: item.rank || 0,
    type: item.type || 'TV',
    quality: item.quality || 'HD',
    duration: item.duration || 'Unknown',
    aired: item.aired || 'Unknown',
    synopsis: item.synopsis || 'No synopsis available.'
  }));
}

// Normalize anime list data
function normalizeAnimeList(animeList) {
  return animeList.map(item => ({
    title: item.title || 'Unknown Title',
    alternativeTitle: item.alternativeTitle || '',
    id: item.id || '',
    poster: item.poster || 'https://via.placeholder.com/200x300',
    episodes: {
      sub: item.episodes?.sub || 0,
      dub: item.episodes?.dub || 0,
      eps: item.episodes?.eps || 0
    },
    type: item.type || 'TV'
  }));
}

// Normalize top 10 data
function normalizeTopTen(topTen) {
  return {
    today: normalizeAnimeList(topTen.today || []).slice(0, 10),
    week: normalizeAnimeList(topTen.week || []).slice(0, 10),
    month: normalizeAnimeList(topTen.month || []).slice(0, 10)
  };
}

// Show home page
function showHomePage() {
  const homePage = document.getElementById('homePage');
  const searchContainer = document.querySelector('.search-container');
  const resultsContainer = document.getElementById('results');
  const detailsContainer = document.getElementById('details');
  const episodesContainer = document.getElementById('episodes');
  const serversContainer = document.getElementById('servers');
  const homeBtn = document.getElementById('homeBtn');
  const searchNavBtn = document.getElementById('searchNavBtn');
  
  // Update navigation
  homeBtn.classList.add('active');
  searchNavBtn.classList.remove('active');
  
  // Show home page, hide search
  homePage.classList.add('visible');
  homePage.classList.remove('hidden');
  searchContainer.classList.remove('visible');
  resultsContainer.innerHTML = '';
  detailsContainer.innerHTML = '';
  episodesContainer.innerHTML = '';
  serversContainer.innerHTML = '';
  
  isHomePageVisible = true;
  
  // Load home page data if not loaded
  if (!homePageData) {
    loadHomePage();
  }
}

// Show search page
function showSearchPage() {
  const homePage = document.getElementById('homePage');
  const searchContainer = document.querySelector('.search-container');
  const homeBtn = document.getElementById('homeBtn');
  const searchNavBtn = document.getElementById('searchNavBtn');
  
  // Update navigation
  homeBtn.classList.remove('active');
  searchNavBtn.classList.add('active');
  
  // Hide home page, show search
  homePage.classList.remove('visible');
  homePage.classList.add('hidden');
  searchContainer.classList.add('visible');
  
  isHomePageVisible = false;
  
  // Stop spotlight slider
  stopSpotlightSlider();
}

// Load home page data and render
async function loadHomePage() {
  const homeContent = document.getElementById('homeContent');
  
  // Show loading state
  homeContent.innerHTML = renderHomeLoading();
  
  try {
    homePageData = await fetchHomePageData();
    
    if (!homePageData || !homePageData.status) {
      throw new Error('Failed to load home page data');
    }
    
    // Render home page
    homeContent.innerHTML = renderHomePage(homePageData);
    
    // Initialize spotlight slider
    initSpotlightSlider();
    
    showToast('Home page loaded successfully', 'success');
  } catch (error) {
    console.error('Error loading home page:', error);
    homeContent.innerHTML = renderHomeError(error.message);
  }
}

// Render loading state
function renderHomeLoading() {
  return `
    <div class="home-section">
      <div class="section-header">
        <h2>🔥 Featured</h2>
      </div>
      <div class="spotlight-container">
        <div class="home-skeleton" style="height: 400px; border-radius: 16px;">
          <div class="skeleton" style="height: 100%; width: 100%;"></div>
        </div>
      </div>
    </div>
    <div class="home-section">
      <div class="section-header">
        <h2>📊 Top 10</h2>
      </div>
      <div class="home-skeleton">
        ${Array(6).fill('<div class="skeleton-card"><div class="skeleton skeleton-img"></div></div>').join('')}
      </div>
    </div>
    <div class="home-section">
      <div class="section-header">
        <h2>🔥 Trending</h2>
      </div>
      <div class="home-skeleton">
        ${Array(6).fill('<div class="skeleton-card"><div class="skeleton skeleton-img"></div></div>').join('')}
      </div>
    </div>
  `;
}

// Render error state
function renderHomeError(message) {
  return `
    <div class="home-error">
      <div class="error-icon">😕</div>
      <h2>Oops! Something went wrong</h2>
      <p>${message || 'Unable to load home page data. Please try again.'}</p>
      <button class="retry-btn" onclick="loadHomePage()">🔄 Retry</button>
    </div>
  `;
}

// Render complete home page
function renderHomePage(data) {
  let html = '';
  
  // Spotlight section
  if (data.spotlight && data.spotlight.length > 0) {
    html += renderSpotlightSection(data.spotlight);
  }
  
  // Genres section
  if (data.genres && data.genres.length > 0) {
    html += renderGenresSection(data.genres);
  }
  
  // Top 10 section
  if (data.topTen && (data.topTen.today?.length > 0 || data.topTen.week?.length > 0 || data.topTen.month?.length > 0)) {
    html += renderTopTenSection(data.topTen);
  }
  
  // Trending section
  if (data.trending && data.trending.length > 0) {
    html += renderAnimeSection('📈 Trending Now', 'trending', data.trending);
  }
  
  // Top Airing section
  if (data.topAiring && data.topAiring.length > 0) {
    html += renderAnimeSection('▶️ Top Airing', 'topAiring', data.topAiring);
  }
  
  // Most Popular section
  if (data.mostPopular && data.mostPopular.length > 0) {
    html += renderAnimeSection('⭐ Most Popular', 'mostPopular', data.mostPopular);
  }
  
  // Most Favorite section
  if (data.mostFavorite && data.mostFavorite.length > 0) {
    html += renderAnimeSection('❤️ Most Favorite', 'mostFavorite', data.mostFavorite);
  }
  
  // Latest Completed section
  if (data.latestCompleted && data.latestCompleted.length > 0) {
    html += renderAnimeSection('✅ Latest Completed', 'latestCompleted', data.latestCompleted);
  }
  
  // Latest Episode section
  if (data.latestEpisode && data.latestEpisode.length > 0) {
    html += renderAnimeSection('🎬 Latest Episodes', 'latestEpisode', data.latestEpisode);
  }
  
  // New Added section
  if (data.newAdded && data.newAdded.length > 0) {
    html += renderAnimeSection('🆕 Newly Added', 'newAdded', data.newAdded);
  }
  
  // Top Upcoming section
  if (data.topUpcoming && data.topUpcoming.length > 0) {
    html += renderAnimeSection('🚀 Top Upcoming', 'topUpcoming', data.topUpcoming);
  }
  
  return html;
}

// Render spotlight section
function renderSpotlightSection(spotlightList) {
  const slides = spotlightList.map((item, index) => `
    <div class="spotlight-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
      <img src="${item.poster}" alt="${item.title}" loading="lazy">
      <div class="spotlight-overlay">
        <div class="spotlight-rank">#${item.rank || index + 1}</div>
        <h2 class="spotlight-title">${item.title}</h2>
        <div class="spotlight-meta">
          <span>${item.type || 'TV'}</span>
          ${item.quality ? `<span class="quality">${item.quality}</span>` : ''}
          <span>${item.duration || 'Unknown duration'}</span>
          ${item.episodes?.sub > 0 ? `<span>📺 ${item.episodes.sub} eps</span>` : ''}
        </div>
        <p class="spotlight-synopsis">${item.synopsis?.substring(0, 200)}${item.synopsis?.length > 200 ? '...' : ''}</p>
        <div class="spotlight-actions">
          <button class="spotlight-btn primary" onclick="selectAnime('${item.id}', '${item.title.replace(/'/g, "\\'")}')">
            ▶️ Watch Now
          </button>
          <button class="spotlight-btn secondary" onclick="selectAnime('${item.id}', '${item.title.replace(/'/g, "\\'")}')">
            ℹ️ More Info
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  const dots = spotlightList.map((_, index) => `
    <button class="spotlight-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
  `).join('');
  
  return `
    <div class="home-section">
      <div class="spotlight-container">
        <div class="spotlight-slider">
          ${slides}
          <button class="spotlight-nav prev" onclick="prevSpotlight()">❮</button>
          <button class="spotlight-nav next" onclick="nextSpotlight()">❯</button>
          <div class="spotlight-dots">${dots}</div>
        </div>
      </div>
    </div>
  `;
}

// Render genres section
function renderGenresSection(genres) {
  const genreButtons = genres.map(genre => `
    <button class="genre-tag-btn" onclick="searchByGenre('${genre.replace(/'/g, "\\'")}')">${genre}</button>
  `).join('');
  
  return `
    <div class="home-section">
      <div class="section-header">
        <h2>🏷️ Browse by Genre</h2>
      </div>
      <div class="genres-container">${genreButtons}</div>
    </div>
  `;
}

// Render top 10 section
function renderTopTenSection(topTen) {
  const renderTop10List = (list, period) => {
    if (!list || list.length === 0) return '<p style="color: var(--text-light); text-align: center;">No data available</p>';
    
    return list.slice(0, 5).map((item, index) => `
      <div class="top10-item" onclick="selectAnime('${item.id}', '${item.title.replace(/'/g, "\\'")}')">
        <div class="top10-rank">${index + 1}</div>
        <img src="${item.poster}" alt="${item.title}" loading="lazy">
        <div class="top10-item-info">
          <div class="title">${item.title}</div>
          <div class="episodes">${item.episodes?.sub > 0 ? `${item.episodes.sub} eps` : item.type || 'TV'}</div>
        </div>
      </div>
    `).join('');
  };
  
  return `
    <div class="home-section">
      <div class="section-header">
        <h2>📊 Top 10 Rankings</h2>
      </div>
      <div class="top10-section">
        <div class="top10-category">
          <h3>📅 Today</h3>
          ${renderTop10List(topTen.today, 'today')}
        </div>
        <div class="top10-category">
          <h3>📆 This Week</h3>
          ${renderTop10List(topTen.week, 'week')}
        </div>
        <div class="top10-category">
          <h3>🗓️ This Month</h3>
          ${renderTop10List(topTen.month, 'month')}
        </div>
      </div>
    </div>
  `;
}

// Render anime section
function renderAnimeSection(title, categoryKey, animeList) {
  const animeCards = animeList.slice(0, 12).map(anime => `
    <div class="home-anime-card" onclick="selectAnime('${anime.id}', '${anime.title.replace(/'/g, "\\'")}')">
      <img src="${anime.poster}" alt="${anime.title}" loading="lazy">
      <div class="home-anime-card-content">
        <h3>${anime.title}</h3>
        <p>${anime.episodes?.sub > 0 ? `${anime.episodes.sub} eps` : anime.type || 'TV'}</p>
      </div>
    </div>
  `).join('');
  
  return `
    <div class="home-section">
      <div class="section-header">
        <h2>${title}</h2>
        <button class="see-all-btn" onclick="viewAllCategory('${categoryKey}')">See All →</button>
      </div>
      <div class="home-anime-grid">${animeCards}</div>
    </div>
  `;
}

// Initialize spotlight slider
function initSpotlightSlider() {
  if (!homePageData?.spotlight?.length) return;
  
  currentSpotlightIndex = 0;
  
  // Auto-rotate every 5 seconds
  spotlightInterval = setInterval(() => {
    nextSpotlight();
  }, 5000);
}

// Stop spotlight slider
function stopSpotlightSlider() {
  if (spotlightInterval) {
    clearInterval(spotlightInterval);
    spotlightInterval = null;
  }
}

// Go to next spotlight slide
function nextSpotlight() {
  if (!homePageData?.spotlight?.length) return;
  
  currentSpotlightIndex = (currentSpotlightIndex + 1) % homePageData.spotlight.length;
  updateSpotlightSlide();
}

// Go to previous spotlight slide
function prevSpotlight() {
  if (!homePageData?.spotlight?.length) return;
  
  currentSpotlightIndex = (currentSpotlightIndex - 1 + homePageData.spotlight.length) % homePageData.spotlight.length;
  updateSpotlightSlide();
}

// Update spotlight slide display
function updateSpotlightSlide() {
  const slides = document.querySelectorAll('.spotlight-slide');
  const dots = document.querySelectorAll('.spotlight-dot');
  
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSpotlightIndex);
  });
  
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSpotlightIndex);
  });
}

// View all anime in a category
function viewAllCategory(categoryKey) {
  console.log('View all category:', categoryKey);
  showToast(`Showing all ${categoryKey} - Filter by provider if needed`, 'info');
  showSearchPage();
  searchInput.focus();
}

// Search by genre
function searchByGenre(genre) {
  showSearchPage();
  searchInput.value = genre;
  searchInput.focus();
  searchAnime();
}

// Expose home page functions to global scope
window.loadHomePage = loadHomePage;
window.showHomePage = showHomePage;
window.showSearchPage = showSearchPage;
window.nextSpotlight = nextSpotlight;
window.prevSpotlight = prevSpotlight;
window.viewAllCategory = viewAllCategory;
window.searchByGenre = searchByGenre;

// ============================================
// END HOME PAGE FUNCTIONS
// ============================================

function showToast(message, type = 'info') {
  const existingContainer = document.querySelector('.toast-container');
  if (existingContainer) {
    existingContainer.remove();
  }
  
  const container = document.createElement('div');
  container.className = 'toast-container';
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<span style="font-size:1.2em;">${icon}</span> ${message}`;
  
  container.appendChild(toast);
  document.body.appendChild(container);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => container.remove(), 300);
  }, 3000);
}

function showSkeletonLoading() {
  const skeletonCount = 12;
  let skeletonHTML = '';
  
  for (let i = 0; i < skeletonCount; i++) {
    skeletonHTML += `
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
    `;
  }
  
  resultsContainer.innerHTML = skeletonHTML;
}

// Main function to search for anime
async function searchAnime() {
  const query = searchInput.value.trim();
  
  if (!query) {
    showToast('Please enter a search query', 'warning');
    return;
  }
  
  try {
    showSkeletonLoading();
    
    const provider = providerSelect.value;
    const searchUrl = buildUrl(provider, 'search', { query });
    console.log('Search URL:', searchUrl);
    
    const data = await safeFetch(searchUrl);
    
    let results = [];
    
    if (data && data.data && data.data.response && Array.isArray(data.data.response)) {
      results = data.data.response;
    } else if (Array.isArray(data)) {
      results = data;
    } else if (data && data.results && Array.isArray(data.results)) {
      results = data.results;
    } else if (data && data.anime && Array.isArray(data.anime)) {
      results = data.anime;
    } else if (data && data.data && Array.isArray(data.data)) {
      results = data.data;
    }
    
    if (results.length === 0) {
      resultsContainer.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-light);">No results found. Try a different search term.</p>';
      return;
    }
    
    displayResults(results);
    showToast(`Found ${results.length} results`, 'success');
    
  } catch (error) {
    console.error('Search error:', error);
    resultsContainer.innerHTML = `<p class="error" style="text-align:center;padding:40px;color:var(--accent);">Search failed: ${error.message}. Check your connection and try again.</p>`;
  }
}

// Function to display search results
function displayResults(results) {
  // Clear the anime cache when new search results are displayed
  hianimeScrapAnimeCache = {};
  
  resultsContainer.innerHTML = results.map(anime => {
    const title = anime.title || anime.name || anime.englishName || 'Unknown Title';
    const id = anime.id || anime.animeId || anime.mal_id || '';
    const image = anime.image || anime.poster || anime.coverImage || 'https://via.placeholder.com/150x200';
    const releaseDate = anime.releaseDate || anime.year || anime.startDate || 'N/A';
    
    // Handle hianime-scrap episodes format: {sub: 1155, dub: 1143, eps: 1155}
    let episodeInfo = '';
    if (anime.episodes) {
      if (typeof anime.episodes === 'object') {
        const sub = anime.episodes.sub || 0;
        const dub = anime.episodes.dub || 0;
        const eps = anime.episodes.eps || 0;
        if (sub > 0 || dub > 0) {
          episodeInfo = `<p>${sub > 0 ? `Sub: ${sub}` : ''}${sub > 0 && dub > 0 ? ' | ' : ''}${dub > 0 ? `Dub: ${dub}` : ''}</p>`;
        } else if (eps > 0) {
          episodeInfo = `<p>Episodes: ${eps}</p>`;
        }
      } else {
        episodeInfo = `<p>Episodes: ${anime.episodes}</p>`;
      }
    }
    
    // Handle hianime-scrap type and duration
    const type = anime.type ? `<p>${anime.type}</p>` : '';
    const duration = anime.duration ? `<p>${anime.duration}</p>` : '';
    
    // For hianime-scrap, store anime data in cache and pass just the ID
    const provider = providerSelect.value;
    if (provider === 'hianime-scrap') {
      // Store anime data in global cache for selectAnime to retrieve
      hianimeScrapAnimeCache[id] = anime;
      
      return `
        <div class="anime-card" onclick="selectAnime('${id.replace(/'/g, "\\'")}')">
          <img src="${image}" alt="${title}" loading="lazy">
          <h3>${title}</h3>
          ${episodeInfo}
          ${type}
          ${duration}
          <p>${releaseDate}</p>
        </div>
      `;
    }
    
    return `
      <div class="anime-card" onclick="selectAnime('${id.replace(/'/g, "\\'")}', '${title.replace(/'/g, "\\'")}')">
        <img src="${image}" alt="${title}" loading="lazy">
        <h3>${title}</h3>
        ${episodeInfo}
        ${type}
        ${duration}
        <p>${releaseDate}</p>
      </div>
    `;
  }).join('');
}

// Function to select anime and fetch details
async function selectAnime(id, titleParam) {
  if (!id) {
    alert('Invalid anime ID');
    return;
  }
  
  const provider = providerSelect.value;
  
  // For hianime-scrap, retrieve anime data from cache
  const isHianimeScrap = provider === 'hianime-scrap';
  const animeDataFromSearch = isHianimeScrap ? hianimeScrapAnimeCache[id] : null;
  
  try {
    detailsContainer.innerHTML = '<p>Loading details...</p>';
    
    // For hianime-scrap, use data from search results instead of info API
    if (isHianimeScrap && animeDataFromSearch) {
      const animeData = {
        ...animeDataFromSearch,
        id: animeDataFromSearch.id || id,
        __provider: provider
      };
      
      // Try to fetch episodes list from API
      try {
        const episodesUrl = buildUrl(provider, 'episodes', { id });
        console.log('Episodes URL:', episodesUrl);
        
        const episodesData = await safeFetch(episodesUrl);
        animeData.episodes = extractEpisodes(episodesData, provider);
        
        // If we got episodes from API, display them
        if (animeData.episodes.length > 0) {
          displayAnimeDetails(animeData, animeDataFromSearch.title);
          return;
        }
      } catch (epError) {
        console.warn('Could not fetch episodes for hianime-scrap:', epError);
      }
      
      // If episodes API failed or returned empty, generate from episode count
      // as fallback
      const epCount = animeData.episodes?.eps || 
                      animeData.episodes?.sub || 
                      animeData.episodes?.dub || 
                      animeData.episodes?.total ||
                      animeData.episodes?.episodeCount || 
                      animeData.episodes?.totalEpisodes ||
                      0;
      
      if (epCount > 0) {
        // Generate episode list from count
        animeData.episodes = Array.from({ length: Math.min(epCount, 500) }, (_, i) => ({
          id: `${id}::ep=${i + 1}`,  // Use format that matches API
          number: i + 1,
          title: `Episode ${i + 1}`,
          isFiller: false
        }));
        console.log(`Generated ${epCount} episode buttons from count`);
      } else {
        animeData.episodes = [];
      }
      
      displayAnimeDetails(animeData, animeDataFromSearch.title);
      return;
    }
    
    // For other providers, fetch info from API
    const title = typeof titleParam === 'string' ? titleParam : null;
    
    const infoUrl = buildUrl(provider, 'info', { id });
    console.log('Info URL:', infoUrl);
    
    const data = await safeFetch(infoUrl);
    
    // Normalize anime data structure
    let animeData = normalizeAnimeData(data, id, provider);
    
    // If episodes not in info response, fetch separately
    if (!animeData.episodes || animeData.episodes.length === 0) {
      try {
        const episodesUrl = buildUrl(provider, 'episodes', { id });
        console.log('Episodes URL:', episodesUrl);
        
        const episodesData = await safeFetch(episodesUrl);
        animeData.episodes = extractEpisodes(episodesData, provider);
      } catch (epError) {
        console.warn('Could not fetch episodes separately:', epError);
        animeData.episodes = [];
      }
    }
    
    animeData.__provider = provider;
    displayAnimeDetails(animeData, title || animeData.title);
    
  } catch (error) {
    console.error('Details error:', error);
    detailsContainer.innerHTML = `<p class="error">Error loading anime details: ${error.message}</p>`;
  }
}

// Normalize anime data from different API response formats
function normalizeAnimeData(data, id, provider) {
  // Handle different response structures
  
  // Handle hianime-scrap format: {success, data: {...anime details...}}
  if (data && data.data && provider === 'hianime-scrap') {
    return {
      ...data.data,
      id: data.data.id || id,
      // Map hianime-scrap fields to standard format
      title: data.data.title,
      poster: data.data.poster,
      image: data.data.poster,
      type: data.data.type,
      status: data.data.status,
      genres: data.data.genres || [],
      description: data.data.description || data.data.synopsis || '',
      totalEpisodes: data.data.episodes?.eps || data.data.episodes?.sub || data.data.episodes?.dub || 'Unknown'
    };
  }
  
  if (Array.isArray(data)) {
    // Response is an array - take first item if it matches ID
    const match = data.find(item => item && item.id === id) || data[0];
    if (match) return { ...match, id: match.id || id };
    return { id, episodes: [] };
  }
  
  if (data && data.results && Array.isArray(data.results)) {
    // Response has results wrapper
    const match = data.results.find(item => item && item.id === id) || data.results[0];
    if (match) return { ...match, id: match.id || id };
    return { ...data, id: data.id || id };
  }
  
  if (data && data.data) {
    // Response has data wrapper (common in REST APIs)
    return { ...data.data, id: data.data.id || id };
  }
  
  // Return data as-is if it looks like anime object
  if (data && (data.title || data.name || data.englishName)) {
    return { ...data, id: data.id || id };
  }
  
  // Fallback - return data with provided ID
  return { id, ...(data || {}) };
}

// Extract episodes from different API response formats
function extractEpisodes(data, provider) {
  if (!data) return [];
  
  // Handle hianime-scrap format: {success, data: [...episodes]}
  // Episodes have: id, title, alternativeTitle, isFiller, episodeNumber
  if (provider === 'hianime-scrap' && data && data.data && Array.isArray(data.data)) {
    return data.data.map((ep, index) => ({
      id: ep.id || `${index + 1}`,
      number: ep.episodeNumber || index + 1,
      title: ep.title || ep.alternativeTitle || `Episode ${ep.episodeNumber || index + 1}`,
      isFiller: ep.isFiller || false
    }));
  }
  
  // Handle different response structures
  if (Array.isArray(data)) {
    return data.map((ep, index) => ({
      id: ep.id || ep.episodeId || `${index + 1}`,
      number: ep.number || ep.episode || ep.ep || index + 1,
      title: ep.title || ep.name || `Episode ${index + 1}`
    }));
  }
  
  if (data.episodes && Array.isArray(data.episodes)) {
    return data.episodes.map((ep, index) => ({
      id: ep.id || ep.episodeId || `${index + 1}`,
      number: ep.number || ep.episode || ep.ep || index + 1,
      title: ep.title || ep.name || `Episode ${index + 1}`
    }));
  }
  
  if (data.data && Array.isArray(data.data)) {
    return data.data.map((ep, index) => ({
      id: ep.id || ep.episodeId || `${index + 1}`,
      number: ep.number || ep.episode || ep.ep || index + 1,
      title: ep.title || ep.name || `Episode ${index + 1}`
    }));
  }
  
  return [];
}

// Function to select episode and fetch servers
async function selectEpisode(episodeId, episodeNumber) {
  if (!episodeId) {
    alert('Invalid episode ID');
    return;
  }
  
  const provider = providerSelect.value;
  
  try {
    // Show loading indicator but keep container structure
    serversContainer.innerHTML = `
      <h3>Servers for Episode ${episodeNumber || '?'}</h3>
      <p class="loading-servers" style="padding: 20px; text-align: center; color: var(--accent);">
        <span class="loading-spinner"></span> Loading servers...
      </p>
    `;
    
    // Handle hianime-scrap - uses servers endpoint with id param and stream endpoint
    if (provider === 'hianime-scrap') {
      // Check if this is a generated episode ID (from episode count)
      // Format: anime-id::ep=12345
      let actualEpisodeId = episodeId;
      let actualEpisodeNumber = episodeNumber;
      
      // Extract episode number from generated ID format
      const generatedMatch = episodeId.match(/::ep=(\d+)$/);
      if (generatedMatch) {
        actualEpisodeNumber = generatedMatch[1];
        console.log(`Episode ${actualEpisodeNumber} selected (ID: ${episodeId})`);
      }
      
      const serversUrl = buildUrl(provider, 'servers', { id: episodeId });
      console.log('Servers URL:', serversUrl);
      
      const data = await safeFetch(serversUrl);
      displayHianimeScrapServers(data, actualEpisodeNumber || episodeNumber || '1', episodeId);
      
      // Auto-scroll to servers section
      serversContainer.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    // Handle animepahe differently - uses watch endpoint with episodeId param
    if (provider === 'animepahe') {
      const watchUrl = buildUrl(provider, 'watch', { episodeId });
      console.log('Watch URL:', watchUrl);
      
      const data = await safeFetch(watchUrl);
      displayServers(data, episodeNumber || '1');
      
      // Auto-scroll to servers section
      serversContainer.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    // Handle animekai - uses watch endpoint with episodeId
    if (provider === 'animekai') {
      const watchUrl = buildUrl(provider, 'watch', { episodeId });
      console.log('Watch URL:', watchUrl);
      
      const data = await safeFetch(watchUrl);
      displayServers(data, episodeNumber || '1');
      
      // Auto-scroll to servers section
      serversContainer.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    // Default server endpoint for other providers
    const serversUrl = buildUrl(provider, 'servers', { id: episodeId });
    console.log('Servers URL:', serversUrl);
    
    const data = await safeFetch(serversUrl);
    displayServers(data, episodeNumber || '1');
    
    // Auto-scroll to servers section
    serversContainer.scrollIntoView({ behavior: 'smooth' });
    
  } catch (error) {
    console.error('Servers error:', error);
    serversContainer.innerHTML = `<p class="error">Error loading servers: ${error.message}. Try a different episode.</p>`;
  }
}

// Expose functions to global scope for onclick handlers
window.selectAnime = selectAnime;
window.selectEpisode = selectEpisode;

// Function to display anime details
function displayAnimeDetails(anime, title) {
  console.log('Displaying anime details:', anime);
  
  // Set current anime ID for episode navigation
  currentAnimeId = anime.id || null;
  
  const animeTitle = anime.title || title || 'Unknown Title';
  
  // Store anime title globally for subtitle search
  window.currentAnimeTitle = title || animeTitle || '';
  
  const image = anime.image || anime.poster || anime.coverImage || 'https://via.placeholder.com/200x300';
  const japaneseTitle = anime.japaneseTitle || anime.jname || '';
  const type = anime.type || anime.format || 'Unknown';
  const status = anime.status || '';
  const genres = anime.genres || (anime.genre ? [anime.genre] : []);
  const totalEpisodes = anime.totalEpisodes || anime.episodeCount || anime.episodes?.length || 'Unknown';
  const description = anime.description || anime.synopsis || 'No description available';
  const url = anime.url || anime.animeUrl || '';
  
  detailsContainer.innerHTML = `
    <div class="anime-details">
      <div class="anime-header">
        <img src="${image}" alt="${animeTitle}" onerror="this.src='https://via.placeholder.com/200x300'">
        <div class="anime-info">
          <h2>${animeTitle}</h2>
          ${japaneseTitle ? `<p><strong>Japanese:</strong> ${japaneseTitle}</p>` : ''}
          <p><strong>Type:</strong> ${type}</p>
          ${status ? `<p><strong>Status:</strong> ${status}</p>` : ''}
          ${genres.length > 0 ? `<p><strong>Genres:</strong> ${genres.join(', ')}</p>` : ''}
          <p><strong>Episodes:</strong> ${totalEpisodes}</p>
          <p><strong>Description:</strong> ${description}</p>
          ${url ? `<p><a href="${url}" target="_blank" rel="noopener noreferrer" class="watch-link">View on Provider →</a></p>` : ''}
        </div>
      </div>
    </div>
  `;
  
  // Scroll to details section
  detailsContainer.scrollIntoView({ behavior: 'smooth' });
  
  // Display episodes
  if (anime.episodes && anime.episodes.length > 0) {
    currentEpisodes = anime.episodes;
    displayEpisodes(anime.episodes);
  } else {
    episodesContainer.innerHTML = '<p>No episodes available</p>';
    currentEpisodes = [];
  }
  
  serversContainer.innerHTML = '';
}

// Function to display episodes list
function displayEpisodes(episodes) {
  episodesContainer.innerHTML = '<h3>Episodes</h3>';
  
  const episodeList = episodes.map((ep, index) => {
    const epNumber = ep.number || ep.episode || ep.ep || index + 1;
    const epTitle = ep.title || ep.name || '';
    const epId = ep.id || `${index + 1}`;
    const isFiller = ep.isFiller;
    
    // Show filler indicator for hianime-scrap
    const fillerBadge = isFiller ? '<span style="color:#ffcc00;font-size:0.7em;"> ★Filler</span>' : '';
    
    return `
      <button 
        class="episode-btn ${isFiller ? 'filler' : ''}" 
        onclick="selectEpisode('${String(epId).replace(/'/g, "\\'")}', '${epNumber}')"
        title="${epTitle}${isFiller ? ' (Filler)' : ''}"
      >
        ${epNumber}${fillerBadge}
        ${epTitle ? `<br><small style="font-size:0.7em">${epTitle.substring(0, 20)}${epTitle.length > 20 ? '...' : ''}</small>` : ''}
      </button>
    `;
  }).join('');
  
  episodesContainer.innerHTML += `<div class="episodes-grid">${episodeList}</div>`;
}

// Function to display hianime-scrap servers with sub/dub/raw tabs
function displayHianimeScrapServers(data, episodeNumber, episodeId) {
  const isCustom = getUseCustomPlayer();
  
  // Add toggle switch header
  serversContainer.innerHTML = `
    <div class="player-toggle-header">
      <h3>Servers for Episode ${episodeNumber}</h3>
      <div class="player-toggle">
        <span class="toggle-custom">🎬 Custom</span>
        <label class="toggle-switch" onclick="handlePlayerToggle()">
          <input type="checkbox" id="playerToggle" ${isCustom ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
        <span class="toggle-default">🌐 Default</span>
      </div>
    </div>
  `;
  
  // Handle hianime-scrap format: {success, data: {episode, sub: [...], dub: [...], raw: [...]}}
  if (!data || !data.success || !data.data) {
    serversContainer.innerHTML += '<p>No servers available for this episode. Try a different episode.</p>';
    return;
  }
  
  const serverData = data.data;
  const subServers = serverData.sub || [];
  const dubServers = serverData.dub || [];
  const rawServers = serverData.raw || [];
  
  if (subServers.length === 0 && dubServers.length === 0 && rawServers.length === 0) {
    serversContainer.innerHTML += '<p>No servers available for this episode. Try a different episode.</p>';
    return;
  }
  
  // Store server data globally for playStream access
  window.hianimeScrapServerData = {
    episodeId,
    sub: subServers,
    dub: dubServers,
    raw: rawServers
  };
  
  let html = '<div class="servers-tabs">';
  
  // Sub tab
  html += `<div class="server-tab ${subServers.length > 0 ? 'active' : ''}" onclick="showHianimeScrapServers('sub')">Sub (${subServers.length})</div>`;
  // Dub tab
  html += `<div class="server-tab ${subServers.length === 0 && dubServers.length > 0 ? 'active' : ''}" onclick="showHianimeScrapServers('dub')">Dub (${dubServers.length})</div>`;
  // Raw tab
  html += `<div class="server-tab ${subServers.length === 0 && dubServers.length === 0 && rawServers.length > 0 ? 'active' : ''}" onclick="showHianimeScrapServers('raw')">Raw (${rawServers.length})</div>`;
  
  html += '</div>';
  html += '<div id="hianimeScrapServersList" class="servers-list"></div>';
  
  serversContainer.innerHTML += html;
  
  // Show default tab
  if (subServers.length > 0) {
    showHianimeScrapServers('sub');
  } else if (dubServers.length > 0) {
    showHianimeScrapServers('dub');
  } else {
    showHianimeScrapServers('raw');
  }
}

// Function to show hianime-scrap servers by type
window.showHianimeScrapServers = function(type) {
  const container = document.getElementById('hianimeScrapServersList');
  if (!container || !window.hianimeScrapServerData) return;
  
  // Update active tab
  document.querySelectorAll('.server-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.textContent.toLowerCase().includes(type)) {
      tab.classList.add('active');
    }
  });
  
  const servers = window.hianimeScrapServerData[type] || [];
  
  if (servers.length === 0) {
    container.innerHTML = `<p>No ${type} servers available.</p>`;
    return;
  }
  
  container.innerHTML = servers.map(server => {
    const name = server.name || `Server ${server.index || ''}`;
    const id = server.id;
    const serverType = type;
    
    return `
      <div class="server-option">
        <strong>${name}</strong>
        <p>Type: ${serverType.charAt(0).toUpperCase() + serverType.slice(1)}</p>
        <p><button class="play-btn" onclick="playHianimeScrapStream('${id}', '${serverType}', '${name.replace(/'/g, "\\'")}')">▶ Play</button></p>
      </div>
    `;
  }).join('');
};

// Function to play hianime-scrap stream
window.playHianimeScrapStream = async function(serverId, serverType, serverName) {
  if (!window.hianimeScrapServerData) {
    return alert('No server data available');
  }
  
  const episodeId = window.hianimeScrapServerData.episodeId;
  const streamUrl = buildUrl('hianime-scrap', 'stream', { 
    id: episodeId, 
    type: serverType, 
    server: serverName 
  });
  
  console.log('Stream URL:', streamUrl);
  
  try {
    // Show loading indicator but keep server list visible
    let loadingEl = serversContainer.querySelector('.stream-loading');
    if (!loadingEl) {
      loadingEl = document.createElement('p');
      loadingEl.className = 'stream-loading';
      loadingEl.innerHTML = '<span class="loading-spinner"></span> Loading stream...';
      loadingEl.style.cssText = 'padding: 20px; text-align: center; color: var(--accent);';
      serversContainer.prepend(loadingEl);
    }
    
    const data = await safeFetch(streamUrl);
    
    // Remove loading indicator
    if (loadingEl && loadingEl.parentNode) {
      loadingEl.parentNode.removeChild(loadingEl);
    }
    
    if (data && data.success && data.data) {
      displayHianimeScrapStream(data.data, serverName);
    } else {
      // Show error but keep server list visible
      let errorEl = serversContainer.querySelector('.stream-error');
      if (!errorEl) {
        errorEl = document.createElement('p');
        errorEl.className = 'stream-error error';
        errorEl.textContent = 'Failed to load stream. Try a different server.';
        serversContainer.prepend(errorEl);
      }
    }
  } catch (error) {
    console.error('Stream error:', error);
    // Remove loading indicator
    const loadingEl = serversContainer.querySelector('.stream-loading');
    if (loadingEl && loadingEl.parentNode) {
      loadingEl.parentNode.removeChild(loadingEl);
    }
    // Show error but keep server list visible
    let errorEl = serversContainer.querySelector('.stream-error');
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'stream-error error';
      errorEl.textContent = `Error loading stream: ${error.message}`;
      serversContainer.prepend(errorEl);
    }
  }
};

// Function to display hianime-scrap stream with subtitles using custom video player
function displayHianimeScrapStream(streamData, serverName) {
  const videoUrl = streamData.link?.file || streamData.link?.directUrl || '';
  const tracks = streamData.tracks || [];
  const intro = streamData.intro || { start: 0, end: 0 };
  const outro = streamData.outro || { start: 0, end: 0 };
  const useCustom = getUseCustomPlayer();
  
  if (!videoUrl) {
    // Show error but keep server list visible
    const existingError = serversContainer.querySelector('.stream-error');
    if (!existingError) {
      const errorDiv = document.createElement('p');
      errorDiv.className = 'stream-error error';
      errorDiv.textContent = 'No video URL available';
      serversContainer.prepend(errorDiv);
    }
    return;
  }
  
  // Remove existing players
  const existingCustomPlayer = document.getElementById('customVideoPlayer');
  if (existingCustomPlayer) {
    existingCustomPlayer.remove();
  }
  const existingDefaultPlayer = document.getElementById('defaultVideoPlayer');
  if (existingDefaultPlayer) {
    existingDefaultPlayer.remove();
  }
  
  // Create video player container - prepend to keep server list visible below
  let playerContainer = document.getElementById('videoPlayer');
  if (!playerContainer) {
    playerContainer = document.createElement('div');
    playerContainer.id = 'videoPlayer';
    playerContainer.className = 'video-player-section';
    playerContainer.style.marginBottom = '20px';
    serversContainer.prepend(playerContainer);
  } else {
    serversContainer.prepend(playerContainer);
  }
  
// Show intro/outro info
  let metaInfo = '';
  if (intro.start !== 0 || intro.end !== 0) {
    metaInfo += `<p style="color:#ffcc00;">Skip intro: ${intro.start}s - ${intro.end}s</p>`;
  }
  if (outro.start !== 0 || outro.end !== 0) {
    metaInfo += `<p style="color:#ffcc00;">Skip outro: ${outro.start}s - ${outro.end}s</p>`;
  }
  
  // Store anime title for cloud subtitle search
  window.currentAnimeTitle = serverName || window.currentAnimeTitle;
  
  // Add header with server name and meta info
  playerContainer.innerHTML = `
    <h3>Now Playing: ${serverName}</h3>
    ${metaInfo}
  `;
  
  if (useCustom) {
    // Create and append custom video player
    const player = createCustomVideoPlayer({
      videoUrl,
      title: serverName,
      tracks,
      intro,
      outro
    });
    
    playerContainer.appendChild(player);
    
    // Initialize the custom video player
    customVideoInstance = initCustomVideoPlayer(player, {
      videoUrl,
      tracks,
      intro,
      outro
    });
  } else {
    // Create and append default video player
    const player = createDefaultVideoPlayer({
      videoUrl,
      title: serverName
    });
    
    playerContainer.appendChild(player);
    
    // Initialize the default video player
    customVideoInstance = initDefaultVideoPlayer(player, {
      videoUrl
    });
  }
  
  // Set up episode navigation callbacks for hianime-scrap
  const currentIndex = window.hianimeScrapServerData?.currentEpisodeIndex ?? -1;
  const totalEpisodes = window.hianimeScrapServerData?.totalEpisodes ?? 0;
  
  if (customVideoInstance && window.hianimeScrapServerData?.episodes) {
    customVideoInstance.setEpisodeCallbacks(
      // Previous episode callback
      currentIndex > 0 ? () => {
        const prevEp = window.hianimeScrapServerData.episodes[currentIndex - 1];
        if (prevEp) {
          const epId = prevEp.id || `${window.hianimeScrapServerData.animeId}::ep=${prevEp.number}`;
          window.hianimeScrapServerData.currentEpisodeIndex = currentIndex - 1;
          playHianimeScrapStream(prevEp.id, window.hianimeScrapServerData.currentServerType || 'sub', prevEp.name || `Episode ${prevEp.number}`);
        }
      } : null,
      // Next episode callback
      currentIndex < totalEpisodes - 1 ? () => {
        const nextEp = window.hianimeScrapServerData.episodes[currentIndex + 1];
        if (nextEp) {
          const epId = nextEp.id || `${window.hianimeScrapServerData.animeId}::ep=${nextEp.number}`;
          window.hianimeScrapServerData.currentEpisodeIndex = currentIndex + 1;
          playHianimeScrapStream(nextEp.id, window.hianimeScrapServerData.currentServerType || 'sub', nextEp.name || `Episode ${nextEp.number}`);
        }
      } : null
    );
  }
}

// Helper function to load HLS stream
function loadHlsStream(video, videoUrl) {
  try {
    // Load HLS.js if not already loaded
    if (!window.Hls) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js';
      script.onload = () => initHls(video, videoUrl);
      script.onerror = () => {
        console.error('Failed to load HLS.js');
        window.open(videoUrl, '_blank');
      };
      document.head.appendChild(script);
    } else {
      initHls(video, videoUrl);
    }
  } catch (hlsError) {
    console.warn('HLS playback failed:', hlsError);
    window.open(videoUrl, '_blank');
  }
}

// Initialize HLS.js
function initHls(video, videoUrl) {
  if (!window.Hls) return;
  
  const hls = new window.Hls({
    enableWorker: true,
    lowLatencyMode: true
  });
  
  hls.loadSource(videoUrl);
  hls.attachMedia(video);
  
  hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
    video.play().catch(playError => {
      console.warn('Auto-play prevented:', playError);
    });
  });
  
  hls.on(window.Hls.Events.ERROR, (event, data) => {
    console.error('HLS error:', data);
    
    if (data.fatal) {
      switch (data.type) {
        case window.Hls.ErrorTypes.NETWORK_ERROR:
          hls.startLoad();
          break;
        case window.Hls.ErrorTypes.MEDIA_ERROR:
          hls.recoverMediaError();
          break;
        default:
          // Fatal error - open in new tab
          window.open(videoUrl, '_blank');
          return;
      }
    }
  });
}

// Function to display servers/streaming options (for animekai and animepahe)
function displayServers(data, episodeNumber) {
  const isCustom = getUseCustomPlayer();
  
  // Add toggle switch header
  serversContainer.innerHTML = `
    <div class="player-toggle-header">
      <h3>Servers for Episode ${episodeNumber}</h3>
      <div class="player-toggle">
        <span class="toggle-custom">🎬 Custom</span>
        <label class="toggle-switch" onclick="handlePlayerToggle()">
          <input type="checkbox" id="playerToggle" ${isCustom ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
        <span class="toggle-default">🌐 Default</span>
      </div>
    </div>
  `;
  
  // Normalize server data
  let servers = [];
  
  if (Array.isArray(data)) {
    servers = data;
  } else if (data && data.servers && Array.isArray(data.servers)) {
    servers = data.servers;
  } else if (data && data.sources && Array.isArray(data.sources)) {
    servers = data.sources;
  } else if (data && data.data && Array.isArray(data.data)) {
    servers = data.data;
  } else if (data && data.streamingServers && Array.isArray(data.streamingServers)) {
    servers = data.streamingServers;
  }
  
  if (servers.length === 0) {
    serversContainer.innerHTML += '<p>No servers available for this episode. Try a different episode.</p>';
    return;
  }
  
  let html = '<div class="servers-list">';
  
  servers.forEach((server, index) => {
    const name = server.name || server.serverName || server.quality || `Server ${index + 1}`;
    const url = server.url || server.file || server.src || server.streamUrl || '';
    
    html += `
      <div class="server-option">
        <strong>${name}</strong>
    `;
    
    if (url) {
      // Create proxy URL for CORS bypass
      const proxiedUrl = `${PROXY_BASE}/fetch?url=${encodeURIComponent(url)}`;
      
      html += `
        <p><a href="${url}" target="_blank" rel="noopener noreferrer">Open Original</a></p>
        <p><a href="${proxiedUrl}" target="_blank" rel="noopener noreferrer">Open via Proxy</a></p>
        <p><button class="play-btn" onclick="playStream('${proxiedUrl.replace(/'/g, "\\'")}', '${name.replace(/'/g, "\\'")}')">▶ Play</button></p>
      `;
      
      // Handle nested sources (for some provider responses)
      if (server.sources && Array.isArray(server.sources)) {
        server.sources.forEach((source, sIndex) => {
          const sourceUrl = source.url || source.file || source.src || '';
          if (sourceUrl) {
            const sourceProxied = `${PROXY_BASE}/fetch?url=${encodeURIComponent(sourceUrl)}`;
            const sourceQuality = source.quality || `Source ${sIndex + 1}`;
            html += `
              <hr style="margin: 10px 0; border-color: rgba(233,69,96,0.3);">
              <p><strong>${sourceQuality}</strong></p>
              <p><a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">Open Original</a></p>
              <p><a href="${sourceProxied}" target="_blank" rel="noopener noreferrer">Open via Proxy</a></p>
              <p><button class="play-btn" onclick="playStream('${sourceProxied.replace(/'/g, "\\'")}', '${sourceQuality.replace(/'/g, "\\'")}')">▶ Play</button></p>
            `;
          }
        });
      }
    } else {
      html += '<p>No direct URL available</p>';
    }
    
    // Show intro/outro markers if available
    if (server.intro || server.outro) {
      html += '<p class="meta">';
      if (server.intro) html += `Intro: ${server.intro.start}-${server.intro.end}s `;
      if (server.outro) html += `Outro: ${server.outro.start}-${server.outro.end}s`;
      html += '</p>';
    }
    
    html += '</div>';
  });
  
  html += '</div>';
  serversContainer.innerHTML += html;
}

// Function to play video stream with HLS.js support using custom video player
window.playStream = async function(proxiedUrl, title) {
  if (!proxiedUrl) {
    return alert('No stream URL available');
  }
  
  console.log('Playing stream:', proxiedUrl);
  
  const useCustom = getUseCustomPlayer();
  
  // Remove existing players
  const existingCustomPlayer = document.getElementById('customVideoPlayer');
  if (existingCustomPlayer) {
    existingCustomPlayer.remove();
  }
  const existingDefaultPlayer = document.getElementById('defaultVideoPlayer');
  if (existingDefaultPlayer) {
    existingDefaultPlayer.remove();
  }
  
  // Create video player container - prepend to keep server list visible
  let playerContainer = document.getElementById('videoPlayer');
  if (!playerContainer) {
    playerContainer = document.createElement('div');
    playerContainer.id = 'videoPlayer';
    playerContainer.className = 'video-player-section';
    playerContainer.style.marginBottom = '20px';
    serversContainer.prepend(playerContainer);
  } else {
    serversContainer.prepend(playerContainer);
  }
  
  // Store anime title for cloud subtitle search
  window.currentAnimeTitle = title || window.currentAnimeTitle;
  
  // Add header with title
  playerContainer.innerHTML = `<h3>Now Playing: ${title}</h3>`;
  
  if (useCustom) {
    // Create and append custom video player
    const player = createCustomVideoPlayer({
      videoUrl: proxiedUrl,
      title: title,
      tracks: [],
      intro: { start: 0, end: 0 },
      outro: { start: 0, end: 0 }
    });
    
    playerContainer.appendChild(player);
    
    // Initialize the custom video player
    customVideoInstance = initCustomVideoPlayer(player, {
      videoUrl: proxiedUrl,
      tracks: [],
      intro: { start: 0, end: 0 },
      outro: { start: 0, end: 0 }
    });
  } else {
    // Create and append default video player
    const player = createDefaultVideoPlayer({
      videoUrl: proxiedUrl,
      title: title
    });
    
    playerContainer.appendChild(player);
    
    // Initialize the default video player
    customVideoInstance = initDefaultVideoPlayer(player, {
      videoUrl: proxiedUrl
    });
  }
  
  // Set up episode navigation callbacks for animekai/animepahe
  const currentIndex = currentEpisodes.findIndex(ep => {
    const epNum = ep.number || ep.episode || ep.ep || 0;
    const currentEpNum = parseInt(document.querySelector('.episode-btn.active')?.textContent?.trim() || '0');
    return epNum === currentEpNum;
  });
  
  if (customVideoInstance && currentEpisodes.length > 0) {
    customVideoInstance.setEpisodeCallbacks(
      // Previous episode callback
      currentIndex > 0 ? () => {
        const prevEp = currentEpisodes[currentIndex - 1];
        if (prevEp) {
          const epId = prevEp.id || `${currentAnimeId}-episode-${prevEp.number || currentIndex}`;
          const epNum = prevEp.number || prevEp.episode || prevEp.ep || currentIndex;
          selectEpisode(epId, String(epNum));
        }
      } : null,
      // Next episode callback
      currentIndex < currentEpisodes.length - 1 ? () => {
        const nextEp = currentEpisodes[currentIndex + 1];
        if (nextEp) {
          const epId = nextEp.id || `${currentAnimeId}-episode-${nextEp.number || currentIndex + 2}`;
          const epNum = nextEp.number || nextEp.episode || nextEp.ep || currentIndex + 2;
          selectEpisode(epId, String(epNum));
        }
      } : null
    );
  }
}

// Event Listeners
searchBtn.addEventListener('click', searchAnime);

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchAnime();
  }
});

// Provider change handler - clear previous results
providerSelect.addEventListener('change', () => {
  resultsContainer.innerHTML = '';
  detailsContainer.innerHTML = '';
  episodesContainer.innerHTML = '';
  serversContainer.innerHTML = '';
  currentAnimeId = null;
  currentEpisodes = [];
  // Clear home page data to force reload with new provider
  homePageData = null;
});

// Home and Search navigation buttons
document.getElementById('homeBtn').addEventListener('click', showHomePage);
document.getElementById('searchNavBtn').addEventListener('click', showSearchPage);

// Initialize - show home page
document.addEventListener('DOMContentLoaded', () => {
  showHomePage();
});

