# Home Page Card Click Flow - Improvement Plan

## Problem Analysis

When a user clicks on an anime card on the home page, the current flow has issues:

1. **Current Flow:**
   - Home page cards only contain basic info (id, title, poster, episode count)
   - `selectAnime(id, title)` is called
   - For hianime-scrap, it checks cache from search results (but home page ≠ search results)
   - Anime details displayed are incomplete (missing synopsis, genres, rating, etc.)
   - Episodes need to be fetched separately

2. **Expected Flow:**
   - User clicks anime card on home page
   - Fetch full anime info from info API
   - Display complete anime details (title, poster, synopsis, genres, rating, episodes, etc.)
   - Automatically fetch and display episodes list

## API Endpoints Available

### hianime-scrap
- **Info API:** `https://hianimeapi-6uju.onrender.com/api/v1/anime/{id}`
  - Returns: title, alternativeTitle, poster, synopsis, genres, studios, producers, rating, episodes count, related anime, etc.
- **Episodes API:** `https://hianimeapi-6uju.onrender.com/api/v1/episodes/{id}`
  - Returns: list of all episodes with IDs

## Implementation Plan

### Step 1: Update `selectAnime()` function

Modify the function to:
1. Always fetch full anime info from the info API for hianime-scrap
2. Store the complete anime data in a variable
3. Pass the complete data to `displayAnimeDetails()`

### Step 2: Create `fetchAnimeInfo()` helper

Create a new async function to:
1. Build the info API URL using `buildUrl()`
2. Fetch data using `safeFetch()`
3. Handle hianime-scrap response format `{success, data: {...}}`
4. Return normalized anime data

### Step 3: Create `fetchAnimeEpisodes()` helper

Create a new async function to:
1. Build the episodes API URL
2. Fetch episodes list
3. Return formatted episodes array

### Step 4: Update `displayAnimeDetails()`

Enhance to:
1. Accept both anime data and episodes list as parameters
2. Display all available info (synopsis, genres, rating, type, status, etc.)
3. Call `displayEpisodes()` with the episodes list

### Step 5: Update home page card click handlers

Ensure home page cards call `selectAnime()` with proper parameters:
- `selectAnime(anime.id, anime.title)` where anime is the card's data

## Files to Modify

1. `/workspaces/AnimeFlix/src/main.js`
   - Update `selectAnime()` function
   - Add `fetchAnimeInfo()` helper
   - Add `fetchAnimeEpisodes()` helper
   - Update `displayAnimeDetails()` to accept episodes parameter

## Implementation Details

### New `fetchAnimeInfo()` function:

```javascript
async function fetchAnimeInfo(animeId) {
  const provider = providerSelect.value;
  const infoUrl = buildUrl(provider, 'info', { id: animeId });
  
  try {
    const data = await safeFetch(infoUrl);
    return normalizeAnimeData(data, animeId, provider);
  } catch (error) {
    console.error('Error fetching anime info:', error);
    return null;
  }
}
```

### New `fetchAnimeEpisodes()` function:

```javascript
async function fetchAnimeEpisodes(animeId) {
  const provider = providerSelect.value;
  const episodesUrl = buildUrl(provider, 'episodes', { id: animeId });
  
  try {
    const data = await safeFetch(episodesUrl);
    return extractEpisodes(data, provider);
  } catch (error) {
    console.error('Error fetching episodes:', error);
    return [];
  }
}
```

### Updated `selectAnime()` flow:

```javascript
async function selectAnime(id, titleParam) {
  if (!id) {
    alert('Invalid anime ID');
    return;
  }
  
  const provider = providerSelect.value;
  
  try {
    detailsContainer.innerHTML = '<p>Loading details...</p>';
    
    // Always fetch full info from API for hianime-scrap
    const animeInfo = await fetchAnimeInfo(id);
    
    if (!animeInfo) {
      throw new Error('Failed to fetch anime info');
    }
    
    // Fetch episodes from API
    const episodes = await fetchAnimeEpisodes(id);
    
    // Combine info with episodes
    const animeData = {
      ...animeInfo,
      episodes: episodes,
      __provider: provider
    };
    
    // Display details with episodes
    displayAnimeDetails(animeData, animeInfo.title);
    
  } catch (error) {
    console.error('Details error:', error);
    detailsContainer.innerHTML = `<p class="error">Error loading anime details: ${error.message}</p>`;
  }
}
```

### Updated `displayAnimeDetails()`:

```javascript
function displayAnimeDetails(anime, title) {
  // ... existing code ...
  
  // Display episodes if available
  if (anime.episodes && anime.episodes.length > 0) {
    currentEpisodes = anime.episodes;
    displayEpisodes(anime.episodes);
  } else {
    episodesContainer.innerHTML = '<p>No episodes available</p>';
    currentEpisodes = [];
  }
  
  serversContainer.innerHTML = '';
}
```

## Testing Checklist

- [ ] Click on spotlight card - verify full info displayed
- [ ] Click on anime card in trending section - verify full info displayed
- [ ] Click on anime card in top 10 section - verify full info displayed
- [ ] Verify episodes list is automatically loaded
- [ ] Verify loading states are shown
- [ ] Verify error handling for API failures

## Follow-up Steps

1. Add loading spinner to details section
2. Add retry button for failed API calls
3. Consider caching info API responses
4. Add toast notifications for success/failure

