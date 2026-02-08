# Home Page Card Click Flow - Implementation TODO

## Objective
Fix the home page card click flow to properly fetch and display full anime details when users click on any anime card.

## Tasks Completed

### ✅ Step 1: Create `fetchAnimeInfo()` helper function
- [x] Added async function to fetch anime info from info API
- [x] Handle hianime-scrap response format `{success, data: {...}}`
- [x] Returns complete anime data including: title, poster, synopsis, genres, rating, episodes count, related anime, etc.

### ✅ Step 2: Create `fetchAnimeEpisodes()` helper function
- [x] Added async function to fetch episodes list from episodes API
- [x] Returns formatted episodes array

### ✅ Step 3: Update `selectAnime()` function
- [x] Always fetch full anime info from API for hianime-scrap
- [x] Fetch episodes from API
- [x] Combine data and pass to displayAnimeDetails()

### ✅ Step 4: Verify `displayAnimeDetails()` function
- [x] Function already accepts and displays all anime info
- [x] Already calls displayEpisodes() with episodes list

## Implementation Summary

The fix ensures that when users click on any anime card (whether from home page, search results, or anywhere else):

1. For **hianime-scrap provider**: Always fetches full anime info from the `/api/v1/anime/{id}` endpoint to get complete details (synopsis, genres, rating, studios, etc.)

2. Then fetches the episodes list from `/api/v1/episodes/{id}` endpoint

3. Combines both datasets and displays complete anime information

4. For **other providers** (animekai, animepahe): Continues using existing logic

## Files Modified
- `/workspaces/AnimeFlix/src/main.js`
  - Added `fetchAnimeInfo()` helper function
  - Added `fetchAnimeEpisodes()` helper function
  - Updated `selectAnime()` to always fetch info from API for hianime-scrap

## Testing Checklist
- [x] Click on spotlight card - now fetches full info from API
- [x] Click on anime card in trending section - now fetches full info from API
- [x] Click on anime card in top 10 section - now fetches full info from API
- [x] Episodes list is automatically loaded after details
- [x] Loading states are shown during API calls
- [x] Error handling for API failures

## Result
✅ **Fixed!** Home page cards now properly fetch and display complete anime details when clicked.

