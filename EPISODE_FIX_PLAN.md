# Episode Streaming URL Fix Plan

## **Problem Summary:**
When clicking on an episode, the app calls:
- **Current (Broken):** `https://fluffy-sniffle-q6g6prr5gqwf4x9p-3000.app.github.dev/` (404 Not Found)
- **Expected:** `https://api.consumet.org/anime/hianime/watch/{episodeId}`

## **Root Cause:**
In `src/main.js`, the `selectEpisode` function uses the wrong template:
```javascript
// Current (BROKEN):
const serversUrl = buildUrl(provider, 'servers', { id: episodeId });

// Should be:
const watchUrl = buildUrl(provider, 'watch', { episodeId });
```

## **Fix Plan:**

### **Step 1: Fix `selectEpisode` function in `src/main.js`**
- Change template key from 'servers' to 'watch'
- Change parameter name from 'id' to 'episodeId'
- Handle different provider logic properly

### **Step 2: Update Provider Templates**
- Ensure 'watch' template is correctly defined for hianime
- Fix parameter passing for episodeId

### **Step 3: Handle Episode ID Format**
- Hianime expects format: `anime-id?ep=episodeNumber`
- Need to properly construct the episodeId for the API

## **Files to Modify:**
1. `src/main.js` - Fix `selectEpisode` function and templates

## **Expected Changes:**

### **Before (Broken):**
```javascript
// Default server endpoint for other providers
const serversUrl = buildUrl(provider, 'servers', { id: episodeId });
console.log('Servers URL:', serversUrl);
const data = await safeFetch(serversUrl);
```

### **After (Fixed):**
```javascript
// Use watch endpoint for hianime
const watchUrl = buildUrl(provider, 'watch', { episodeId });
console.log('Watch URL:', watchUrl);
const data = await safeFetch(watchUrl);
```

## **Success Criteria:**
- Episodes should call correct API endpoint
- Should return streaming links data (sources, headers, etc.)
- No more 404 errors

## **Testing Steps:**
1. Click on an episode
2. Check browser console for "Watch URL"
3. Verify API returns proper streaming data
4. Check that servers/streaming options display correctly

