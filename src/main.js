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
      watch: API_ROOT + '/anime/animekai/watch/{id}'
    }
  },
  animepahe: {
    base: API_ROOT + '/anime/animepahe',
    templates: {
      search: API_ROOT + '/anime/animepahe/{query}',
      info: API_ROOT + '/anime/animepahe/info/{id}',
      episodes: API_ROOT + '/anime/animepahe/episodes/{id}',
      watch: API_ROOT + '/anime/animepahe/watch?episodeId={episodeId}'
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
async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      }
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

// Main function to search for anime
async function searchAnime() {
  const query = searchInput.value.trim();
  
  if (!query) {
    alert('Please enter a search query');
    return;
  }
  
  const provider = providerSelect.value;
  
  try {
    resultsContainer.innerHTML = '<p>Searching...</p>';
    
    const searchUrl = buildUrl(provider, 'search', { query });
    console.log('Search URL:', searchUrl);
    
    const data = await safeFetch(searchUrl);
    
    // Handle different response structures
    let results = [];
    
    if (Array.isArray(data)) {
      results = data;
    } else if (data && data.results && Array.isArray(data.results)) {
      results = data.results;
    } else if (data && data.anime && Array.isArray(data.anime)) {
      results = data.anime;
    } else if (data && data.data && Array.isArray(data.data)) {
      results = data.data;
    }
    
    if (results.length === 0) {
      resultsContainer.innerHTML = '<p>No results found. Try a different search term.</p>';
      return;
    }
    
    displayResults(results);
    
  } catch (error) {
    console.error('Search error:', error);
    resultsContainer.innerHTML = `<p class="error">Search failed: ${error.message}. Check your connection and try again.</p>`;
  }
}

// Function to display search results
function displayResults(results) {
  resultsContainer.innerHTML = results.map(anime => {
    const title = anime.title || anime.name || anime.englishName || 'Unknown Title';
    const id = anime.id || anime.animeId || anime.mal_id || '';
    const image = anime.image || anime.poster || anime.coverImage || 'https://via.placeholder.com/150x200';
    const releaseDate = anime.releaseDate || anime.year || anime.startDate || 'N/A';
    
    return `
      <div class="anime-card" onclick="selectAnime('${id.replace(/'/g, "\\'")}', '${title.replace(/'/g, "\\'")}')">
        <img src="${image}" alt="${title}" loading="lazy">
        <h3>${title}</h3>
        <p>${releaseDate}</p>
      </div>
    `;
  }).join('');
}

// Function to select anime and fetch details
async function selectAnime(id, title) {
  if (!id) {
    alert('Invalid anime ID');
    return;
  }
  
  currentAnimeId = id;
  const provider = providerSelect.value;
  
  try {
    detailsContainer.innerHTML = '<p>Loading details...</p>';
    
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
    displayAnimeDetails(animeData, title);
    
  } catch (error) {
    console.error('Details error:', error);
    detailsContainer.innerHTML = `<p class="error">Error loading anime details: ${error.message}</p>`;
  }
}

// Normalize anime data from different API response formats
function normalizeAnimeData(data, id, provider) {
  // Handle different response structures
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
    serversContainer.innerHTML = '<p>Loading servers...</p>';
    
    // Handle animepahe differently - uses watch endpoint with episodeId param
    if (provider === 'animepahe') {
      const watchUrl = buildUrl(provider, 'watch', { episodeId });
      console.log('Watch URL:', watchUrl);
      
      const data = await safeFetch(watchUrl);
      displayServers(data, episodeNumber || '1');
      return;
    }
    
    // Default server endpoint for other providers
    const serversUrl = buildUrl(provider, 'servers', { id: episodeId });
    console.log('Servers URL:', serversUrl);
    
    const data = await safeFetch(serversUrl);
    displayServers(data, episodeNumber || '1');
    
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
  
  const animeTitle = anime.title || title || 'Unknown Title';
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
    
    return `
      <button 
        class="episode-btn" 
        onclick="selectEpisode('${String(epId).replace(/'/g, "\\'")}', '${epNumber}')"
        title="${epTitle}"
      >
        ${epNumber}
        ${epTitle ? `<br><small style="font-size:0.7em">${epTitle.substring(0, 20)}${epTitle.length > 20 ? '...' : ''}</small>` : ''}
      </button>
    `;
  }).join('');
  
  episodesContainer.innerHTML += `<div class="episodes-grid">${episodeList}</div>`;
}

// Function to display servers/streaming options
function displayServers(data, episodeNumber) {
  serversContainer.innerHTML = `<h3>Servers for Episode ${episodeNumber}</h3>`;
  
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

// Function to play video stream with HLS.js support
window.playStream = async function(proxiedUrl, title) {
  if (!proxiedUrl) {
    return alert('No stream URL available');
  }
  
  console.log('Playing stream:', proxiedUrl);
  
  // Create or reuse video player container
  let player = document.getElementById('videoPlayer');
  if (!player) {
    player = document.createElement('div');
    player.id = 'videoPlayer';
    player.style.marginBottom = '20px';
    serversContainer.prepend(player);
  }
  
  player.innerHTML = `
    <h3>Now Playing: ${title}</h3>
    <video id="animeVideo" controls style="width:100%; max-height:60vh; background:#000; border-radius:8px;"></video>
    <p style="margin-top:10px; font-size:0.9em; color:var(--text-light);">
      <a href="${proxiedUrl}" target="_blank" rel="noopener noreferrer">Open video in new tab</a> | 
      <a href="#" onclick="location.reload(); return false;">Refresh player</a>
    </p>
  `;
  
  const video = document.getElementById('animeVideo');
  
  // Check if browser supports HLS natively (Safari)
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = proxiedUrl;
    video.play().catch(playError => {
      console.warn('Auto-play prevented:', playError);
    });
    return;
  }
  
  // For other browsers, try HLS.js
  try {
    // Load HLS.js if not already loaded
    if (!window.Hls) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load HLS.js'));
        document.head.appendChild(script);
      });
    }
    
    if (window.Hls) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      
      hls.loadSource(proxiedUrl);
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
              window.open(proxiedUrl, '_blank');
              return;
          }
        }
      });
      
      return;
    }
  } catch (hlsError) {
    console.warn('HLS playback failed:', hlsError);
  }
  
  // Fallback: open in new tab
  window.open(proxiedUrl, '_blank');
};

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
});

// Initialize - show welcome message
detailsContainer.innerHTML = `
  <div style="text-align:center; padding:40px;">
    <h2>Welcome to AnimeFlix! 🎌</h2>
    <p style="margin-top:20px;">Search for your favorite anime above to get started.</p>
    <p style="color:var(--text-light); margin-top:10px;">Select a provider from the dropdown and enter a search term.</p>
  </div>
`;

