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
      watch: API_ROOT + '/anime/animekai/watch/{episodeId}'
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
  },
  'hianime-scrap': {
    base: 'https://api.animo.qzz.io/api/v1',
    templates: {
      search: 'https://api.animo.qzz.io/api/v1/search?keyword={query}&page=1',
      info: 'https://api.animo.qzz.io/api/v1/animes/{id}',
      episodes: 'https://api.animo.qzz.io/api/v1/episodes/{id}',
      servers: 'https://api.animo.qzz.io/api/v1/servers?id={id}',
      stream: 'https://api.animo.qzz.io/api/v1/stream?id={id}&type={type}&server={server}'
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
let hianimeScrapAnimeCache = {};
let currentPlayerData = null;

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
  serversContainer.innerHTML = `<h3>Servers for Episode ${episodeNumber}</h3>`;
  
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

// Function to display hianime-scrap stream with subtitles
function displayHianimeScrapStream(streamData, serverName) {
  const videoUrl = streamData.link?.file || streamData.link?.directUrl || '';
  const tracks = streamData.tracks || [];
  const intro = streamData.intro || { start: 0, end: 0 };
  const outro = streamData.outro || { start: 0, end: 0 };
  
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
  
  // Create video player container - prepend to keep server list visible below
  let player = document.getElementById('videoPlayer');
  if (!player) {
    player = document.createElement('div');
    player.id = 'videoPlayer';
    player.className = 'video-player-section';
    player.style.marginBottom = '20px';
    // Prepend to keep server list visible
    const existingPlayer = serversContainer.querySelector('#videoPlayer');
    if (existingPlayer) {
      existingPlayer.remove();
    }
    serversContainer.prepend(player);
  } else {
    // Move player to top if it exists
    serversContainer.prepend(player);
  }
  
  // Build tracks HTML
  let tracksHtml = '';
  if (tracks.length > 0) {
    tracksHtml = tracks.map(track => {
      if (track.kind === 'captions' || track.kind === 'subtitles') {
        return `<track label="${track.label}" kind="${track.kind}" src="${track.file}" ${track.default ? 'default' : ''}>`;
      }
      return '';
    }).join('');
  }
  
  // Show intro/outro info
  let metaInfo = '';
  if (intro.start !== 0 || intro.end !== 0) {
    metaInfo += `<p style="color:#ffcc00;">Skip intro: ${intro.start}s - ${intro.end}s</p>`;
  }
  if (outro.start !== 0 || outro.end !== 0) {
    metaInfo += `<p style="color:#ffcc00;">Skip outro: ${outro.start}s - ${outro.end}s</p>`;
  }
  
  player.innerHTML = `
    <h3>Now Playing: ${serverName}</h3>
    <video id="animeVideo" controls style="width:100%; max-height:60vh; background:#000; border-radius:8px;" crossorigin="anonymous">
      <source src="${videoUrl}" type="application/vnd.apple.mpegurl">
      ${tracksHtml}
    </video>
    ${metaInfo}
    <p style="margin-top:10px; font-size:0.9em; color:var(--text-light);">
      <a href="${videoUrl}" target="_blank" rel="noopener noreferrer">Open video in new tab</a> | 
      <a href="#" onclick="location.reload(); return false;">Refresh player</a>
    </p>
  `;
  
  const video = document.getElementById('animeVideo');
  
  // Set up subtitle tracks
  if (tracks.length > 0) {
    tracks.forEach(track => {
      if (track.kind === 'captions' || track.kind === 'subtitles') {
        const trackElement = video.textTracks[0];
        if (trackElement) {
          trackElement.mode = track.default ? 'showing' : 'hidden';
        }
      }
    });
  }
  
  // Check if browser supports HLS natively (Safari)
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = videoUrl;
    video.play().catch(playError => {
      console.warn('Auto-play prevented:', playError);
    });
    return;
  }
  
  // For other browsers, try HLS.js
  loadHlsStream(video, videoUrl);
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
  
  // Create or reuse video player container - prepend to keep server list visible
  let player = document.getElementById('videoPlayer');
  if (!player) {
    player = document.createElement('div');
    player.id = 'videoPlayer';
    player.style.marginBottom = '20px';
    // Prepend to keep server list visible
    const existingPlayer = serversContainer.querySelector('#videoPlayer');
    if (existingPlayer) {
      existingPlayer.remove();
    }
    serversContainer.prepend(player);
  } else {
    // Move player to top if it exists
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

