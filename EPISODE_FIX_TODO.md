# Episode Fix Implementation TODO

## **Issue:**
When clicking on an episode, the app calls wrong URL causing 404 error instead of calling the correct streaming links API.

## **Root Cause:**
- Using 'servers' template instead of 'watch' template
- Wrong parameter name (id instead of episodeId)

## **Implementation Steps:**

### **Step 1: Fix Provider Templates** 
- [ ] Update `src/main.js` line ~31-42
- [ ] Ensure 'watch' template correctly passes episodeId
- [ ] Change parameter from `{id}` to `{episodeId}` in watch template

### **Step 2: Fix selectEpisode Function**
- [ ] Update `src/main.js` line ~250-280
- [ ] Change template key from 'servers' to 'watch'
- [ ] Change parameter name from 'id' to 'episodeId'
- [ ] Remove incorrect fallback logic

### **Step 3: Update displayServers Function**
- [ ] Handle new response format from watch endpoint
- [ ] Extract sources from data.sources or data directly

### **Step 4: Testing**
- [ ] Verify episode click calls correct API
- [ ] Check console for proper watch URL
- [ ] Test that streaming options display
- [ ] Verify video playback works

## **Specific Code Changes:**

### **PROVIDERS Configuration (Line ~31-42):**
```javascript
// BEFORE:
watch: API_ROOT + '/anime/hianime/watch/{id}'

// AFTER:
watch: API_ROOT + '/anime/hianime/watch/{episodeId}'
```

### **selectEpisode Function (Line ~250-280):**
```javascript
// BEFORE:
const serversUrl = buildUrl(provider, 'servers', { id: episodeId });

// AFTER:
const watchUrl = buildUrl(provider, 'watch', { episodeId });
```

## **Files to Modify:**
- [ ] `src/main.js` - Complete episode streaming fix

## **Status:**
🔴 NOT STARTED → 🟡 IN PROGRESS → 🟢 COMPLETED

