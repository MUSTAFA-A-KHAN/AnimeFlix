(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function s(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(o){if(o.ep)return;o.ep=!0;const i=s(o);fetch(o.href,i)}})();const lt="http://localhost:3000",M=lt,ct={animekai:{base:M+"/anime/animekai",templates:{search:M+"/anime/animekai/{query}",info:M+"/anime/animekai/info?id={id}",episodes:M+"/anime/animekai/episodes/{id}",watch:M+"/anime/animekai/watch/{episodeId}",home:M+"/anime/animekai/new-releases"}},animepahe:{base:M+"/anime/animepahe",templates:{search:M+"/anime/animepahe/{query}",info:M+"/anime/animepahe/info/{id}",episodes:M+"/anime/animepahe/episodes/{id}",watch:M+"/anime/animepahe/watch?episodeId={episodeId}",home:M+"/anime/animekai/new-releases"}},"hianime-scrap":{base:"https://api.animo.qzz.io/api/v1",templates:{search:"https://hianimeapi-6uju.onrender.com/api/v1/search?keyword={query}&page=1",info:"https://api.animo.qzz.io/api/v1/animes/{id}",episodes:"https://api.animo.qzz.io/api/v1/episodes/{id}",servers:"https://api.animo.qzz.io/api/v1/servers?id={id}",stream:"https://api.animo.qzz.io/api/v1/stream?id={id}&type={type}&server={server}",home:"https://hianimeapi-6uju.onrender.com/api/v1/home"}}},Ne="https://renewed-georgeanne-nekonode-1aa70c0c.koyeb.app";function I(e,t,s={}){const n=ct[e];if(!n)return console.error(`Provider ${e} not found`),"";const o=n.templates[t];if(!o)return console.error(`Template ${t} not found for provider ${e}`),"";let i=o;return Object.keys(s).forEach(r=>{let a=s[r];r==="episodeId"?a=encodeURIComponent(a):a!=null?a=encodeURIComponent(String(a)):a="",i=i.replace(new RegExp(`\\{${r}\\}`,"g"),a)}),i}async function T(e,t={}){try{const s={Accept:"application/json",...t.headers||{}};t.body&&(s["Content-Type"]="application/json");const n=await fetch(e,{...t,headers:s});if(!n.ok)throw new Error(`HTTP error! status: ${n.status}`);return await n.json()}catch(s){throw console.error(`Fetch error for ${e}:`,s),s}}document.getElementById("app");const Y=document.getElementById("searchInput"),dt=document.getElementById("searchBtn"),O=document.getElementById("providerSelect"),G=document.getElementById("results"),X=document.getElementById("details"),oe=document.getElementById("episodes"),g=document.getElementById("servers");let ie=null,P=[],ge={},B=null,N=[];function Q(){const e=localStorage.getItem("useCustomPlayer");return e===null?!0:e==="true"}function ut(e){localStorage.setItem("useCustomPlayer",String(e)),vt()}window.handlePlayerToggle=function(){const e=document.getElementById("playerToggle");if(e){e.checked=!e.checked;const t=e.checked;ut(t),console.log("Toggle changed to:",t?"Custom":"Default"),setTimeout(()=>{pt()},50)}};function pt(){var t,s;if(window.hianimeScrapServerData){const n=document.querySelector(".server-tab.active");if(n){const o=n.textContent.toLowerCase(),i=o.includes("sub")?"sub":o.includes("dub")?"dub":"raw",r=(s=(t=window.hianimeScrapServerData[i])==null?void 0:t[0])==null?void 0:s.id;if(r){playHianimeScrapStream(r,i,n.textContent);return}}}const e=document.querySelector(".server-option .play-btn");if(e){const n=e.getAttribute("onclick");if(n){const o=n.match(/playStream\(['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/);if(o){const i=o[1],r=o[2];playStream(i,r);return}}}}function vt(){const e=document.getElementById("playerToggle");if(e){const t=Q();e.checked=t;const s=e.parentElement.querySelector(".toggle-custom"),n=e.parentElement.querySelector(".toggle-default");s&&n&&(s.style.opacity=t?"1":"0.5",n.style.opacity=t?"0.5":"1")}}function Ye(e){const{videoUrl:t="",title:s="Video"}=e,n=document.createElement("div");return n.className="default-video-player",n.id="defaultVideoPlayer",n.innerHTML=`
    <video id="defaultVideo" preload="metadata" controls playsinline>
      <source src="${t}" type="application/vnd.apple.mpegurl">
    </video>
    <div class="default-player-info">
      <p>Using default browser player</p>
      <p class="video-title">${s}</p>
    </div>
  `,n}function Ge(e,t={}){const s=e.querySelector("#defaultVideo"),n=t.videoUrl||"";return n&&(s.canPlayType("application/vnd.apple.mpegurl")?s.src=n:je(s,n)),{element:e,video:s,loadVideo:o=>{s.canPlayType("application/vnd.apple.mpegurl")?s.src=o:je(s,o)}}}function je(e,t){try{if(window.Hls)Re(e,t);else{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js",s.onload=()=>Re(e,t),s.onerror=()=>{console.error("Failed to load HLS.js")},document.head.appendChild(s)}}catch(s){console.warn("HLS playback failed:",s)}}function Re(e,t){if(!window.Hls||!e)return;const s=new window.Hls({enableWorker:!0,lowLatencyMode:!0});s.loadSource(t),s.attachMedia(e),s.on(window.Hls.Events.MANIFEST_PARSED,()=>{console.log("HLS manifest parsed for default player")}),s.on(window.Hls.Events.ERROR,(n,o)=>{console.error("HLS error in default player:",o)})}let Fe=[];function fe(e){const t=[],s=/(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n\n|\n*$)/g;let n;for(;(n=s.exec(e))!==null;)t.push({startTime:re(n[2]),endTime:re(n[3]),text:n[4].trim()});return t}function be(e){const t=[],s=/(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})\n([\s\S]*?)(?=\n\n|\n*$)/g;let n;for(e=e.replace(/^WEBVTT.*?\n\n/s,"");(n=s.exec(e))!==null;)t.push({startTime:re(n[1]),endTime:re(n[2]),text:n[3].trim()});return t}function re(e){const t=e.split(/[:,.]/);if(t.length>=4){const s=parseInt(t[0]),n=parseInt(t[1]),o=parseInt(t[2]),i=parseInt(t[3]);return s*3600+n*60+o+i/1e3}return 0}function ye(e,t,s="en"){if(!B)return;const n=B.video,o=document.createElement("track");o.label=t,o.kind="subtitles",o.srclang=s,o.mode="hidden";let i=`WEBVTT

`;e.forEach((d,u)=>{i+=`${Oe(d.startTime)} --> ${Oe(d.endTime)}
${d.text}

`});const r=new Blob([i],{type:"text/vtt"}),a=URL.createObjectURL(r);o.src=a,n.appendChild(o),N.push({track:o,url:a,label:t,language:s,cues:e});for(let d=0;d<n.textTracks.length;d++)n.textTracks[d].mode="hidden";return n.textTracks.length>0&&(n.textTracks[n.textTracks.length-1].mode="showing"),o}function Oe(e){const t=Math.floor(e/3600),s=Math.floor(e%3600/60),n=Math.floor(e%60),o=Math.floor(e%1*1e3);return`${t.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}:${n.toString().padStart(2,"0")}.${o.toString().padStart(3,"0")}`}function _e(e){return new Promise((t,s)=>{const n=new FileReader;n.onload=o=>{const i=o.target.result;let r=[];if(e.name.endsWith(".srt")?r=fe(i):e.name.endsWith(".vtt")||i.includes("WEBVTT")?r=be(i):r=fe(i),r.length>0){const a=we(e.name),d=ye(r,e.name,a);L(`Subtitle "${e.name}" loaded successfully`,"success"),t({cues:r,label:e.name,language:a,track:d})}else L("Failed to parse subtitle file","error"),s(new Error("Failed to parse subtitle"))},n.onerror=()=>{L("Error reading subtitle file","error"),s(new Error("Error reading file"))},n.readAsText(e)})}function we(e){const t=e.toLowerCase();return t.includes("english")||t.includes("eng")?"en":t.includes("spanish")||t.includes("español")?"es":t.includes("french")||t.includes("français")?"fr":t.includes("german")||t.includes("deutsch")?"de":t.includes("italian")||t.includes("italiano")?"it":t.includes("portuguese")||t.includes("português")?"pt":t.includes("russian")||t.includes("русский")?"ru":t.includes("japanese")?"ja":t.includes("korean")?"ko":t.includes("chinese")||t.includes("中文")?"zh":"en"}async function mt(e){try{const t=await T(`https://api.opensubtitles.com/api/v1/subtitles?query=${encodeURIComponent(e)}&languages=en`,{headers:{"Api-Key":"Y2xvdWQtMTYzODU2MkAxNzMxNjM2NjI3OmRhMWQxNDM0YWFkZjM0ZGU4NzgwMjhhZTk0OWE0YzU0","User-Agent":"AnimeFlix v1.0.0",Accept:"application/json"}});return t&&t.data&&Array.isArray(t.data)?(Fe=t.data.slice(0,10),Fe):[]}catch(t){return console.error("Cloud subtitle search error:",t),ht(e)}}function ht(e){return[{id:"1",file_name:`${e} English.srt`,language:"en",downloads:1e3,rating:8.5},{id:"2",file_name:`${e} English [SDH].srt`,language:"en",downloads:800,rating:8.2},{id:"3",file_name:`${e} Spanish.srt`,language:"es",downloads:500,rating:7.9},{id:"4",file_name:`${e} French.srt`,language:"fr",downloads:400,rating:7.8},{id:"5",file_name:`${e} Portuguese.srt`,language:"pt",downloads:300,rating:7.5}]}async function gt(e,t){try{L(`Downloading ${t}...`,"info");const s=await T(`https://api.opensubtitles.com/api/v1/download/${e}`,{headers:{"Api-Key":"Y2xvdWQtMTYzODU2MkAxNzMxNjM2NjI3OmRhMWQxNDM0YWFkZjM0ZGU4NzgwMjhhZTk0OWE0YzU0","User-Agent":"AnimeFlix v1.0.0",Accept:"application/json","Content-Type":"application/json"},method:"POST",body:JSON.stringify({file_name:t})});if(s&&s.link){const i=await T(s.link);let r=[];if(typeof i=="string"?i.includes("WEBVTT")?r=be(i):r=fe(i):typeof i=="object"&&(r=i),r.length>0){const a=we(t);return ye(r,t,a),L(`Loaded ${t}`,"success"),!0}}const n=[{startTime:0,endTime:2,text:"This is a sample subtitle"},{startTime:2,endTime:4,text:"Downloaded from cloud"},{startTime:4,endTime:6,text:`${t}`}],o=we(t);return ye(n,t,o),L(`Loaded ${t} (demo)`,"success"),!0}catch(s){return console.error("Download error:",s),L("Failed to download subtitle","error"),!1}}function Xe(e){const{videoUrl:t="",title:s="Video",tracks:n=[],intro:o={start:0,end:0},outro:i={start:0,end:0}}=e,r=document.createElement("div");r.className="custom-video-player",r.id="customVideoPlayer";const a={play:'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',volumeHigh:'<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',fullscreen:'<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',settings:'<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',upload:'<svg viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>',cloud:'<svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>',skipBack:'<svg viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>',skipForward:'<svg viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>',previous:'<svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>',next:'<svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zm2-5.71L11.29 12H2v-2h9.29l-3-2.29zM22 6h-2V2h-2v4h-2V2h-2v4h-2V2h-2v4h-2V2H8v4H6V2H4v16h2v-4h2v4h2v-4h2v4h2v-4h2v4h2v-4h2v4h2V6z"/></svg>',check:'<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'};let d="";return n.length>0&&(d=n.map(u=>u.kind==="captions"||u.kind==="subtitles"?`<track label="${u.label}" kind="${u.kind}" src="${u.file}" ${u.default?"default":""}>`:"").join("")),r.innerHTML=`
    <video id="customVideo" preload="metadata" crossorigin="anonymous">
      <source src="${t}" type="application/vnd.apple.mpegurl">
      ${d}
    </video>
    <div class="player-loading hidden"><div class="spinner"></div><p>Loading...</p></div>
    <div class="player-error hidden"><div class="error-icon">⚠️</div><p>Unable to load video. Please check your connection and try again.</p><button class="retry-btn">Retry</button></div>
    <div class="player-controls">
      <div class="progress-container"><div class="buffered-bar" style="width: 0%"></div><div class="progress-bar" style="width: 0%"></div></div>
      <div class="controls-row">
        <div class="controls-left">
          <button class="control-btn play-btn-main" title="Play/Pause">${a.play}</button>
          <div class="skip-buttons"><button class="skip-btn" data-seconds="-10" title="Rewind 10s">${a.skipBack}<span>10</span></button></div>
          <div class="skip-buttons"><button class="skip-btn" data-seconds="10" title="Forward 10s"><span>10</span>${a.skipForward}</button></div>
          <div class="volume-container">
            <button class="control-btn volume-btn" title="Mute/Unmute">${a.volumeHigh}</button>
            <input type="range" class="volume-slider" min="0" max="1" step="0.1" value="1">
          </div>
          <div class="time-display"><span class="current-time">0:00</span> / <span class="duration">0:00</span></div>
        </div>
        <div class="controls-right">
          <div class="episode-nav">
            <button class="episode-nav-btn prev-episode" title="Previous Episode" disabled>${a.previous}</button>
            <span class="current-episode">${s}</span>
            <button class="episode-nav-btn next-episode" title="Next Episode" disabled>${a.next}</button>
          </div>
          <div class="settings-wrapper" style="position: relative;">
            <button class="control-btn settings-btn" title="Settings">${a.settings}</button>
            <div class="settings-menu">
              <div class="settings-menu-item" data-setting="playbackSpeed"><span>Playback Speed</span><span class="submenu-indicator">▶</span></div>
              <div class="settings-menu-item" data-setting="subtitleTrack"><span>Subtitles</span><span class="submenu-indicator">▶</span></div>
              <div class="settings-menu-item" data-setting="subtitleSize"><span>Subtitle Size</span><span class="submenu-indicator">▶</span></div>
              <div class="settings-menu-item" data-setting="subtitlePosition"><span>Subtitle Position</span><span class="submenu-indicator">▶</span></div>
              <div class="settings-menu-item" data-setting="uploadSubtitle"><span>Upload Subtitle</span><span>${a.upload}</span></div>
              <div class="settings-menu-item" data-setting="cloudSubtitles"><span>Search Cloud</span><span>${a.cloud}</span></div>
            </div>
            <div class="submenu playback-speed-menu">
              ${[.5,.75,1,1.25,1.5,2].map(u=>`<div class="submenu-item" data-speed="${u}"><span class="check-icon">${a.check}</span><span>${u}x</span></div>`).join("")}
            </div>
            <div class="submenu subtitle-track-menu">
              <div class="submenu-item active" data-track="off"><span class="check-icon">${a.check}</span><span>Off</span></div>
              <div class="submenu-item" data-track="uploaded"><span class="check-icon">${a.check}</span><span>Uploaded</span></div>
            </div>
            <div class="submenu subtitle-size-menu">
              ${["Small","Medium","Large","X-Large"].map(u=>`<div class="submenu-item" data-size="${u.toLowerCase()}"><span class="check-icon">${a.check}</span><span>${u}</span></div>`).join("")}
            </div>
            <div class="submenu subtitle-position-menu">
              <div class="submenu-item" data-position="top"><span class="check-icon">${a.check}</span><span>Top</span></div>
              <div class="submenu-item active" data-position="bottom"><span class="check-icon">${a.check}</span><span>Bottom</span></div>
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
          <button class="control-btn fullscreen-btn" title="Fullscreen">${a.fullscreen}</button>
        </div>
      </div>
    </div>
    <div class="subtitle-container subtitle-position-bottom"><div class="subtitle-text"></div></div>
    <div class="player-tooltip"></div>
    <input type="file" accept=".srt,.vtt" id="subtitleFileInput" style="display:none" multiple>
  `,r}function Qe(e,t={}){var Ie,Be,ze,qe,Ue,Pe,De;const s=e.querySelector("#customVideo"),n=e.querySelector(".player-loading"),o=e.querySelector(".player-error"),i=e.querySelector(".player-controls"),r=e.querySelector(".progress-container"),a=e.querySelector(".progress-bar"),d=e.querySelector(".buffered-bar"),u=e.querySelector(".play-btn-main"),f=e.querySelector(".volume-btn"),m=e.querySelector(".volume-slider"),x=e.querySelectorAll(".skip-btn"),z=e.querySelector(".fullscreen-btn"),k=e.querySelector(".settings-btn"),b=e.querySelector(".settings-menu"),C=e.querySelector(".time-display"),H=C.querySelector(".current-time"),h=C.querySelector(".duration"),E=e.querySelector(".subtitle-container"),et=E.querySelector(".subtitle-text");let R=!1,J=!1,Le=null,D=null;function xe(l){if(isNaN(l))return"0:00";const c=Math.floor(l/60),p=Math.floor(l%60);return`${c}:${p.toString().padStart(2,"0")}`}function tt(){s.duration&&(a.style.width=`${s.currentTime/s.duration*100}%`,H.textContent=xe(s.currentTime))}function st(){s.buffered.length>0&&(d.style.width=`${s.buffered.end(s.buffered.length-1)/s.duration*100}%`)}function K(){n.classList.remove("hidden")}function le(){n.classList.add("hidden")}function Z(){o.classList.remove("hidden"),i.classList.add("hidden")}function Te(){o.classList.add("hidden"),i.classList.remove("hidden")}function ce(){s.paused?(s.play().catch(()=>{}),R=!0,u.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',e.classList.add("playing")):(s.pause(),R=!1,u.innerHTML='<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',e.classList.remove("playing"))}function de(){J?(s.muted=!1,J=!1,f.innerHTML='<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',m.value=s.volume):(s.muted=!0,J=!0,f.innerHTML='<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',m.value=0)}function Ee(){var l,c,p,v;document.fullscreenElement?(p=document.exitFullscreen)!=null&&p.call(document)||((v=document.webkitExitFullscreen)==null||v.call(document)):(l=e.requestFullscreen)!=null&&l.call(e)||((c=e.webkitRequestFullscreen)==null||c.call(e))}function _(l){s.currentTime=Math.max(0,Math.min(s.currentTime+l,s.duration))}function Me(){e.classList.add("show-controls"),clearTimeout(Le),R&&(Le=setTimeout(()=>{e.classList.remove("show-controls")},3e3))}function ue(l){if(s.canPlayType("application/vnd.apple.mpegurl")){s.src=l;return}try{if(window.Hls)Ce(l);else{const c=document.createElement("script");c.src="https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js",c.onload=()=>Ce(l),c.onerror=Z,document.head.appendChild(c)}}catch{Z()}}function Ce(l){window.Hls&&(D&&D.destroy(),D=new window.Hls({enableWorker:!0,lowLatencyMode:!0}),D.loadSource(l),D.attachMedia(s),D.on(window.Hls.Events.MANIFEST_PARSED,()=>{le(),s.play().catch(()=>{})}),D.on(window.Hls.Events.ERROR,(c,p)=>{p.fatal&&Z()}))}s.addEventListener("loadedmetadata",()=>{h.textContent=xe(s.duration),le()}),s.addEventListener("play",()=>{R=!0,u.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',Me()}),s.addEventListener("pause",()=>{R=!1,u.innerHTML='<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'}),s.addEventListener("timeupdate",()=>{tt(),st()}),s.addEventListener("waiting",K),s.addEventListener("canplay",le),s.addEventListener("error",Z),u.addEventListener("click",ce),s.addEventListener("click",ce),f.addEventListener("click",de),m.addEventListener("input",l=>{s.volume=l.target.value,m.value=s.volume,s.volume>0&&J&&de()}),x.forEach(l=>l.addEventListener("click",()=>_(parseInt(l.dataset.seconds)))),r.addEventListener("click",l=>{const c=(l.clientX-r.getBoundingClientRect().left)/r.getBoundingClientRect().width;s.currentTime=c*s.duration}),z.addEventListener("click",Ee),k.addEventListener("click",()=>{b.classList.toggle("visible")}),e.addEventListener("click",l=>{l.target.closest(".settings-wrapper")||b.classList.remove("visible")});const ee=e.querySelector(".playback-speed-menu");(Ie=e.querySelector('[data-setting="playbackSpeed"]'))==null||Ie.addEventListener("click",()=>{ee.classList.toggle("visible")}),ee.querySelectorAll(".submenu-item").forEach(l=>{l.addEventListener("click",()=>{s.playbackRate=parseFloat(l.dataset.speed),ee.classList.remove("visible"),ee.querySelectorAll(".submenu-item").forEach(c=>c.classList.remove("active")),l.classList.add("active")})});const te=e.querySelector(".subtitle-size-menu");(Be=e.querySelector('[data-setting="subtitleSize"]'))==null||Be.addEventListener("click",()=>{te.classList.toggle("visible")}),te.querySelectorAll(".submenu-item").forEach(l=>{l.addEventListener("click",()=>{E.className=`subtitle-container subtitle-size-${l.dataset.size}`,te.classList.remove("visible"),te.querySelectorAll(".submenu-item").forEach(c=>c.classList.remove("active")),l.classList.add("active")})});const pe=e.querySelector(".subtitle-position-menu");(ze=e.querySelector('[data-setting="subtitlePosition"]'))==null||ze.addEventListener("click",()=>{pe.classList.toggle("visible")}),pe.querySelectorAll(".submenu-item[data-position]").forEach(l=>{l.addEventListener("click",()=>{E.classList.remove("subtitle-position-top","subtitle-position-middle","subtitle-position-bottom"),E.classList.add(`subtitle-position-${l.dataset.position}`),pe.querySelectorAll(".submenu-item").forEach(c=>c.classList.remove("active")),l.classList.add("active"),L(`Subtitle position: ${l.dataset.position}`,"info")})});let F=0;const nt=e.querySelector(".offset-value");e.querySelectorAll(".offset-btn").forEach(l=>{l.addEventListener("click",()=>{const c=parseInt(l.dataset.offset);F=Math.max(-200,Math.min(200,F+c)),nt.textContent=F>0?`+${F}`:F,E.style.bottom=`calc(100px + ${F}px)`,E.style.top="auto",E.style.transform="translateX(-50%)"})});const Ae=e.querySelector(".subtitle-track-menu");(qe=e.querySelector('[data-setting="subtitleTrack"]'))==null||qe.addEventListener("click",()=>{Ae.classList.toggle("visible")});const ot=e.querySelector(".upload-subtitle-menu");(Ue=e.querySelector('[data-setting="uploadSubtitle"]'))==null||Ue.addEventListener("click",()=>{ot.classList.toggle("visible"),Ae.classList.remove("visible"),cloudSubtitlesMenu.classList.remove("visible")});const w=e.querySelector(".upload-zone"),V=w==null?void 0:w.querySelector(".subtitle-input");w==null||w.addEventListener("click",()=>{V==null||V.click()}),V==null||V.addEventListener("change",async l=>{const c=l.target.files;if(c&&c.length>0)for(let p=0;p<c.length;p++){const v=c[p];if(v.name.endsWith(".srt")||v.name.endsWith(".vtt"))try{await _e(v),W()}catch(q){console.error("Subtitle upload error:",q)}}V.value=""}),w==null||w.addEventListener("dragover",l=>{l.preventDefault(),w.classList.add("dragover")}),w==null||w.addEventListener("dragleave",()=>{w.classList.remove("dragover")}),w==null||w.addEventListener("drop",async l=>{var p;l.preventDefault(),w.classList.remove("dragover");const c=(p=l.dataTransfer)==null?void 0:p.files;if(c&&c.length>0)for(let v=0;v<c.length;v++){const q=c[v];if(q.name.endsWith(".srt")||q.name.endsWith(".vtt"))try{await _e(q),W()}catch($){console.error("Subtitle upload error:",$)}}});function W(){const l=e.querySelector(".uploaded-subtitles-list");if(l){if(N.length===0){l.innerHTML='<p style="color: var(--text-light); font-size: 0.85em; padding: 10px;">No subtitles uploaded</p>';return}l.innerHTML=N.map((c,p)=>`
      <div class="loaded-subtitle-item ${p===N.length-1?"active":""}">
        <span class="name">${c.label.substring(0,25)}${c.label.length>25?"...":""}</span>
        <button class="remove-btn" onclick="removeSubtitle(${p})">✕</button>
      </div>
    `).join("")}}window.removeSubtitle=function(l){if(N[l]){const c=N[l];c.track&&c.track.parentNode&&c.track.parentNode.removeChild(c.track),c.url&&URL.revokeObjectURL(c.url),N.splice(l,1),W(),L("Subtitle removed","info")}};let y=null;function it(){const l=document.getElementById("cloudSubtitlesModal");if(l&&l.remove(),y=document.createElement("div"),y.id="cloudSubtitlesModal",y.className="cloud-subtitles-modal",y.innerHTML=`
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
    `,document.body.appendChild(y),!document.getElementById("cloudSubtitlesModalStyles")){const $=document.createElement("style");$.id="cloudSubtitlesModalStyles",$.textContent=`
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
      `,document.head.appendChild($)}y.querySelector(".close-cloud-modal").addEventListener("click",se),y.addEventListener("click",$=>{$.target===y&&se()}),document.addEventListener("keydown",He);const p=y.querySelector(".cloud-search-input-modal"),v=y.querySelector(".cloud-search-btn-modal");async function q(){const $=p.value.trim();if(!$){L("Please enter a search term","warning");return}const Ve=y.querySelector(".cloud-results-modal");Ve.innerHTML=`
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Searching for "${$}"...</p>
        </div>
      `,v.disabled=!0;try{const ve=await mt($);rt(ve,$)}catch(ve){console.error("Cloud search error:",ve),Ve.innerHTML=`
          <div class="no-results">
            <div class="no-results-icon">😕</div>
            <p>Search failed. Please try again.</p>
          </div>
        `}finally{v.disabled=!1}}v.addEventListener("click",q),p.addEventListener("keypress",$=>{$.key==="Enter"&&q()}),setTimeout(()=>p.focus(),100)}function rt(l,c){const p=y.querySelector(".cloud-results-modal");if(l.length===0){p.innerHTML=`
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <p>No subtitles found for "${c}"</p>
          <p style="font-size: 0.9em; margin-top: 10px; color: rgba(255,255,255,0.5);">Try a different search term or upload your own subtitle</p>
        </div>
      `;return}p.innerHTML=l.map((v,q)=>{var $;return`
      <div class="subtitle-result" data-id="${v.id}" data-filename="${v.file_name.replace(/'/g,"\\'")}" onclick="handleSubtitleClick('${v.id}', '${v.file_name.replace(/'/g,"\\'")}', this)">
        <div class="subtitle-result-info">
          <div class="name">${v.file_name}</div>
          <div class="details">
            ${(($=v.language)==null?void 0:$.toUpperCase())||"Unknown"} 
            • ⭐ ${v.rating||"N/A"} 
            • ↓ ${v.downloads||0}
          </div>
        </div>
        <button class="download-btn" onclick="event.stopPropagation(); handleSubtitleDownload('${v.id}', '${v.file_name.replace(/'/g,"\\'")}', this)">⬇</button>
      </div>
    `}).join("")}window.handleSubtitleClick=async function(l,c,p){p.parentElement.querySelectorAll(".subtitle-result").forEach(v=>v.style.background=""),p.style.background="rgba(233, 69, 96, 0.25)",p.style.borderColor="var(--accent)",await handleSubtitleDownload(l,c,p.querySelector(".download-btn"))},window.handleSubtitleDownload=async function(l,c,p){p.disabled=!0,p.textContent="⏳",await gt(l,c)?(p.textContent="✓",p.style.background="var(--success, #00d26a)",L(`Loaded: ${c}`,"success"),W(),setTimeout(()=>{se()},1e3)):(p.disabled=!1,p.textContent="⬇")};function at(){y||it(),y.classList.add("visible");const l=y==null?void 0:y.querySelector(".cloud-search-input-modal");l&&window.currentAnimeTitle&&(l.value=window.currentAnimeTitle)}function se(){y&&(y.classList.remove("visible"),document.removeEventListener("keydown",He))}function He(l){l.key==="Escape"&&se()}return(Pe=e.querySelector('[data-setting="cloudSubtitles"]'))==null||Pe.addEventListener("click",()=>{at(),b==null||b.classList.remove("visible")}),W(),document.addEventListener("keydown",l=>{if(e.isConnected&&l.target.tagName!=="INPUT")switch(l.key){case" ":case"k":l.preventDefault(),ce();break;case"m":de();break;case"f":Ee();break;case"ArrowLeft":l.preventDefault(),_(-5);break;case"ArrowRight":l.preventDefault(),_(5);break;case"j":_(-10);break;case"l":_(10);break}}),e.addEventListener("mousemove",Me),e.addEventListener("mouseleave",()=>{R&&e.classList.remove("show-controls")}),s.addEventListener("timeupdate",()=>{var c;const l=s.textTracks;for(let p=0;p<l.length;p++)if(l[p].mode==="showing"){const v=(c=l[p].activeCues)==null?void 0:c[0];et.textContent=v?v.text:"",E.classList.toggle("visible",!!v);break}}),(De=o.querySelector(".retry-btn"))==null||De.addEventListener("click",()=>{Te(),K(),ue(e.dataset.videoUrl)}),e.dataset.videoUrl=t.videoUrl||"",t.videoUrl&&(K(),ue(t.videoUrl)),{element:e,video:s,loadVideo:l=>{e.dataset.videoUrl=l,Te(),K(),ue(l)},setEpisodeCallbacks:(l,c)=>{const p=e.querySelector(".prev-episode"),v=e.querySelector(".next-episode");p.disabled=!l,v.disabled=!c,p.onclick=l||(()=>{}),v.onclick=c||(()=>{})}}}let S=null,j=0,ne=null;async function ft(){const e=O.value,t=I(e,"home");console.log("Fetching home page data from:",t);try{const s=await T(t);return bt(s)}catch(s){throw console.error("Error fetching home page data:",s),s}}function bt(e){return e?(e.data&&(e=e.data),{status:e.status||!0,spotlight:yt(e.spotlight||[]),trending:A(e.trending||[]),topAiring:A(e.topAiring||[]),mostPopular:A(e.mostPopular||[]),mostFavorite:A(e.mostFavorite||[]),latestCompleted:A(e.latestCompleted||[]),latestEpisode:A(e.latestEpisode||[]),newAdded:A(e.newAdded||[]),topUpcoming:A(e.topUpcoming||[]),topTen:wt(e.topTen||{today:[],week:[],month:[]}),genres:e.genres||[]}):null}function yt(e){return e.map(t=>{var s,n,o;return{title:t.title||"Unknown Title",alternativeTitle:t.alternativeTitle||"",id:t.id||"",poster:t.poster||"https://via.placeholder.com/400x600",episodes:{sub:((s=t.episodes)==null?void 0:s.sub)||0,dub:((n=t.episodes)==null?void 0:n.dub)||0,eps:((o=t.episodes)==null?void 0:o.eps)||0},rank:t.rank||0,type:t.type||"TV",quality:t.quality||"HD",duration:t.duration||"Unknown",aired:t.aired||"Unknown",synopsis:t.synopsis||"No synopsis available."}})}function A(e){return e.map(t=>{var s,n,o;return{title:t.title||"Unknown Title",alternativeTitle:t.alternativeTitle||"",id:t.id||"",poster:t.poster||"https://via.placeholder.com/200x300",episodes:{sub:((s=t.episodes)==null?void 0:s.sub)||0,dub:((n=t.episodes)==null?void 0:n.dub)||0,eps:((o=t.episodes)==null?void 0:o.eps)||0},type:t.type||"TV"}})}function wt(e){return{today:A(e.today||[]).slice(0,10),week:A(e.week||[]).slice(0,10),month:A(e.month||[]).slice(0,10)}}function $e(){const e=document.getElementById("homePage"),t=document.querySelector(".search-container"),s=document.getElementById("results"),n=document.getElementById("details"),o=document.getElementById("episodes"),i=document.getElementById("servers"),r=document.getElementById("homeBtn"),a=document.getElementById("searchNavBtn");r.classList.add("active"),a.classList.remove("active"),e.classList.add("visible"),e.classList.remove("hidden"),t.classList.remove("visible"),s.innerHTML="",n.innerHTML="",o.innerHTML="",i.innerHTML="",S||Je()}function ae(){const e=document.getElementById("homePage"),t=document.querySelector(".search-container"),s=document.getElementById("homeBtn"),n=document.getElementById("searchNavBtn");s.classList.remove("active"),n.classList.add("active"),e.classList.remove("visible"),e.classList.add("hidden"),t.classList.add("visible"),Mt()}async function Je(){const e=document.getElementById("homeContent");e.innerHTML=St();try{if(S=await ft(),!S||!S.status)throw new Error("Failed to load home page data");e.innerHTML=kt(S),Et(),L("Home page loaded successfully","success")}catch(t){console.error("Error loading home page:",t),e.innerHTML=$t(t.message)}}function St(){return`
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
        ${Array(6).fill('<div class="skeleton-card"><div class="skeleton skeleton-img"></div></div>').join("")}
      </div>
    </div>
    <div class="home-section">
      <div class="section-header">
        <h2>🔥 Trending</h2>
      </div>
      <div class="home-skeleton">
        ${Array(6).fill('<div class="skeleton-card"><div class="skeleton skeleton-img"></div></div>').join("")}
      </div>
    </div>
  `}function $t(e){return`
    <div class="home-error">
      <div class="error-icon">😕</div>
      <h2>Oops! Something went wrong</h2>
      <p>${e||"Unable to load home page data. Please try again."}</p>
      <button class="retry-btn" onclick="loadHomePage()">🔄 Retry</button>
    </div>
  `}function kt(e){var s,n,o;let t="";return e.spotlight&&e.spotlight.length>0&&(t+=Lt(e.spotlight)),e.genres&&e.genres.length>0&&(t+=xt(e.genres)),e.topTen&&(((s=e.topTen.today)==null?void 0:s.length)>0||((n=e.topTen.week)==null?void 0:n.length)>0||((o=e.topTen.month)==null?void 0:o.length)>0)&&(t+=Tt(e.topTen)),e.trending&&e.trending.length>0&&(t+=U("📈 Trending Now","trending",e.trending)),e.topAiring&&e.topAiring.length>0&&(t+=U("▶️ Top Airing","topAiring",e.topAiring)),e.mostPopular&&e.mostPopular.length>0&&(t+=U("⭐ Most Popular","mostPopular",e.mostPopular)),e.mostFavorite&&e.mostFavorite.length>0&&(t+=U("❤️ Most Favorite","mostFavorite",e.mostFavorite)),e.latestCompleted&&e.latestCompleted.length>0&&(t+=U("✅ Latest Completed","latestCompleted",e.latestCompleted)),e.latestEpisode&&e.latestEpisode.length>0&&(t+=U("🎬 Latest Episodes","latestEpisode",e.latestEpisode)),e.newAdded&&e.newAdded.length>0&&(t+=U("🆕 Newly Added","newAdded",e.newAdded)),e.topUpcoming&&e.topUpcoming.length>0&&(t+=U("🚀 Top Upcoming","topUpcoming",e.topUpcoming)),t}function Lt(e){const t=e.map((n,o)=>{var i,r,a;return`
    <div class="spotlight-slide ${o===0?"active":""}" data-index="${o}">
      <img src="${n.poster}" alt="${n.title}" loading="lazy">
      <div class="spotlight-overlay">
        <div class="spotlight-rank">#${n.rank||o+1}</div>
        <h2 class="spotlight-title">${n.title}</h2>
        <div class="spotlight-meta">
          <span>${n.type||"TV"}</span>
          ${n.quality?`<span class="quality">${n.quality}</span>`:""}
          <span>${n.duration||"Unknown duration"}</span>
          ${((i=n.episodes)==null?void 0:i.sub)>0?`<span>📺 ${n.episodes.sub} eps</span>`:""}
        </div>
        <p class="spotlight-synopsis">${(r=n.synopsis)==null?void 0:r.substring(0,200)}${((a=n.synopsis)==null?void 0:a.length)>200?"...":""}</p>
        <div class="spotlight-actions">
          <button class="spotlight-btn primary" onclick="selectAnime('${n.id}', '${n.title.replace(/'/g,"\\'")}')">
            ▶️ Watch Now
          </button>
          <button class="spotlight-btn secondary" onclick="selectAnime('${n.id}', '${n.title.replace(/'/g,"\\'")}')">
            ℹ️ More Info
          </button>
        </div>
      </div>
    </div>
  `}).join(""),s=e.map((n,o)=>`
    <button class="spotlight-dot ${o===0?"active":""}" data-index="${o}"></button>
  `).join("");return`
    <div class="home-section">
      <div class="spotlight-container">
        <div class="spotlight-slider">
          ${t}
          <button class="spotlight-nav prev" onclick="prevSpotlight()">❮</button>
          <button class="spotlight-nav next" onclick="nextSpotlight()">❯</button>
          <div class="spotlight-dots">${s}</div>
        </div>
      </div>
    </div>
  `}function xt(e){return`
    <div class="home-section">
      <div class="section-header">
        <h2>🏷️ Browse by Genre</h2>
      </div>
      <div class="genres-container">${e.map(s=>`
    <button class="genre-tag-btn" onclick="searchByGenre('${s.replace(/'/g,"\\'")}')">${s}</button>
  `).join("")}</div>
    </div>
  `}function Tt(e){const t=(s,n)=>!s||s.length===0?'<p style="color: var(--text-light); text-align: center;">No data available</p>':s.slice(0,5).map((o,i)=>{var r;return`
      <div class="top10-item" onclick="selectAnime('${o.id}', '${o.title.replace(/'/g,"\\'")}')">
        <div class="top10-rank">${i+1}</div>
        <img src="${o.poster}" alt="${o.title}" loading="lazy">
        <div class="top10-item-info">
          <div class="title">${o.title}</div>
          <div class="episodes">${((r=o.episodes)==null?void 0:r.sub)>0?`${o.episodes.sub} eps`:o.type||"TV"}</div>
        </div>
      </div>
    `}).join("");return`
    <div class="home-section">
      <div class="section-header">
        <h2>📊 Top 10 Rankings</h2>
      </div>
      <div class="top10-section">
        <div class="top10-category">
          <h3>📅 Today</h3>
          ${t(e.today)}
        </div>
        <div class="top10-category">
          <h3>📆 This Week</h3>
          ${t(e.week)}
        </div>
        <div class="top10-category">
          <h3>🗓️ This Month</h3>
          ${t(e.month)}
        </div>
      </div>
    </div>
  `}function U(e,t,s){const n=s.slice(0,12).map(o=>{var i;return`
    <div class="home-anime-card" onclick="selectAnime('${o.id}', '${o.title.replace(/'/g,"\\'")}')">
      <img src="${o.poster}" alt="${o.title}" loading="lazy">
      <div class="home-anime-card-content">
        <h3>${o.title}</h3>
        <p>${((i=o.episodes)==null?void 0:i.sub)>0?`${o.episodes.sub} eps`:o.type||"TV"}</p>
      </div>
    </div>
  `}).join("");return`
    <div class="home-section">
      <div class="section-header">
        <h2>${e}</h2>
        <button class="see-all-btn" onclick="viewAllCategory('${t}')">See All →</button>
      </div>
      <div class="home-anime-grid">${n}</div>
    </div>
  `}function Et(){var e;(e=S==null?void 0:S.spotlight)!=null&&e.length&&(j=0,ne=setInterval(()=>{Ke()},5e3))}function Mt(){ne&&(clearInterval(ne),ne=null)}function Ke(){var e;(e=S==null?void 0:S.spotlight)!=null&&e.length&&(j=(j+1)%S.spotlight.length,Ze())}function Ct(){var e;(e=S==null?void 0:S.spotlight)!=null&&e.length&&(j=(j-1+S.spotlight.length)%S.spotlight.length,Ze())}function Ze(){const e=document.querySelectorAll(".spotlight-slide"),t=document.querySelectorAll(".spotlight-dot");e.forEach((s,n)=>{s.classList.toggle("active",n===j)}),t.forEach((s,n)=>{s.classList.toggle("active",n===j)})}function At(e){console.log("View all category:",e),L(`Showing all ${e} - Filter by provider if needed`,"info"),ae(),Y.focus()}function Ht(e){ae(),Y.value=e,Y.focus(),ke()}window.loadHomePage=Je;window.showHomePage=$e;window.showSearchPage=ae;window.nextSpotlight=Ke;window.prevSpotlight=Ct;window.viewAllCategory=At;window.searchByGenre=Ht;function L(e,t="info"){const s=document.querySelector(".toast-container");s&&s.remove();const n=document.createElement("div");n.className="toast-container";const o=document.createElement("div");o.className=`toast ${t}`;const i=t==="success"?"✓":t==="error"?"✕":"ℹ";o.innerHTML=`<span style="font-size:1.2em;">${i}</span> ${e}`,n.appendChild(o),document.body.appendChild(n),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateX(100px)",o.style.transition="all 0.3s ease",setTimeout(()=>n.remove(),300)},3e3)}function It(){let t="";for(let s=0;s<12;s++)t+=`
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
    `;G.innerHTML=t}async function ke(){const e=Y.value.trim();if(!e){L("Please enter a search query","warning");return}try{It();const t=O.value,s=I(t,"search",{query:e});console.log("Search URL:",s);const n=await T(s);let o=[];if(n&&n.data&&n.data.response&&Array.isArray(n.data.response)?o=n.data.response:Array.isArray(n)?o=n:n&&n.results&&Array.isArray(n.results)?o=n.results:n&&n.anime&&Array.isArray(n.anime)?o=n.anime:n&&n.data&&Array.isArray(n.data)&&(o=n.data),o.length===0){G.innerHTML='<p style="text-align:center;padding:40px;color:var(--text-light);">No results found. Try a different search term.</p>';return}Bt(o),L(`Found ${o.length} results`,"success")}catch(t){console.error("Search error:",t),G.innerHTML=`<p class="error" style="text-align:center;padding:40px;color:var(--accent);">Search failed: ${t.message}. Check your connection and try again.</p>`}}function Bt(e){ge={},G.innerHTML=e.map(t=>{const s=t.title||t.name||t.englishName||"Unknown Title",n=t.id||t.animeId||t.mal_id||"",o=t.image||t.poster||t.coverImage||"https://via.placeholder.com/150x200",i=t.releaseDate||t.year||t.startDate||"N/A";let r="";if(t.episodes)if(typeof t.episodes=="object"){const f=t.episodes.sub||0,m=t.episodes.dub||0,x=t.episodes.eps||0;f>0||m>0?r=`<p>${f>0?`Sub: ${f}`:""}${f>0&&m>0?" | ":""}${m>0?`Dub: ${m}`:""}</p>`:x>0&&(r=`<p>Episodes: ${x}</p>`)}else r=`<p>Episodes: ${t.episodes}</p>`;const a=t.type?`<p>${t.type}</p>`:"",d=t.duration?`<p>${t.duration}</p>`:"";return O.value==="hianime-scrap"?(ge[n]=t,`
        <div class="anime-card" onclick="selectAnime('${n.replace(/'/g,"\\'")}')">
          <img src="${o}" alt="${s}" loading="lazy">
          <h3>${s}</h3>
          ${r}
          ${a}
          ${d}
          <p>${i}</p>
        </div>
      `):`
      <div class="anime-card" onclick="selectAnime('${n.replace(/'/g,"\\'")}', '${s.replace(/'/g,"\\'")}')">
        <img src="${o}" alt="${s}" loading="lazy">
        <h3>${s}</h3>
        ${r}
        ${a}
        ${d}
        <p>${i}</p>
      </div>
    `}).join("")}async function zt(e,t){var i,r,a,d,u,f;if(!e){alert("Invalid anime ID");return}const s=O.value,n=s==="hianime-scrap",o=n?ge[e]:null;try{if(X.innerHTML="<p>Loading details...</p>",n&&o){const b={...o,id:o.id||e,__provider:s};try{const H=I(s,"episodes",{id:e});console.log("Episodes URL:",H);const h=await T(H);if(b.episodes=We(h,s),b.episodes.length>0){me(b,o.title);return}}catch(H){console.warn("Could not fetch episodes for hianime-scrap:",H)}const C=((i=b.episodes)==null?void 0:i.eps)||((r=b.episodes)==null?void 0:r.sub)||((a=b.episodes)==null?void 0:a.dub)||((d=b.episodes)==null?void 0:d.total)||((u=b.episodes)==null?void 0:u.episodeCount)||((f=b.episodes)==null?void 0:f.totalEpisodes)||0;C>0?(b.episodes=Array.from({length:Math.min(C,500)},(H,h)=>({id:`${e}::ep=${h+1}`,number:h+1,title:`Episode ${h+1}`,isFiller:!1})),console.log(`Generated ${C} episode buttons from count`)):b.episodes=[],me(b,o.title);return}const m=typeof t=="string"?t:null,x=I(s,"info",{id:e});console.log("Info URL:",x);const z=await T(x);let k=qt(z,e,s);if(!k.episodes||k.episodes.length===0)try{const b=I(s,"episodes",{id:e});console.log("Episodes URL:",b);const C=await T(b);k.episodes=We(C,s)}catch(b){console.warn("Could not fetch episodes separately:",b),k.episodes=[]}k.__provider=s,me(k,m||k.title)}catch(m){console.error("Details error:",m),X.innerHTML=`<p class="error">Error loading anime details: ${m.message}</p>`}}function qt(e,t,s){var n,o,i;if(e&&e.data&&s==="hianime-scrap")return{...e.data,id:e.data.id||t,title:e.data.title,poster:e.data.poster,image:e.data.poster,type:e.data.type,status:e.data.status,genres:e.data.genres||[],description:e.data.description||e.data.synopsis||"",totalEpisodes:((n=e.data.episodes)==null?void 0:n.eps)||((o=e.data.episodes)==null?void 0:o.sub)||((i=e.data.episodes)==null?void 0:i.dub)||"Unknown"};if(Array.isArray(e)){const r=e.find(a=>a&&a.id===t)||e[0];return r?{...r,id:r.id||t}:{id:t,episodes:[]}}if(e&&e.results&&Array.isArray(e.results)){const r=e.results.find(a=>a&&a.id===t)||e.results[0];return r?{...r,id:r.id||t}:{...e,id:e.id||t}}return e&&e.data?{...e.data,id:e.data.id||t}:e&&(e.title||e.name||e.englishName)?{...e,id:e.id||t}:{id:t,...e||{}}}function We(e,t){return e?t==="hianime-scrap"&&e&&e.data&&Array.isArray(e.data)?e.data.map((s,n)=>({id:s.id||`${n+1}`,number:s.episodeNumber||n+1,title:s.title||s.alternativeTitle||`Episode ${s.episodeNumber||n+1}`,isFiller:s.isFiller||!1})):Array.isArray(e)?e.map((s,n)=>({id:s.id||s.episodeId||`${n+1}`,number:s.number||s.episode||s.ep||n+1,title:s.title||s.name||`Episode ${n+1}`})):e.episodes&&Array.isArray(e.episodes)?e.episodes.map((s,n)=>({id:s.id||s.episodeId||`${n+1}`,number:s.number||s.episode||s.ep||n+1,title:s.title||s.name||`Episode ${n+1}`})):e.data&&Array.isArray(e.data)?e.data.map((s,n)=>({id:s.id||s.episodeId||`${n+1}`,number:s.number||s.episode||s.ep||n+1,title:s.title||s.name||`Episode ${n+1}`})):[]:[]}async function Se(e,t){if(!e){alert("Invalid episode ID");return}const s=O.value;try{if(g.innerHTML=`
      <h3>Servers for Episode ${t||"?"}</h3>
      <p class="loading-servers" style="padding: 20px; text-align: center; color: var(--accent);">
        <span class="loading-spinner"></span> Loading servers...
      </p>
    `,s==="hianime-scrap"){let i=e,r=t;const a=e.match(/::ep=(\d+)$/);a&&(r=a[1],console.log(`Episode ${r} selected (ID: ${e})`));const d=I(s,"servers",{id:e});console.log("Servers URL:",d);const u=await T(d);Pt(u,r||t||"1",e),g.scrollIntoView({behavior:"smooth"});return}if(s==="animepahe"){const i=I(s,"watch",{episodeId:e});console.log("Watch URL:",i);const r=await T(i);he(r,t||"1"),g.scrollIntoView({behavior:"smooth"});return}if(s==="animekai"){const i=I(s,"watch",{episodeId:e});console.log("Watch URL:",i);const r=await T(i);he(r,t||"1"),g.scrollIntoView({behavior:"smooth"});return}const n=I(s,"servers",{id:e});console.log("Servers URL:",n);const o=await T(n);he(o,t||"1"),g.scrollIntoView({behavior:"smooth"})}catch(n){console.error("Servers error:",n),g.innerHTML=`<p class="error">Error loading servers: ${n.message}. Try a different episode.</p>`}}window.selectAnime=zt;window.selectEpisode=Se;function me(e,t){var m;console.log("Displaying anime details:",e),ie=e.id||null;const s=e.title||t||"Unknown Title";window.currentAnimeTitle=t||s;const n=e.image||e.poster||e.coverImage||"https://via.placeholder.com/200x300",o=e.japaneseTitle||e.jname||"",i=e.type||e.format||"Unknown",r=e.status||"",a=e.genres||(e.genre?[e.genre]:[]),d=e.totalEpisodes||e.episodeCount||((m=e.episodes)==null?void 0:m.length)||"Unknown",u=e.description||e.synopsis||"No description available",f=e.url||e.animeUrl||"";X.innerHTML=`
    <div class="anime-details">
      <div class="anime-header">
        <img src="${n}" alt="${s}" onerror="this.src='https://via.placeholder.com/200x300'">
        <div class="anime-info">
          <h2>${s}</h2>
          ${o?`<p><strong>Japanese:</strong> ${o}</p>`:""}
          <p><strong>Type:</strong> ${i}</p>
          ${r?`<p><strong>Status:</strong> ${r}</p>`:""}
          ${a.length>0?`<p><strong>Genres:</strong> ${a.join(", ")}</p>`:""}
          <p><strong>Episodes:</strong> ${d}</p>
          <p><strong>Description:</strong> ${u}</p>
          ${f?`<p><a href="${f}" target="_blank" rel="noopener noreferrer" class="watch-link">View on Provider →</a></p>`:""}
        </div>
      </div>
    </div>
  `,X.scrollIntoView({behavior:"smooth"}),e.episodes&&e.episodes.length>0?(P=e.episodes,Ut(e.episodes)):(oe.innerHTML="<p>No episodes available</p>",P=[]),g.innerHTML=""}function Ut(e){oe.innerHTML="<h3>Episodes</h3>";const t=e.map((s,n)=>{const o=s.number||s.episode||s.ep||n+1,i=s.title||s.name||"",r=s.id||`${n+1}`,a=s.isFiller,d=a?'<span style="color:#ffcc00;font-size:0.7em;"> ★Filler</span>':"";return`
      <button 
        class="episode-btn ${a?"filler":""}" 
        onclick="selectEpisode('${String(r).replace(/'/g,"\\'")}', '${o}')"
        title="${i}${a?" (Filler)":""}"
      >
        ${o}${d}
        ${i?`<br><small style="font-size:0.7em">${i.substring(0,20)}${i.length>20?"...":""}</small>`:""}
      </button>
    `}).join("");oe.innerHTML+=`<div class="episodes-grid">${t}</div>`}function Pt(e,t,s){const n=Q();if(g.innerHTML=`
    <div class="player-toggle-header">
      <h3>Servers for Episode ${t}</h3>
      <div class="player-toggle">
        <span class="toggle-custom">🎬 Custom</span>
        <label class="toggle-switch" onclick="handlePlayerToggle()">
          <input type="checkbox" id="playerToggle" ${n?"checked":""}>
          <span class="toggle-slider"></span>
        </label>
        <span class="toggle-default">🌐 Default</span>
      </div>
    </div>
  `,!e||!e.success||!e.data){g.innerHTML+="<p>No servers available for this episode. Try a different episode.</p>";return}const o=e.data,i=o.sub||[],r=o.dub||[],a=o.raw||[];if(i.length===0&&r.length===0&&a.length===0){g.innerHTML+="<p>No servers available for this episode. Try a different episode.</p>";return}window.hianimeScrapServerData={episodeId:s,sub:i,dub:r,raw:a};let d='<div class="servers-tabs">';d+=`<div class="server-tab ${i.length>0?"active":""}" onclick="showHianimeScrapServers('sub')">Sub (${i.length})</div>`,d+=`<div class="server-tab ${i.length===0&&r.length>0?"active":""}" onclick="showHianimeScrapServers('dub')">Dub (${r.length})</div>`,d+=`<div class="server-tab ${i.length===0&&r.length===0&&a.length>0?"active":""}" onclick="showHianimeScrapServers('raw')">Raw (${a.length})</div>`,d+="</div>",d+='<div id="hianimeScrapServersList" class="servers-list"></div>',g.innerHTML+=d,i.length>0?showHianimeScrapServers("sub"):r.length>0?showHianimeScrapServers("dub"):showHianimeScrapServers("raw")}window.showHianimeScrapServers=function(e){const t=document.getElementById("hianimeScrapServersList");if(!t||!window.hianimeScrapServerData)return;document.querySelectorAll(".server-tab").forEach(n=>{n.classList.remove("active"),n.textContent.toLowerCase().includes(e)&&n.classList.add("active")});const s=window.hianimeScrapServerData[e]||[];if(s.length===0){t.innerHTML=`<p>No ${e} servers available.</p>`;return}t.innerHTML=s.map(n=>{const o=n.name||`Server ${n.index||""}`,i=n.id,r=e;return`
      <div class="server-option">
        <strong>${o}</strong>
        <p>Type: ${r.charAt(0).toUpperCase()+r.slice(1)}</p>
        <p><button class="play-btn" onclick="playHianimeScrapStream('${i}', '${r}', '${o.replace(/'/g,"\\'")}')">▶ Play</button></p>
      </div>
    `}).join("")};window.playHianimeScrapStream=async function(e,t,s){if(!window.hianimeScrapServerData)return alert("No server data available");const n=window.hianimeScrapServerData.episodeId,o=I("hianime-scrap","stream",{id:n,type:t,server:s});console.log("Stream URL:",o);try{let i=g.querySelector(".stream-loading");i||(i=document.createElement("p"),i.className="stream-loading",i.innerHTML='<span class="loading-spinner"></span> Loading stream...',i.style.cssText="padding: 20px; text-align: center; color: var(--accent);",g.prepend(i));const r=await T(o);if(i&&i.parentNode&&i.parentNode.removeChild(i),r&&r.success&&r.data)Dt(r.data,s);else{let a=g.querySelector(".stream-error");a||(a=document.createElement("p"),a.className="stream-error error",a.textContent="Failed to load stream. Try a different server.",g.prepend(a))}}catch(i){console.error("Stream error:",i);const r=g.querySelector(".stream-loading");r&&r.parentNode&&r.parentNode.removeChild(r);let a=g.querySelector(".stream-error");a||(a=document.createElement("p"),a.className="stream-error error",a.textContent=`Error loading stream: ${i.message}`,g.prepend(a))}};function Dt(e,t){var z,k,b,C,H;const s=((z=e.link)==null?void 0:z.file)||((k=e.link)==null?void 0:k.directUrl)||"",n=e.tracks||[],o=e.intro||{start:0,end:0},i=e.outro||{start:0,end:0},r=Q();if(!s){if(!g.querySelector(".stream-error")){const E=document.createElement("p");E.className="stream-error error",E.textContent="No video URL available",g.prepend(E)}return}const a=document.getElementById("customVideoPlayer");a&&a.remove();const d=document.getElementById("defaultVideoPlayer");d&&d.remove();let u=document.getElementById("videoPlayer");u||(u=document.createElement("div"),u.id="videoPlayer",u.className="video-player-section",u.style.marginBottom="20px"),g.prepend(u);let f="";if((o.start!==0||o.end!==0)&&(f+=`<p style="color:#ffcc00;">Skip intro: ${o.start}s - ${o.end}s</p>`),(i.start!==0||i.end!==0)&&(f+=`<p style="color:#ffcc00;">Skip outro: ${i.start}s - ${i.end}s</p>`),window.currentAnimeTitle=t||window.currentAnimeTitle,u.innerHTML=`
    <h3>Now Playing: ${t}</h3>
    ${f}
  `,r){const h=Xe({videoUrl:s,title:t,tracks:n,intro:o,outro:i});u.appendChild(h),B=Qe(h,{videoUrl:s})}else{const h=Ye({videoUrl:s,title:t});u.appendChild(h),B=Ge(h,{videoUrl:s})}const m=((b=window.hianimeScrapServerData)==null?void 0:b.currentEpisodeIndex)??-1,x=((C=window.hianimeScrapServerData)==null?void 0:C.totalEpisodes)??0;B&&((H=window.hianimeScrapServerData)!=null&&H.episodes)&&B.setEpisodeCallbacks(m>0?()=>{const h=window.hianimeScrapServerData.episodes[m-1];h&&(h.id||`${window.hianimeScrapServerData.animeId}${h.number}`,window.hianimeScrapServerData.currentEpisodeIndex=m-1,playHianimeScrapStream(h.id,window.hianimeScrapServerData.currentServerType||"sub",h.name||`Episode ${h.number}`))}:null,m<x-1?()=>{const h=window.hianimeScrapServerData.episodes[m+1];h&&(h.id||`${window.hianimeScrapServerData.animeId}${h.number}`,window.hianimeScrapServerData.currentEpisodeIndex=m+1,playHianimeScrapStream(h.id,window.hianimeScrapServerData.currentServerType||"sub",h.name||`Episode ${h.number}`))}:null)}function he(e,t){const s=Q();g.innerHTML=`
    <div class="player-toggle-header">
      <h3>Servers for Episode ${t}</h3>
      <div class="player-toggle">
        <span class="toggle-custom">🎬 Custom</span>
        <label class="toggle-switch" onclick="handlePlayerToggle()">
          <input type="checkbox" id="playerToggle" ${s?"checked":""}>
          <span class="toggle-slider"></span>
        </label>
        <span class="toggle-default">🌐 Default</span>
      </div>
    </div>
  `;let n=[];if(Array.isArray(e)?n=e:e&&e.servers&&Array.isArray(e.servers)?n=e.servers:e&&e.sources&&Array.isArray(e.sources)?n=e.sources:e&&e.data&&Array.isArray(e.data)?n=e.data:e&&e.streamingServers&&Array.isArray(e.streamingServers)&&(n=e.streamingServers),n.length===0){g.innerHTML+="<p>No servers available for this episode. Try a different episode.</p>";return}let o='<div class="servers-list">';n.forEach((i,r)=>{const a=i.name||i.serverName||i.quality||`Server ${r+1}`,d=i.url||i.file||i.src||i.streamUrl||"";if(o+=`
      <div class="server-option">
        <strong>${a}</strong>
    `,d){const u=`${Ne}/fetch?url=${encodeURIComponent(d)}`;o+=`
        <p><a href="${d}" target="_blank" rel="noopener noreferrer">Open Original</a></p>
        <p><a href="${u}" target="_blank" rel="noopener noreferrer">Open via Proxy</a></p>
        <p><button class="play-btn" onclick="playStream('${u.replace(/'/g,"\\'")}', '${a.replace(/'/g,"\\'")}')">▶ Play</button></p>
      `,i.sources&&Array.isArray(i.sources)&&i.sources.forEach((f,m)=>{const x=f.url||f.file||f.src||"";if(x){const z=`${Ne}/fetch?url=${encodeURIComponent(x)}`,k=f.quality||`Source ${m+1}`;o+=`
              <hr style="margin: 10px 0; border-color: rgba(233,69,96,0.3);">
              <p><strong>${k}</strong></p>
              <p><a href="${x}" target="_blank" rel="noopener noreferrer">Open Original</a></p>
              <p><a href="${z}" target="_blank" rel="noopener noreferrer">Open via Proxy</a></p>
              <p><button class="play-btn" onclick="playStream('${z.replace(/'/g,"\\'")}', '${k.replace(/'/g,"\\'")}')">▶ Play</button></p>
            `}})}else o+="<p>No direct URL available</p>";(i.intro||i.outro)&&(o+='<p class="meta">',i.intro&&(o+=`Intro: ${i.intro.start}-${i.intro.end}s `),i.outro&&(o+=`Outro: ${i.outro.start}-${i.outro.end}s`),o+="</p>"),o+="</div>"}),o+="</div>",g.innerHTML+=o}window.playStream=async function(e,t){if(!e)return alert("No stream URL available");console.log("Playing stream:",e);const s=Q(),n=document.getElementById("customVideoPlayer");n&&n.remove();const o=document.getElementById("defaultVideoPlayer");o&&o.remove();let i=document.getElementById("videoPlayer");if(i||(i=document.createElement("div"),i.id="videoPlayer",i.className="video-player-section",i.style.marginBottom="20px"),g.prepend(i),window.currentAnimeTitle=t||window.currentAnimeTitle,i.innerHTML=`<h3>Now Playing: ${t}</h3>`,s){const a=Xe({videoUrl:e,title:t,tracks:[],intro:{},outro:{}});i.appendChild(a),B=Qe(a,{videoUrl:e})}else{const a=Ye({videoUrl:e,title:t});i.appendChild(a),B=Ge(a,{videoUrl:e})}const r=P.findIndex(a=>{var f,m;const d=a.number||a.episode||a.ep||0,u=parseInt(((m=(f=document.querySelector(".episode-btn.active"))==null?void 0:f.textContent)==null?void 0:m.trim())||"0");return d===u});B&&P.length>0&&B.setEpisodeCallbacks(r>0?()=>{const a=P[r-1];if(a){const d=a.id||`${ie}-episode-${a.number||r}`,u=a.number||a.episode||a.ep||r;Se(d,String(u))}}:null,r<P.length-1?()=>{const a=P[r+1];if(a){const d=a.id||`${ie}-episode-${a.number||r+2}`,u=a.number||a.episode||a.ep||r+2;Se(d,String(u))}}:null)};dt.addEventListener("click",ke);Y.addEventListener("keypress",e=>{e.key==="Enter"&&ke()});O.addEventListener("change",()=>{G.innerHTML="",X.innerHTML="",oe.innerHTML="",g.innerHTML="",ie=null,P=[],S=null});document.getElementById("homeBtn").addEventListener("click",$e);document.getElementById("searchNavBtn").addEventListener("click",ae);document.addEventListener("DOMContentLoaded",()=>{$e()});
