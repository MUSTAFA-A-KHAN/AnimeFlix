// API Configuration - Prioritize local development server, fallback to external API
const API_LOCAL = 'http://localhost:3000';
const API_EXTERNAL = 'https://ttt-mauve-rho.vercel.app';

// Auto-detect API base - try local first, fallback to external
const API_ROOT = API_LOCAL;

// Provider configuration for different anime providers
const PROVIDERS = {
  'hianime-scrap': {
    base: 'https://api.animo.qzz.io/api/v1',
    templates: {
      search: 'https://hianimeapi-6uju.onrender.com/api/v1/search?keyword={query}&page=1',
      info: 'https://hianimeapi-6uju.onrender.com/api/v1/anime/{id}',
      episodes: 'https://hianimeapi-6uju.onrender.com/api/v1/episodes/{id}',
      servers: 'https://hianimeapi-6uju.onrender.com/api/v1/servers/id={id}',
      stream: 'https://api.animo.qzz.io/api/v1/stream?id={id}&type={type}&server={server}',
      home: 'https://hianimeapi-6uju.onrender.com/api/v1/home'
    }
  },
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
  }
};

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

/**
 * Fetch full anime information from the API
 * @param {string} animeId - The anime ID to fetch info for
 * @param {string} provider - The provider to use (defaults to 'hianime-scrap')
 * @returns {Promise<Object|null>} - Anime info object or null if failed
 */
async function fetchAnimeInfo(animeId, provider = 'hianime-scrap') {
  const infoUrl = buildUrl(provider, 'info', { id: animeId });

  console.log('Fetching anime info from:', infoUrl);

  try {
    const data = await safeFetch(infoUrl);

    // Handle hianime-scrap format: {success, data: {...anime details...}}
    if (data && data.data && provider === 'hianime-scrap') {
      return {
        ...data.data,
        id: data.data.id || animeId,
        title: data.data.title,
        poster: data.data.poster,
        image: data.data.poster,
        synopsis: data.data.synopsis || data.data.description || '',
        alternativeTitle: data.data.alternativeTitle || '',
        rating: data.data.rating || '',
        type: data.data.type,
        is18Plus: data.data.is18Plus || false,
        aired: data.data.aired || {},
        premiered: data.data.premiered || '',
        duration: data.data.duration || '',
        status: data.data.status,
        MAL_score: data.data.MAL_score || '',
        genres: data.data.genres || [],
        studios: data.data.studios || [],
        producers: data.data.producers || [],
        moreSeasons: data.data.moreSeasons || [],
        related: data.data.related || [],
        mostPopular: data.data.mostPopular || [],
        recommended: data.data.recommended || [],
        japanese: data.data.japanese || '',
        episodes: {
          sub: data.data.episodes?.sub || 0,
          dub: data.data.episodes?.dub || 0,
          eps: data.data.episodes?.eps || 0
        }
      };
    }

    // Handle other provider formats
    return normalizeAnimeData(data, animeId, provider);
  } catch (error) {
    console.error('Error fetching anime info:', error);
    return null;
  }
}

/**
 * Fetch anime episodes list from the API
 * @param {string} animeId - The anime ID to fetch episodes for
 * @param {string} provider - The provider to use (defaults to 'hianime-scrap')
 * @returns {Promise<Array>} - Array of episode objects
 */
async function fetchAnimeEpisodes(animeId, provider = 'hianime-scrap') {
  const episodesUrl = buildUrl(provider, 'episodes', { id: animeId });

  console.log('Fetching episodes from:', episodesUrl);

  try {
    const data = await safeFetch(episodesUrl);
    return extractEpisodes(data, provider);
  } catch (error) {
    console.error('Error fetching episodes:', error);
    return [];
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

// Export functions
export { fetchAnimeInfo, fetchAnimeEpisodes, buildUrl, safeFetch, PROVIDERS };

