(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function r(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(t){if(t.ep)return;t.ep=!0;const s=r(t);fetch(t.href,s)}})();const I="https://ttt-mauve-rho.vercel.app",l=I,H={animekai:{base:l+"/anime/animekai",templates:{search:l+"/anime/animekai/{query}",info:l+"/anime/animekai/info?id={id}",episodes:l+"/anime/animekai/episodes/{id}",watch:l+"/anime/animekai/watch/{id}"}},animepahe:{base:l+"/anime/animepahe",templates:{search:l+"/anime/animepahe/{query}",info:l+"/anime/animepahe/info/{id}",episodes:l+"/anime/animepahe/episodes/{id}",watch:l+"/anime/animepahe/watch?episodeId={episodeId}"}}},b="https://renewed-georgeanne-nekonode-1aa70c0c.koyeb.app";function m(e,o,r={}){const n=H[e];if(!n)return console.error(`Provider ${e} not found`),"";const t=n.templates[o];if(!t)return console.error(`Template ${o} not found for provider ${e}`),"";let s=t;return Object.keys(r).forEach(i=>{let a=r[i];i==="episodeId"?a=encodeURIComponent(a):a!=null?a=encodeURIComponent(String(a)):a="",s=s.replace(new RegExp(`\\{${i}\\}`,"g"),a)}),s}async function h(e,o={}){try{const r=await fetch(e,{...o,headers:{Accept:"application/json","Content-Type":"application/json",...o.headers}});if(!r.ok)throw new Error(`HTTP error! status: ${r.status}`);return await r.json()}catch(r){throw console.error(`Fetch error for ${e}:`,r),r}}document.getElementById("app");const L=document.getElementById("searchInput"),S=document.getElementById("searchBtn"),$=document.getElementById("providerSelect"),f=document.getElementById("results"),u=document.getElementById("details"),v=document.getElementById("episodes"),c=document.getElementById("servers");async function T(){const e=L.value.trim();if(!e){alert("Please enter a search query");return}const o=$.value;try{f.innerHTML="<p>Searching...</p>";const r=m(o,"search",{query:e});console.log("Search URL:",r);const n=await h(r);let t=[];if(Array.isArray(n)?t=n:n&&n.results&&Array.isArray(n.results)?t=n.results:n&&n.anime&&Array.isArray(n.anime)?t=n.anime:n&&n.data&&Array.isArray(n.data)&&(t=n.data),t.length===0){f.innerHTML="<p>No results found. Try a different search term.</p>";return}k(t)}catch(r){console.error("Search error:",r),f.innerHTML=`<p class="error">Search failed: ${r.message}. Check your connection and try again.</p>`}}function k(e){f.innerHTML=e.map(o=>{const r=o.title||o.name||o.englishName||"Unknown Title",n=o.id||o.animeId||o.mal_id||"",t=o.image||o.poster||o.coverImage||"https://via.placeholder.com/150x200",s=o.releaseDate||o.year||o.startDate||"N/A";return`
      <div class="anime-card" onclick="selectAnime('${n.replace(/'/g,"\\'")}', '${r.replace(/'/g,"\\'")}')">
        <img src="${t}" alt="${r}" loading="lazy">
        <h3>${r}</h3>
        <p>${s}</p>
      </div>
    `}).join("")}async function R(e,o){if(!e){alert("Invalid anime ID");return}const r=$.value;try{u.innerHTML="<p>Loading details...</p>";const n=m(r,"info",{id:e});console.log("Info URL:",n);const t=await h(n);let s=M(t,e,r);if(!s.episodes||s.episodes.length===0)try{const i=m(r,"episodes",{id:e});console.log("Episodes URL:",i);const a=await h(i);s.episodes=O(a,r)}catch(i){console.warn("Could not fetch episodes separately:",i),s.episodes=[]}s.__provider=r,U(s,o)}catch(n){console.error("Details error:",n),u.innerHTML=`<p class="error">Error loading anime details: ${n.message}</p>`}}function M(e,o,r){if(Array.isArray(e)){const n=e.find(t=>t&&t.id===o)||e[0];return n?{...n,id:n.id||o}:{id:o,episodes:[]}}if(e&&e.results&&Array.isArray(e.results)){const n=e.results.find(t=>t&&t.id===o)||e.results[0];return n?{...n,id:n.id||o}:{...e,id:e.id||o}}return e&&e.data?{...e.data,id:e.data.id||o}:e&&(e.title||e.name||e.englishName)?{...e,id:e.id||o}:{id:o,...e||{}}}function O(e,o){return e?Array.isArray(e)?e.map((r,n)=>({id:r.id||r.episodeId||`${n+1}`,number:r.number||r.episode||r.ep||n+1,title:r.title||r.name||`Episode ${n+1}`})):e.episodes&&Array.isArray(e.episodes)?e.episodes.map((r,n)=>({id:r.id||r.episodeId||`${n+1}`,number:r.number||r.episode||r.ep||n+1,title:r.title||r.name||`Episode ${n+1}`})):e.data&&Array.isArray(e.data)?e.data.map((r,n)=>({id:r.id||r.episodeId||`${n+1}`,number:r.number||r.episode||r.ep||n+1,title:r.title||r.name||`Episode ${n+1}`})):[]:[]}async function P(e,o){if(!e){alert("Invalid episode ID");return}const r=$.value;try{if(c.innerHTML="<p>Loading servers...</p>",r==="animepahe"){const s=m(r,"watch",{episodeId:e});console.log("Watch URL:",s);const i=await h(s);A(i,o||"1");return}const n=m(r,"servers",{id:e});console.log("Servers URL:",n);const t=await h(n);A(t,o||"1")}catch(n){console.error("Servers error:",n),c.innerHTML=`<p class="error">Error loading servers: ${n.message}. Try a different episode.</p>`}}window.selectAnime=R;window.selectEpisode=P;function U(e,o){var d;console.log("Displaying anime details:",e);const r=e.title||o||"Unknown Title",n=e.image||e.poster||e.coverImage||"https://via.placeholder.com/200x300",t=e.japaneseTitle||e.jname||"",s=e.type||e.format||"Unknown",i=e.status||"",a=e.genres||(e.genre?[e.genre]:[]),y=e.totalEpisodes||e.episodeCount||((d=e.episodes)==null?void 0:d.length)||"Unknown",p=e.description||e.synopsis||"No description available",g=e.url||e.animeUrl||"";u.innerHTML=`
    <div class="anime-details">
      <div class="anime-header">
        <img src="${n}" alt="${r}" onerror="this.src='https://via.placeholder.com/200x300'">
        <div class="anime-info">
          <h2>${r}</h2>
          ${t?`<p><strong>Japanese:</strong> ${t}</p>`:""}
          <p><strong>Type:</strong> ${s}</p>
          ${i?`<p><strong>Status:</strong> ${i}</p>`:""}
          ${a.length>0?`<p><strong>Genres:</strong> ${a.join(", ")}</p>`:""}
          <p><strong>Episodes:</strong> ${y}</p>
          <p><strong>Description:</strong> ${p}</p>
          ${g?`<p><a href="${g}" target="_blank" rel="noopener noreferrer" class="watch-link">View on Provider →</a></p>`:""}
        </div>
      </div>
    </div>
  `,u.scrollIntoView({behavior:"smooth"}),e.episodes&&e.episodes.length>0?(e.episodes,_(e.episodes)):v.innerHTML="<p>No episodes available</p>",c.innerHTML=""}function _(e){v.innerHTML="<h3>Episodes</h3>";const o=e.map((r,n)=>{const t=r.number||r.episode||r.ep||n+1,s=r.title||r.name||"",i=r.id||`${n+1}`;return`
      <button 
        class="episode-btn" 
        onclick="selectEpisode('${String(i).replace(/'/g,"\\'")}', '${t}')"
        title="${s}"
      >
        ${t}
        ${s?`<br><small style="font-size:0.7em">${s.substring(0,20)}${s.length>20?"...":""}</small>`:""}
      </button>
    `}).join("");v.innerHTML+=`<div class="episodes-grid">${o}</div>`}function A(e,o){c.innerHTML=`<h3>Servers for Episode ${o}</h3>`;let r=[];if(Array.isArray(e)?r=e:e&&e.servers&&Array.isArray(e.servers)?r=e.servers:e&&e.sources&&Array.isArray(e.sources)?r=e.sources:e&&e.data&&Array.isArray(e.data)?r=e.data:e&&e.streamingServers&&Array.isArray(e.streamingServers)&&(r=e.streamingServers),r.length===0){c.innerHTML+="<p>No servers available for this episode. Try a different episode.</p>";return}let n='<div class="servers-list">';r.forEach((t,s)=>{const i=t.name||t.serverName||t.quality||`Server ${s+1}`,a=t.url||t.file||t.src||t.streamUrl||"";if(n+=`
      <div class="server-option">
        <strong>${i}</strong>
    `,a){const y=`${b}/fetch?url=${encodeURIComponent(a)}`;n+=`
        <p><a href="${a}" target="_blank" rel="noopener noreferrer">Open Original</a></p>
        <p><a href="${y}" target="_blank" rel="noopener noreferrer">Open via Proxy</a></p>
        <p><button class="play-btn" onclick="playStream('${y.replace(/'/g,"\\'")}', '${i.replace(/'/g,"\\'")}')">▶ Play</button></p>
      `,t.sources&&Array.isArray(t.sources)&&t.sources.forEach((p,g)=>{const d=p.url||p.file||p.src||"";if(d){const w=`${b}/fetch?url=${encodeURIComponent(d)}`,E=p.quality||`Source ${g+1}`;n+=`
              <hr style="margin: 10px 0; border-color: rgba(233,69,96,0.3);">
              <p><strong>${E}</strong></p>
              <p><a href="${d}" target="_blank" rel="noopener noreferrer">Open Original</a></p>
              <p><a href="${w}" target="_blank" rel="noopener noreferrer">Open via Proxy</a></p>
              <p><button class="play-btn" onclick="playStream('${w.replace(/'/g,"\\'")}', '${E.replace(/'/g,"\\'")}')">▶ Play</button></p>
            `}})}else n+="<p>No direct URL available</p>";(t.intro||t.outro)&&(n+='<p class="meta">',t.intro&&(n+=`Intro: ${t.intro.start}-${t.intro.end}s `),t.outro&&(n+=`Outro: ${t.outro.start}-${t.outro.end}s`),n+="</p>"),n+="</div>"}),n+="</div>",c.innerHTML+=n}window.playStream=async function(e,o){if(!e)return alert("No stream URL available");console.log("Playing stream:",e);let r=document.getElementById("videoPlayer");r||(r=document.createElement("div"),r.id="videoPlayer",r.style.marginBottom="20px",c.prepend(r)),r.innerHTML=`
    <h3>Now Playing: ${o}</h3>
    <video id="animeVideo" controls style="width:100%; max-height:60vh; background:#000; border-radius:8px;"></video>
    <p style="margin-top:10px; font-size:0.9em; color:var(--text-light);">
      <a href="${e}" target="_blank" rel="noopener noreferrer">Open video in new tab</a> | 
      <a href="#" onclick="location.reload(); return false;">Refresh player</a>
    </p>
  `;const n=document.getElementById("animeVideo");if(n.canPlayType("application/vnd.apple.mpegurl")){n.src=e,n.play().catch(t=>{console.warn("Auto-play prevented:",t)});return}try{if(window.Hls||await new Promise((t,s)=>{const i=document.createElement("script");i.src="https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js",i.onload=t,i.onerror=()=>s(new Error("Failed to load HLS.js")),document.head.appendChild(i)}),window.Hls){const t=new window.Hls({enableWorker:!0,lowLatencyMode:!0});t.loadSource(e),t.attachMedia(n),t.on(window.Hls.Events.MANIFEST_PARSED,()=>{n.play().catch(s=>{console.warn("Auto-play prevented:",s)})}),t.on(window.Hls.Events.ERROR,(s,i)=>{if(console.error("HLS error:",i),i.fatal)switch(i.type){case window.Hls.ErrorTypes.NETWORK_ERROR:t.startLoad();break;case window.Hls.ErrorTypes.MEDIA_ERROR:t.recoverMediaError();break;default:window.open(e,"_blank");return}});return}}catch(t){console.warn("HLS playback failed:",t)}window.open(e,"_blank")};S.addEventListener("click",T);L.addEventListener("keypress",e=>{e.key==="Enter"&&T()});$.addEventListener("change",()=>{f.innerHTML="",u.innerHTML="",v.innerHTML="",c.innerHTML=""});u.innerHTML=`
  <div style="text-align:center; padding:40px;">
    <h2>Welcome to AnimeFlix! 🎌</h2>
    <p style="margin-top:20px;">Search for your favorite anime above to get started.</p>
    <p style="color:var(--text-light); margin-top:10px;">Select a provider from the dropdown and enter a search term.</p>
  </div>
`;
