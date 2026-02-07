(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function s(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=s(i);fetch(i.href,r)}})();const nt="https://ttt-mauve-rho.vercel.app",E=nt,it={animekai:{base:E+"/anime/animekai",templates:{search:E+"/anime/animekai/{query}",info:E+"/anime/animekai/info?id={id}",episodes:E+"/anime/animekai/episodes/{id}",watch:E+"/anime/animekai/watch/{episodeId}",home:E+"/anime/animekai/new-releases"}},animepahe:{base:E+"/anime/animepahe",templates:{search:E+"/anime/animepahe/{query}",info:E+"/anime/animepahe/info/{id}",episodes:E+"/anime/animepahe/episodes/{id}",watch:E+"/anime/animepahe/watch?episodeId={episodeId}",home:E+"/anime/animekai/new-releases"}},"hianime-scrap":{base:"https://api.animo.qzz.io/api/v1",templates:{search:"https://hianimeapi-6uju.onrender.com/api/v1/search?keyword={query}&page=1",info:"https://api.animo.qzz.io/api/v1/animes/{id}",episodes:"https://api.animo.qzz.io/api/v1/episodes/{id}",servers:"https://api.animo.qzz.io/api/v1/servers?id={id}",stream:"https://api.animo.qzz.io/api/v1/stream?id={id}&type={type}&server={server}",home:"https://hianimeapi-6uju.onrender.com/api/v1/home"}}},De="https://renewed-georgeanne-nekonode-1aa70c0c.koyeb.app";function H(e,t,s={}){const n=it[e];if(!n)return console.error(`Provider ${e} not found`),"";const i=n.templates[t];if(!i)return console.error(`Template ${t} not found for provider ${e}`),"";let r=i;return Object.keys(s).forEach(o=>{let a=s[o];o==="episodeId"?a=encodeURIComponent(a):a!=null?a=encodeURIComponent(String(a)):a="",r=r.replace(new RegExp(`\\{${o}\\}`,"g"),a)}),r}async function x(e,t={}){try{const s={Accept:"application/json",...t.headers||{}};t.body&&(s["Content-Type"]="application/json");const n=await fetch(e,{...t,headers:s});if(!n.ok)throw new Error(`HTTP error! status: ${n.status}`);return await n.json()}catch(s){throw console.error(`Fetch error for ${e}:`,s),s}}document.getElementById("app");const Y=document.getElementById("searchInput"),ot=document.getElementById("searchBtn"),O=document.getElementById("providerSelect"),G=document.getElementById("results"),X=document.getElementById("details"),ne=document.getElementById("episodes"),h=document.getElementById("servers");let ie=null,U=[],me={},P=null,V=[],Ve=[];function ge(e){const t=[],s=/(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n\n|\n*$)/g;let n;for(;(n=s.exec(e))!==null;)t.push({startTime:oe(n[2]),endTime:oe(n[3]),text:n[4].trim()});return t}function fe(e){const t=[],s=/(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})\n([\s\S]*?)(?=\n\n|\n*$)/g;let n;for(e=e.replace(/^WEBVTT.*?\n\n/s,"");(n=s.exec(e))!==null;)t.push({startTime:oe(n[1]),endTime:oe(n[2]),text:n[3].trim()});return t}function oe(e){const t=e.split(/[:,.]/);if(t.length>=4){const s=parseInt(t[0]),n=parseInt(t[1]),i=parseInt(t[2]),r=parseInt(t[3]);return s*3600+n*60+i+r/1e3}return 0}function be(e,t,s="en"){if(!P)return;const n=P.video,i=document.createElement("track");i.label=t,i.kind="subtitles",i.srclang=s,i.mode="hidden";let r=`WEBVTT

`;e.forEach((u,p)=>{r+=`${je(u.startTime)} --> ${je(u.endTime)}
${u.text}

`});const o=new Blob([r],{type:"text/vtt"}),a=URL.createObjectURL(o);i.src=a,n.appendChild(i),V.push({track:i,url:a,label:t,language:s,cues:e});for(let u=0;u<n.textTracks.length;u++)n.textTracks[u].mode="hidden";return n.textTracks.length>0&&(n.textTracks[n.textTracks.length-1].mode="showing"),i}function je(e){const t=Math.floor(e/3600),s=Math.floor(e%3600/60),n=Math.floor(e%60),i=Math.floor(e%1*1e3);return`${t.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}:${n.toString().padStart(2,"0")}.${i.toString().padStart(3,"0")}`}function Re(e){return new Promise((t,s)=>{const n=new FileReader;n.onload=i=>{const r=i.target.result;let o=[];if(e.name.endsWith(".srt")?o=ge(r):e.name.endsWith(".vtt")||r.includes("WEBVTT")?o=fe(r):o=ge(r),o.length>0){const a=ye(e.name),u=be(o,e.name,a);k(`Subtitle "${e.name}" loaded successfully`,"success"),t({cues:o,label:e.name,language:a,track:u})}else k("Failed to parse subtitle file","error"),s(new Error("Failed to parse subtitle"))},n.onerror=()=>{k("Error reading subtitle file","error"),s(new Error("Error reading file"))},n.readAsText(e)})}function ye(e){const t=e.toLowerCase();return t.includes("english")||t.includes("eng")?"en":t.includes("spanish")||t.includes("español")?"es":t.includes("french")||t.includes("français")?"fr":t.includes("german")||t.includes("deutsch")?"de":t.includes("italian")||t.includes("italiano")?"it":t.includes("portuguese")||t.includes("português")?"pt":t.includes("russian")||t.includes("русский")?"ru":t.includes("japanese")?"ja":t.includes("korean")?"ko":t.includes("chinese")||t.includes("中文")?"zh":"en"}async function rt(e){try{const t=await x(`https://api.opensubtitles.com/api/v1/subtitles?query=${encodeURIComponent(e)}&languages=en`,{headers:{"Api-Key":"Y2xvdWQtMTYzODU2MkAxNzMxNjM2NjI3OmRhMWQxNDM0YWFkZjM0ZGU4NzgwMjhhZTk0OWE0YzU0","User-Agent":"AnimeFlix v1.0.0",Accept:"application/json"}});return t&&t.data&&Array.isArray(t.data)?(Ve=t.data.slice(0,10),Ve):[]}catch(t){return console.error("Cloud subtitle search error:",t),at(e)}}function at(e){return[{id:"1",file_name:`${e} English.srt`,language:"en",downloads:1e3,rating:8.5},{id:"2",file_name:`${e} English [SDH].srt`,language:"en",downloads:800,rating:8.2},{id:"3",file_name:`${e} Spanish.srt`,language:"es",downloads:500,rating:7.9},{id:"4",file_name:`${e} French.srt`,language:"fr",downloads:400,rating:7.8},{id:"5",file_name:`${e} Portuguese.srt`,language:"pt",downloads:300,rating:7.5}]}async function lt(e,t){try{k(`Downloading ${t}...`,"info");const s=await x(`https://api.opensubtitles.com/api/v1/download/${e}`,{headers:{"Api-Key":"Y2xvdWQtMTYzODU2MkAxNzMxNjM2NjI3OmRhMWQxNDM0YWFkZjM0ZGU4NzgwMjhhZTk0OWE0YzU0","User-Agent":"AnimeFlix v1.0.0",Accept:"application/json","Content-Type":"application/json"},method:"POST",body:JSON.stringify({file_name:t})});if(s&&s.link){const r=await x(s.link);let o=[];if(typeof r=="string"?r.includes("WEBVTT")?o=fe(r):o=ge(r):typeof r=="object"&&(o=r),o.length>0){const a=ye(t);return be(o,t,a),k(`Loaded ${t}`,"success"),!0}}const n=[{startTime:0,endTime:2,text:"This is a sample subtitle"},{startTime:2,endTime:4,text:"Downloaded from cloud"},{startTime:4,endTime:6,text:`${t}`}],i=ye(t);return be(n,t,i),k(`Loaded ${t} (demo)`,"success"),!0}catch(s){return console.error("Download error:",s),k("Failed to download subtitle","error"),!1}}function Oe(e){const{videoUrl:t="",title:s="Video",tracks:n=[],intro:i={start:0,end:0},outro:r={start:0,end:0}}=e,o=document.createElement("div");o.className="custom-video-player",o.id="customVideoPlayer";const a={play:'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',volumeHigh:'<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',fullscreen:'<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',settings:'<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',upload:'<svg viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>',cloud:'<svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>',skipBack:'<svg viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>',skipForward:'<svg viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>',previous:'<svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>',next:'<svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zm2-5.71L11.29 12H2v-2h9.29l-3-2.29zM22 6h-2V2h-2v4h-2V2h-2v4h-2V2h-2v4h-2V2H8v4H6V2H4v16h2v-4h2v4h2v-4h2v4h2v-4h2v4h2v-4h2v4h2V6z"/></svg>',check:'<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'};let u="";return n.length>0&&(u=n.map(p=>p.kind==="captions"||p.kind==="subtitles"?`<track label="${p.label}" kind="${p.kind}" src="${p.file}" ${p.default?"default":""}>`:"").join("")),o.innerHTML=`
    <video id="customVideo" preload="metadata" crossorigin="anonymous">
      <source src="${t}" type="application/vnd.apple.mpegurl">
      ${u}
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
              ${[.5,.75,1,1.25,1.5,2].map(p=>`<div class="submenu-item" data-speed="${p}"><span class="check-icon">${a.check}</span><span>${p}x</span></div>`).join("")}
            </div>
            <div class="submenu subtitle-track-menu">
              <div class="submenu-item active" data-track="off"><span class="check-icon">${a.check}</span><span>Off</span></div>
              <div class="submenu-item" data-track="uploaded"><span class="check-icon">${a.check}</span><span>Uploaded</span></div>
            </div>
            <div class="submenu subtitle-size-menu">
              ${["Small","Medium","Large","X-Large"].map(p=>`<div class="submenu-item" data-size="${p.toLowerCase()}"><span class="check-icon">${a.check}</span><span>${p}</span></div>`).join("")}
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
  `,o}function _e(e,t={}){var He,Be,Ie,ze,qe,Ue,Pe;const s=e.querySelector("#customVideo"),n=e.querySelector(".player-loading"),i=e.querySelector(".player-error"),r=e.querySelector(".player-controls"),o=e.querySelector(".progress-container"),a=e.querySelector(".progress-bar"),u=e.querySelector(".buffered-bar"),p=e.querySelector(".play-btn-main"),m=e.querySelector(".volume-btn"),f=e.querySelector(".volume-slider"),L=e.querySelectorAll(".skip-btn"),B=e.querySelector(".fullscreen-btn"),T=e.querySelector(".settings-btn"),g=e.querySelector(".settings-menu"),M=e.querySelector(".time-display"),b=M.querySelector(".current-time"),A=M.querySelector(".duration"),z=e.querySelector(".subtitle-container"),Xe=z.querySelector(".subtitle-text");let R=!1,Q=!1,ke=null,N=null;function Le(l){if(isNaN(l))return"0:00";const c=Math.floor(l/60),d=Math.floor(l%60);return`${c}:${d.toString().padStart(2,"0")}`}function Qe(){s.duration&&(a.style.width=`${s.currentTime/s.duration*100}%`,b.textContent=Le(s.currentTime))}function Je(){s.buffered.length>0&&(u.style.width=`${s.buffered.end(s.buffered.length-1)/s.duration*100}%`)}function J(){n.classList.remove("hidden")}function ae(){n.classList.add("hidden")}function K(){i.classList.remove("hidden"),r.classList.add("hidden")}function xe(){i.classList.add("hidden"),r.classList.remove("hidden")}function le(){s.paused?(s.play().catch(()=>{}),R=!0,p.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',e.classList.add("playing")):(s.pause(),R=!1,p.innerHTML='<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',e.classList.remove("playing"))}function ce(){Q?(s.muted=!1,Q=!1,m.innerHTML='<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',f.value=s.volume):(s.muted=!0,Q=!0,m.innerHTML='<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',f.value=0)}function Te(){var l,c,d,v;document.fullscreenElement?(d=document.exitFullscreen)!=null&&d.call(document)||((v=document.webkitExitFullscreen)==null||v.call(document)):(l=e.requestFullscreen)!=null&&l.call(e)||((c=e.webkitRequestFullscreen)==null||c.call(e))}function _(l){s.currentTime=Math.max(0,Math.min(s.currentTime+l,s.duration))}function Ee(){e.classList.add("show-controls"),clearTimeout(ke),R&&(ke=setTimeout(()=>{e.classList.remove("show-controls")},3e3))}function de(l){if(s.canPlayType("application/vnd.apple.mpegurl")){s.src=l;return}try{if(window.Hls)Me(l);else{const c=document.createElement("script");c.src="https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js",c.onload=()=>Me(l),c.onerror=K,document.head.appendChild(c)}}catch{K()}}function Me(l){window.Hls&&(N&&N.destroy(),N=new window.Hls({enableWorker:!0,lowLatencyMode:!0}),N.loadSource(l),N.attachMedia(s),N.on(window.Hls.Events.MANIFEST_PARSED,()=>{ae(),s.play().catch(()=>{})}),N.on(window.Hls.Events.ERROR,(c,d)=>{d.fatal&&K()}))}s.addEventListener("loadedmetadata",()=>{A.textContent=Le(s.duration),ae()}),s.addEventListener("play",()=>{R=!0,p.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',Ee()}),s.addEventListener("pause",()=>{R=!1,p.innerHTML='<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'}),s.addEventListener("timeupdate",()=>{Qe(),Je()}),s.addEventListener("waiting",J),s.addEventListener("canplay",ae),s.addEventListener("error",K),p.addEventListener("click",le),s.addEventListener("click",le),m.addEventListener("click",ce),f.addEventListener("input",l=>{s.volume=l.target.value,f.value=s.volume,s.volume>0&&Q&&ce()}),L.forEach(l=>l.addEventListener("click",()=>_(parseInt(l.dataset.seconds)))),o.addEventListener("click",l=>{const c=(l.clientX-o.getBoundingClientRect().left)/o.getBoundingClientRect().width;s.currentTime=c*s.duration}),B.addEventListener("click",Te),T.addEventListener("click",()=>{g.classList.toggle("visible")}),e.addEventListener("click",l=>{l.target.closest(".settings-wrapper")||g.classList.remove("visible")});const Z=e.querySelector(".playback-speed-menu");(He=e.querySelector('[data-setting="playbackSpeed"]'))==null||He.addEventListener("click",()=>{Z.classList.toggle("visible")}),Z.querySelectorAll(".submenu-item").forEach(l=>{l.addEventListener("click",()=>{s.playbackRate=parseFloat(l.dataset.speed),Z.classList.remove("visible"),Z.querySelectorAll(".submenu-item").forEach(c=>c.classList.remove("active")),l.classList.add("active")})});const ee=e.querySelector(".subtitle-size-menu");(Be=e.querySelector('[data-setting="subtitleSize"]'))==null||Be.addEventListener("click",()=>{ee.classList.toggle("visible")}),ee.querySelectorAll(".submenu-item").forEach(l=>{l.addEventListener("click",()=>{z.className=`subtitle-container subtitle-size-${l.dataset.size}`,ee.classList.remove("visible"),ee.querySelectorAll(".submenu-item").forEach(c=>c.classList.remove("active")),l.classList.add("active")})});const ue=e.querySelector(".subtitle-position-menu");(Ie=e.querySelector('[data-setting="subtitlePosition"]'))==null||Ie.addEventListener("click",()=>{ue.classList.toggle("visible")}),ue.querySelectorAll(".submenu-item[data-position]").forEach(l=>{l.addEventListener("click",()=>{z.classList.remove("subtitle-position-top","subtitle-position-middle","subtitle-position-bottom"),z.classList.add(`subtitle-position-${l.dataset.position}`),ue.querySelectorAll(".submenu-item").forEach(c=>c.classList.remove("active")),l.classList.add("active"),k(`Subtitle position: ${l.dataset.position}`,"info")})});let F=0;const Ke=e.querySelector(".offset-value");e.querySelectorAll(".offset-btn").forEach(l=>{l.addEventListener("click",()=>{const c=parseInt(l.dataset.offset);F=Math.max(-200,Math.min(200,F+c)),Ke.textContent=F>0?`+${F}`:F,z.style.bottom=`calc(100px + ${F}px)`,z.style.top="auto",z.style.transform="translateX(-50%)"})});const Ae=e.querySelector(".subtitle-track-menu");(ze=e.querySelector('[data-setting="subtitleTrack"]'))==null||ze.addEventListener("click",()=>{Ae.classList.toggle("visible")});const Ze=e.querySelector(".upload-subtitle-menu");(qe=e.querySelector('[data-setting="uploadSubtitle"]'))==null||qe.addEventListener("click",()=>{Ze.classList.toggle("visible"),Ae.classList.remove("visible"),cloudSubtitlesMenu.classList.remove("visible")});const w=e.querySelector(".upload-zone"),D=w==null?void 0:w.querySelector(".subtitle-input");w==null||w.addEventListener("click",()=>{D==null||D.click()}),D==null||D.addEventListener("change",async l=>{const c=l.target.files;if(c&&c.length>0)for(let d=0;d<c.length;d++){const v=c[d];if(v.name.endsWith(".srt")||v.name.endsWith(".vtt"))try{await Re(v),W()}catch(I){console.error("Subtitle upload error:",I)}}D.value=""}),w==null||w.addEventListener("dragover",l=>{l.preventDefault(),w.classList.add("dragover")}),w==null||w.addEventListener("dragleave",()=>{w.classList.remove("dragover")}),w==null||w.addEventListener("drop",async l=>{var d;l.preventDefault(),w.classList.remove("dragover");const c=(d=l.dataTransfer)==null?void 0:d.files;if(c&&c.length>0)for(let v=0;v<c.length;v++){const I=c[v];if(I.name.endsWith(".srt")||I.name.endsWith(".vtt"))try{await Re(I),W()}catch($){console.error("Subtitle upload error:",$)}}});function W(){const l=e.querySelector(".uploaded-subtitles-list");if(l){if(V.length===0){l.innerHTML='<p style="color: var(--text-light); font-size: 0.85em; padding: 10px;">No subtitles uploaded</p>';return}l.innerHTML=V.map((c,d)=>`
      <div class="loaded-subtitle-item ${d===V.length-1?"active":""}">
        <span class="name">${c.label.substring(0,25)}${c.label.length>25?"...":""}</span>
        <button class="remove-btn" onclick="removeSubtitle(${d})">✕</button>
      </div>
    `).join("")}}window.removeSubtitle=function(l){if(V[l]){const c=V[l];c.track&&c.track.parentNode&&c.track.parentNode.removeChild(c.track),c.url&&URL.revokeObjectURL(c.url),V.splice(l,1),W(),k("Subtitle removed","info")}};let y=null;function et(){const l=document.getElementById("cloudSubtitlesModal");if(l&&l.remove(),y=document.createElement("div"),y.id="cloudSubtitlesModal",y.className="cloud-subtitles-modal",y.innerHTML=`
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
      `,document.head.appendChild($)}y.querySelector(".close-cloud-modal").addEventListener("click",te),y.addEventListener("click",$=>{$.target===y&&te()}),document.addEventListener("keydown",Ce);const d=y.querySelector(".cloud-search-input-modal"),v=y.querySelector(".cloud-search-btn-modal");async function I(){const $=d.value.trim();if(!$){k("Please enter a search term","warning");return}const Ne=y.querySelector(".cloud-results-modal");Ne.innerHTML=`
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Searching for "${$}"...</p>
        </div>
      `,v.disabled=!0;try{const pe=await rt($);tt(pe,$)}catch(pe){console.error("Cloud search error:",pe),Ne.innerHTML=`
          <div class="no-results">
            <div class="no-results-icon">😕</div>
            <p>Search failed. Please try again.</p>
          </div>
        `}finally{v.disabled=!1}}v.addEventListener("click",I),d.addEventListener("keypress",$=>{$.key==="Enter"&&I()}),setTimeout(()=>d.focus(),100)}function tt(l,c){const d=y.querySelector(".cloud-results-modal");if(l.length===0){d.innerHTML=`
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <p>No subtitles found for "${c}"</p>
          <p style="font-size: 0.9em; margin-top: 10px; color: rgba(255,255,255,0.5);">Try a different search term or upload your own subtitle</p>
        </div>
      `;return}d.innerHTML=l.map((v,I)=>{var $;return`
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
    `}).join("")}window.handleSubtitleClick=async function(l,c,d){d.parentElement.querySelectorAll(".subtitle-result").forEach(v=>v.style.background=""),d.style.background="rgba(233, 69, 96, 0.25)",d.style.borderColor="var(--accent)",await handleSubtitleDownload(l,c,d.querySelector(".download-btn"))},window.handleSubtitleDownload=async function(l,c,d){d.disabled=!0,d.textContent="⏳",await lt(l,c)?(d.textContent="✓",d.style.background="var(--success, #00d26a)",k(`Loaded: ${c}`,"success"),W(),setTimeout(()=>{te()},1e3)):(d.disabled=!1,d.textContent="⬇")};function st(){y||et(),y.classList.add("visible");const l=y==null?void 0:y.querySelector(".cloud-search-input-modal");l&&window.currentAnimeTitle&&(l.value=window.currentAnimeTitle)}function te(){y&&(y.classList.remove("visible"),document.removeEventListener("keydown",Ce))}function Ce(l){l.key==="Escape"&&te()}return(Ue=e.querySelector('[data-setting="cloudSubtitles"]'))==null||Ue.addEventListener("click",()=>{st(),g==null||g.classList.remove("visible")}),W(),document.addEventListener("keydown",l=>{if(e.isConnected&&l.target.tagName!=="INPUT")switch(l.key){case" ":case"k":l.preventDefault(),le();break;case"m":ce();break;case"f":Te();break;case"ArrowLeft":l.preventDefault(),_(-5);break;case"ArrowRight":l.preventDefault(),_(5);break;case"j":_(-10);break;case"l":_(10);break}}),e.addEventListener("mousemove",Ee),e.addEventListener("mouseleave",()=>{R&&e.classList.remove("show-controls")}),s.addEventListener("timeupdate",()=>{var c;const l=s.textTracks;for(let d=0;d<l.length;d++)if(l[d].mode==="showing"){const v=(c=l[d].activeCues)==null?void 0:c[0];Xe.textContent=v?v.text:"",z.classList.toggle("visible",!!v);break}}),(Pe=i.querySelector(".retry-btn"))==null||Pe.addEventListener("click",()=>{xe(),J(),de(e.dataset.videoUrl)}),e.dataset.videoUrl=t.videoUrl||"",t.videoUrl&&(J(),de(t.videoUrl)),{element:e,video:s,loadVideo:l=>{e.dataset.videoUrl=l,xe(),J(),de(l)},setEpisodeCallbacks:(l,c)=>{const d=e.querySelector(".prev-episode"),v=e.querySelector(".next-episode");d.disabled=!l,v.disabled=!c,d.onclick=l||(()=>{}),v.onclick=c||(()=>{})}}}let S=null,j=0,se=null;async function ct(){const e=O.value,t=H(e,"home");console.log("Fetching home page data from:",t);try{const s=await x(t);return dt(s)}catch(s){throw console.error("Error fetching home page data:",s),s}}function dt(e){return e?(e.data&&(e=e.data),{status:e.status||!0,spotlight:ut(e.spotlight||[]),trending:C(e.trending||[]),topAiring:C(e.topAiring||[]),mostPopular:C(e.mostPopular||[]),mostFavorite:C(e.mostFavorite||[]),latestCompleted:C(e.latestCompleted||[]),latestEpisode:C(e.latestEpisode||[]),newAdded:C(e.newAdded||[]),topUpcoming:C(e.topUpcoming||[]),topTen:pt(e.topTen||{today:[],week:[],month:[]}),genres:e.genres||[]}):null}function ut(e){return e.map(t=>{var s,n,i;return{title:t.title||"Unknown Title",alternativeTitle:t.alternativeTitle||"",id:t.id||"",poster:t.poster||"https://via.placeholder.com/400x600",episodes:{sub:((s=t.episodes)==null?void 0:s.sub)||0,dub:((n=t.episodes)==null?void 0:n.dub)||0,eps:((i=t.episodes)==null?void 0:i.eps)||0},rank:t.rank||0,type:t.type||"TV",quality:t.quality||"HD",duration:t.duration||"Unknown",aired:t.aired||"Unknown",synopsis:t.synopsis||"No synopsis available."}})}function C(e){return e.map(t=>{var s,n,i;return{title:t.title||"Unknown Title",alternativeTitle:t.alternativeTitle||"",id:t.id||"",poster:t.poster||"https://via.placeholder.com/200x300",episodes:{sub:((s=t.episodes)==null?void 0:s.sub)||0,dub:((n=t.episodes)==null?void 0:n.dub)||0,eps:((i=t.episodes)==null?void 0:i.eps)||0},type:t.type||"TV"}})}function pt(e){return{today:C(e.today||[]).slice(0,10),week:C(e.week||[]).slice(0,10),month:C(e.month||[]).slice(0,10)}}function Se(){const e=document.getElementById("homePage"),t=document.querySelector(".search-container"),s=document.getElementById("results"),n=document.getElementById("details"),i=document.getElementById("episodes"),r=document.getElementById("servers"),o=document.getElementById("homeBtn"),a=document.getElementById("searchNavBtn");o.classList.add("active"),a.classList.remove("active"),e.classList.add("visible"),e.classList.remove("hidden"),t.classList.remove("visible"),s.innerHTML="",n.innerHTML="",i.innerHTML="",r.innerHTML="",S||We()}function re(){const e=document.getElementById("homePage"),t=document.querySelector(".search-container"),s=document.getElementById("homeBtn"),n=document.getElementById("searchNavBtn");s.classList.remove("active"),n.classList.add("active"),e.classList.remove("visible"),e.classList.add("hidden"),t.classList.add("visible"),wt()}async function We(){const e=document.getElementById("homeContent");e.innerHTML=vt();try{if(S=await ct(),!S||!S.status)throw new Error("Failed to load home page data");e.innerHTML=mt(S),yt(),k("Home page loaded successfully","success")}catch(t){console.error("Error loading home page:",t),e.innerHTML=ht(t.message)}}function vt(){return`
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
  `}function ht(e){return`
    <div class="home-error">
      <div class="error-icon">😕</div>
      <h2>Oops! Something went wrong</h2>
      <p>${e||"Unable to load home page data. Please try again."}</p>
      <button class="retry-btn" onclick="loadHomePage()">🔄 Retry</button>
    </div>
  `}function mt(e){var s,n,i;let t="";return e.spotlight&&e.spotlight.length>0&&(t+=gt(e.spotlight)),e.genres&&e.genres.length>0&&(t+=ft(e.genres)),e.topTen&&(((s=e.topTen.today)==null?void 0:s.length)>0||((n=e.topTen.week)==null?void 0:n.length)>0||((i=e.topTen.month)==null?void 0:i.length)>0)&&(t+=bt(e.topTen)),e.trending&&e.trending.length>0&&(t+=q("📈 Trending Now","trending",e.trending)),e.topAiring&&e.topAiring.length>0&&(t+=q("▶️ Top Airing","topAiring",e.topAiring)),e.mostPopular&&e.mostPopular.length>0&&(t+=q("⭐ Most Popular","mostPopular",e.mostPopular)),e.mostFavorite&&e.mostFavorite.length>0&&(t+=q("❤️ Most Favorite","mostFavorite",e.mostFavorite)),e.latestCompleted&&e.latestCompleted.length>0&&(t+=q("✅ Latest Completed","latestCompleted",e.latestCompleted)),e.latestEpisode&&e.latestEpisode.length>0&&(t+=q("🎬 Latest Episodes","latestEpisode",e.latestEpisode)),e.newAdded&&e.newAdded.length>0&&(t+=q("🆕 Newly Added","newAdded",e.newAdded)),e.topUpcoming&&e.topUpcoming.length>0&&(t+=q("🚀 Top Upcoming","topUpcoming",e.topUpcoming)),t}function gt(e){const t=e.map((n,i)=>{var r,o,a;return`
    <div class="spotlight-slide ${i===0?"active":""}" data-index="${i}">
      <img src="${n.poster}" alt="${n.title}" loading="lazy">
      <div class="spotlight-overlay">
        <div class="spotlight-rank">#${n.rank||i+1}</div>
        <h2 class="spotlight-title">${n.title}</h2>
        <div class="spotlight-meta">
          <span>${n.type||"TV"}</span>
          ${n.quality?`<span class="quality">${n.quality}</span>`:""}
          <span>${n.duration||"Unknown duration"}</span>
          ${((r=n.episodes)==null?void 0:r.sub)>0?`<span>📺 ${n.episodes.sub} eps</span>`:""}
        </div>
        <p class="spotlight-synopsis">${(o=n.synopsis)==null?void 0:o.substring(0,200)}${((a=n.synopsis)==null?void 0:a.length)>200?"...":""}</p>
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
  `}).join(""),s=e.map((n,i)=>`
    <button class="spotlight-dot ${i===0?"active":""}" data-index="${i}"></button>
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
  `}function ft(e){return`
    <div class="home-section">
      <div class="section-header">
        <h2>🏷️ Browse by Genre</h2>
      </div>
      <div class="genres-container">${e.map(s=>`
    <button class="genre-tag-btn" onclick="searchByGenre('${s.replace(/'/g,"\\'")}')">${s}</button>
  `).join("")}</div>
    </div>
  `}function bt(e){const t=(s,n)=>!s||s.length===0?'<p style="color: var(--text-light); text-align: center;">No data available</p>':s.slice(0,5).map((i,r)=>{var o;return`
      <div class="top10-item" onclick="selectAnime('${i.id}', '${i.title.replace(/'/g,"\\'")}')">
        <div class="top10-rank">${r+1}</div>
        <img src="${i.poster}" alt="${i.title}" loading="lazy">
        <div class="top10-item-info">
          <div class="title">${i.title}</div>
          <div class="episodes">${((o=i.episodes)==null?void 0:o.sub)>0?`${i.episodes.sub} eps`:i.type||"TV"}</div>
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
  `}function q(e,t,s){const n=s.slice(0,12).map(i=>{var r;return`
    <div class="home-anime-card" onclick="selectAnime('${i.id}', '${i.title.replace(/'/g,"\\'")}')">
      <img src="${i.poster}" alt="${i.title}" loading="lazy">
      <div class="home-anime-card-content">
        <h3>${i.title}</h3>
        <p>${((r=i.episodes)==null?void 0:r.sub)>0?`${i.episodes.sub} eps`:i.type||"TV"}</p>
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
  `}function yt(){var e;(e=S==null?void 0:S.spotlight)!=null&&e.length&&(j=0,se=setInterval(()=>{Ye()},5e3))}function wt(){se&&(clearInterval(se),se=null)}function Ye(){var e;(e=S==null?void 0:S.spotlight)!=null&&e.length&&(j=(j+1)%S.spotlight.length,Ge())}function St(){var e;(e=S==null?void 0:S.spotlight)!=null&&e.length&&(j=(j-1+S.spotlight.length)%S.spotlight.length,Ge())}function Ge(){const e=document.querySelectorAll(".spotlight-slide"),t=document.querySelectorAll(".spotlight-dot");e.forEach((s,n)=>{s.classList.toggle("active",n===j)}),t.forEach((s,n)=>{s.classList.toggle("active",n===j)})}function $t(e){console.log("View all category:",e),k(`Showing all ${e} - Filter by provider if needed`,"info"),re(),Y.focus()}function kt(e){re(),Y.value=e,Y.focus(),$e()}window.loadHomePage=We;window.showHomePage=Se;window.showSearchPage=re;window.nextSpotlight=Ye;window.prevSpotlight=St;window.viewAllCategory=$t;window.searchByGenre=kt;function k(e,t="info"){const s=document.querySelector(".toast-container");s&&s.remove();const n=document.createElement("div");n.className="toast-container";const i=document.createElement("div");i.className=`toast ${t}`;const r=t==="success"?"✓":t==="error"?"✕":"ℹ";i.innerHTML=`<span style="font-size:1.2em;">${r}</span> ${e}`,n.appendChild(i),document.body.appendChild(n),setTimeout(()=>{i.style.opacity="0",i.style.transform="translateX(100px)",i.style.transition="all 0.3s ease",setTimeout(()=>n.remove(),300)},3e3)}function Lt(){let t="";for(let s=0;s<12;s++)t+=`
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
    `;G.innerHTML=t}async function $e(){const e=Y.value.trim();if(!e){k("Please enter a search query","warning");return}try{Lt();const t=O.value,s=H(t,"search",{query:e});console.log("Search URL:",s);const n=await x(s);let i=[];if(n&&n.data&&n.data.response&&Array.isArray(n.data.response)?i=n.data.response:Array.isArray(n)?i=n:n&&n.results&&Array.isArray(n.results)?i=n.results:n&&n.anime&&Array.isArray(n.anime)?i=n.anime:n&&n.data&&Array.isArray(n.data)&&(i=n.data),i.length===0){G.innerHTML='<p style="text-align:center;padding:40px;color:var(--text-light);">No results found. Try a different search term.</p>';return}xt(i),k(`Found ${i.length} results`,"success")}catch(t){console.error("Search error:",t),G.innerHTML=`<p class="error" style="text-align:center;padding:40px;color:var(--accent);">Search failed: ${t.message}. Check your connection and try again.</p>`}}function xt(e){me={},G.innerHTML=e.map(t=>{const s=t.title||t.name||t.englishName||"Unknown Title",n=t.id||t.animeId||t.mal_id||"",i=t.image||t.poster||t.coverImage||"https://via.placeholder.com/150x200",r=t.releaseDate||t.year||t.startDate||"N/A";let o="";if(t.episodes)if(typeof t.episodes=="object"){const m=t.episodes.sub||0,f=t.episodes.dub||0,L=t.episodes.eps||0;m>0||f>0?o=`<p>${m>0?`Sub: ${m}`:""}${m>0&&f>0?" | ":""}${f>0?`Dub: ${f}`:""}</p>`:L>0&&(o=`<p>Episodes: ${L}</p>`)}else o=`<p>Episodes: ${t.episodes}</p>`;const a=t.type?`<p>${t.type}</p>`:"",u=t.duration?`<p>${t.duration}</p>`:"";return O.value==="hianime-scrap"?(me[n]=t,`
        <div class="anime-card" onclick="selectAnime('${n.replace(/'/g,"\\'")}')">
          <img src="${i}" alt="${s}" loading="lazy">
          <h3>${s}</h3>
          ${o}
          ${a}
          ${u}
          <p>${r}</p>
        </div>
      `):`
      <div class="anime-card" onclick="selectAnime('${n.replace(/'/g,"\\'")}', '${s.replace(/'/g,"\\'")}')">
        <img src="${i}" alt="${s}" loading="lazy">
        <h3>${s}</h3>
        ${o}
        ${a}
        ${u}
        <p>${r}</p>
      </div>
    `}).join("")}async function Tt(e,t){var r,o,a,u,p,m;if(!e){alert("Invalid anime ID");return}const s=O.value,n=s==="hianime-scrap",i=n?me[e]:null;try{if(X.innerHTML="<p>Loading details...</p>",n&&i){const g={...i,id:i.id||e,__provider:s};try{const b=H(s,"episodes",{id:e});console.log("Episodes URL:",b);const A=await x(b);if(g.episodes=Fe(A,s),g.episodes.length>0){ve(g,i.title);return}}catch(b){console.warn("Could not fetch episodes for hianime-scrap:",b)}const M=((r=g.episodes)==null?void 0:r.eps)||((o=g.episodes)==null?void 0:o.sub)||((a=g.episodes)==null?void 0:a.dub)||((u=g.episodes)==null?void 0:u.total)||((p=g.episodes)==null?void 0:p.episodeCount)||((m=g.episodes)==null?void 0:m.totalEpisodes)||0;M>0?(g.episodes=Array.from({length:Math.min(M,500)},(b,A)=>({id:`${e}::ep=${A+1}`,number:A+1,title:`Episode ${A+1}`,isFiller:!1})),console.log(`Generated ${M} episode buttons from count`)):g.episodes=[],ve(g,i.title);return}const f=typeof t=="string"?t:null,L=H(s,"info",{id:e});console.log("Info URL:",L);const B=await x(L);let T=Et(B,e,s);if(!T.episodes||T.episodes.length===0)try{const g=H(s,"episodes",{id:e});console.log("Episodes URL:",g);const M=await x(g);T.episodes=Fe(M,s)}catch(g){console.warn("Could not fetch episodes separately:",g),T.episodes=[]}T.__provider=s,ve(T,f||T.title)}catch(f){console.error("Details error:",f),X.innerHTML=`<p class="error">Error loading anime details: ${f.message}</p>`}}function Et(e,t,s){var n,i,r;if(e&&e.data&&s==="hianime-scrap")return{...e.data,id:e.data.id||t,title:e.data.title,poster:e.data.poster,image:e.data.poster,type:e.data.type,status:e.data.status,genres:e.data.genres||[],description:e.data.description||e.data.synopsis||"",totalEpisodes:((n=e.data.episodes)==null?void 0:n.eps)||((i=e.data.episodes)==null?void 0:i.sub)||((r=e.data.episodes)==null?void 0:r.dub)||"Unknown"};if(Array.isArray(e)){const o=e.find(a=>a&&a.id===t)||e[0];return o?{...o,id:o.id||t}:{id:t,episodes:[]}}if(e&&e.results&&Array.isArray(e.results)){const o=e.results.find(a=>a&&a.id===t)||e.results[0];return o?{...o,id:o.id||t}:{...e,id:e.id||t}}return e&&e.data?{...e.data,id:e.data.id||t}:e&&(e.title||e.name||e.englishName)?{...e,id:e.id||t}:{id:t,...e||{}}}function Fe(e,t){return e?t==="hianime-scrap"&&e&&e.data&&Array.isArray(e.data)?e.data.map((s,n)=>({id:s.id||`${n+1}`,number:s.episodeNumber||n+1,title:s.title||s.alternativeTitle||`Episode ${s.episodeNumber||n+1}`,isFiller:s.isFiller||!1})):Array.isArray(e)?e.map((s,n)=>({id:s.id||s.episodeId||`${n+1}`,number:s.number||s.episode||s.ep||n+1,title:s.title||s.name||`Episode ${n+1}`})):e.episodes&&Array.isArray(e.episodes)?e.episodes.map((s,n)=>({id:s.id||s.episodeId||`${n+1}`,number:s.number||s.episode||s.ep||n+1,title:s.title||s.name||`Episode ${n+1}`})):e.data&&Array.isArray(e.data)?e.data.map((s,n)=>({id:s.id||s.episodeId||`${n+1}`,number:s.number||s.episode||s.ep||n+1,title:s.title||s.name||`Episode ${n+1}`})):[]:[]}async function we(e,t){if(!e){alert("Invalid episode ID");return}const s=O.value;try{if(h.innerHTML=`
      <h3>Servers for Episode ${t||"?"}</h3>
      <p class="loading-servers" style="padding: 20px; text-align: center; color: var(--accent);">
        <span class="loading-spinner"></span> Loading servers...
      </p>
    `,s==="hianime-scrap"){let r=e,o=t;const a=e.match(/::ep=(\d+)$/);a&&(o=a[1],console.log(`Episode ${o} selected (ID: ${e})`));const u=H(s,"servers",{id:e});console.log("Servers URL:",u);const p=await x(u);At(p,o||t||"1",e),h.scrollIntoView({behavior:"smooth"});return}if(s==="animepahe"){const r=H(s,"watch",{episodeId:e});console.log("Watch URL:",r);const o=await x(r);he(o,t||"1"),h.scrollIntoView({behavior:"smooth"});return}if(s==="animekai"){const r=H(s,"watch",{episodeId:e});console.log("Watch URL:",r);const o=await x(r);he(o,t||"1"),h.scrollIntoView({behavior:"smooth"});return}const n=H(s,"servers",{id:e});console.log("Servers URL:",n);const i=await x(n);he(i,t||"1"),h.scrollIntoView({behavior:"smooth"})}catch(n){console.error("Servers error:",n),h.innerHTML=`<p class="error">Error loading servers: ${n.message}. Try a different episode.</p>`}}window.selectAnime=Tt;window.selectEpisode=we;function ve(e,t){var f;console.log("Displaying anime details:",e),ie=e.id||null;const s=e.title||t||"Unknown Title";window.currentAnimeTitle=t||s;const n=e.image||e.poster||e.coverImage||"https://via.placeholder.com/200x300",i=e.japaneseTitle||e.jname||"",r=e.type||e.format||"Unknown",o=e.status||"",a=e.genres||(e.genre?[e.genre]:[]),u=e.totalEpisodes||e.episodeCount||((f=e.episodes)==null?void 0:f.length)||"Unknown",p=e.description||e.synopsis||"No description available",m=e.url||e.animeUrl||"";X.innerHTML=`
    <div class="anime-details">
      <div class="anime-header">
        <img src="${n}" alt="${s}" onerror="this.src='https://via.placeholder.com/200x300'">
        <div class="anime-info">
          <h2>${s}</h2>
          ${i?`<p><strong>Japanese:</strong> ${i}</p>`:""}
          <p><strong>Type:</strong> ${r}</p>
          ${o?`<p><strong>Status:</strong> ${o}</p>`:""}
          ${a.length>0?`<p><strong>Genres:</strong> ${a.join(", ")}</p>`:""}
          <p><strong>Episodes:</strong> ${u}</p>
          <p><strong>Description:</strong> ${p}</p>
          ${m?`<p><a href="${m}" target="_blank" rel="noopener noreferrer" class="watch-link">View on Provider →</a></p>`:""}
        </div>
      </div>
    </div>
  `,X.scrollIntoView({behavior:"smooth"}),e.episodes&&e.episodes.length>0?(U=e.episodes,Mt(e.episodes)):(ne.innerHTML="<p>No episodes available</p>",U=[]),h.innerHTML=""}function Mt(e){ne.innerHTML="<h3>Episodes</h3>";const t=e.map((s,n)=>{const i=s.number||s.episode||s.ep||n+1,r=s.title||s.name||"",o=s.id||`${n+1}`,a=s.isFiller,u=a?'<span style="color:#ffcc00;font-size:0.7em;"> ★Filler</span>':"";return`
      <button 
        class="episode-btn ${a?"filler":""}" 
        onclick="selectEpisode('${String(o).replace(/'/g,"\\'")}', '${i}')"
        title="${r}${a?" (Filler)":""}"
      >
        ${i}${u}
        ${r?`<br><small style="font-size:0.7em">${r.substring(0,20)}${r.length>20?"...":""}</small>`:""}
      </button>
    `}).join("");ne.innerHTML+=`<div class="episodes-grid">${t}</div>`}function At(e,t,s){if(h.innerHTML=`<h3>Servers for Episode ${t}</h3>`,!e||!e.success||!e.data){h.innerHTML+="<p>No servers available for this episode. Try a different episode.</p>";return}const n=e.data,i=n.sub||[],r=n.dub||[],o=n.raw||[];if(i.length===0&&r.length===0&&o.length===0){h.innerHTML+="<p>No servers available for this episode. Try a different episode.</p>";return}window.hianimeScrapServerData={episodeId:s,sub:i,dub:r,raw:o};let a='<div class="servers-tabs">';a+=`<div class="server-tab ${i.length>0?"active":""}" onclick="showHianimeScrapServers('sub')">Sub (${i.length})</div>`,a+=`<div class="server-tab ${i.length===0&&r.length>0?"active":""}" onclick="showHianimeScrapServers('dub')">Dub (${r.length})</div>`,a+=`<div class="server-tab ${i.length===0&&r.length===0&&o.length>0?"active":""}" onclick="showHianimeScrapServers('raw')">Raw (${o.length})</div>`,a+="</div>",a+='<div id="hianimeScrapServersList" class="servers-list"></div>',h.innerHTML+=a,i.length>0?showHianimeScrapServers("sub"):r.length>0?showHianimeScrapServers("dub"):showHianimeScrapServers("raw")}window.showHianimeScrapServers=function(e){const t=document.getElementById("hianimeScrapServersList");if(!t||!window.hianimeScrapServerData)return;document.querySelectorAll(".server-tab").forEach(n=>{n.classList.remove("active"),n.textContent.toLowerCase().includes(e)&&n.classList.add("active")});const s=window.hianimeScrapServerData[e]||[];if(s.length===0){t.innerHTML=`<p>No ${e} servers available.</p>`;return}t.innerHTML=s.map(n=>{const i=n.name||`Server ${n.index||""}`,r=n.id,o=e;return`
      <div class="server-option">
        <strong>${i}</strong>
        <p>Type: ${o.charAt(0).toUpperCase()+o.slice(1)}</p>
        <p><button class="play-btn" onclick="playHianimeScrapStream('${r}', '${o}', '${i.replace(/'/g,"\\'")}')">▶ Play</button></p>
      </div>
    `}).join("")};window.playHianimeScrapStream=async function(e,t,s){if(!window.hianimeScrapServerData)return alert("No server data available");const n=window.hianimeScrapServerData.episodeId,i=H("hianime-scrap","stream",{id:n,type:t,server:s});console.log("Stream URL:",i);try{let r=h.querySelector(".stream-loading");r||(r=document.createElement("p"),r.className="stream-loading",r.innerHTML='<span class="loading-spinner"></span> Loading stream...',r.style.cssText="padding: 20px; text-align: center; color: var(--accent);",h.prepend(r));const o=await x(i);if(r&&r.parentNode&&r.parentNode.removeChild(r),o&&o.success&&o.data)Ct(o.data,s);else{let a=h.querySelector(".stream-error");a||(a=document.createElement("p"),a.className="stream-error error",a.textContent="Failed to load stream. Try a different server.",h.prepend(a))}}catch(r){console.error("Stream error:",r);const o=h.querySelector(".stream-loading");o&&o.parentNode&&o.parentNode.removeChild(o);let a=h.querySelector(".stream-error");a||(a=document.createElement("p"),a.className="stream-error error",a.textContent=`Error loading stream: ${r.message}`,h.prepend(a))}};function Ct(e,t){var L,B,T,g,M;const s=((L=e.link)==null?void 0:L.file)||((B=e.link)==null?void 0:B.directUrl)||"",n=e.tracks||[],i=e.intro||{start:0,end:0},r=e.outro||{start:0,end:0};if(!s){if(!h.querySelector(".stream-error")){const A=document.createElement("p");A.className="stream-error error",A.textContent="No video URL available",h.prepend(A)}return}const o=document.getElementById("customVideoPlayer");o&&o.remove();let a=document.getElementById("videoPlayer");a||(a=document.createElement("div"),a.id="videoPlayer",a.className="video-player-section",a.style.marginBottom="20px"),h.prepend(a);let u="";(i.start!==0||i.end!==0)&&(u+=`<p style="color:#ffcc00;">Skip intro: ${i.start}s - ${i.end}s</p>`),(r.start!==0||r.end!==0)&&(u+=`<p style="color:#ffcc00;">Skip outro: ${r.start}s - ${r.end}s</p>`),window.currentAnimeTitle=t||window.currentAnimeTitle,a.innerHTML=`
    <h3>Now Playing: ${t}</h3>
    ${u}
  `;const p=Oe({videoUrl:s,title:t,tracks:n,intro:i,outro:r});a.appendChild(p),P=_e(p,{videoUrl:s});const m=((T=window.hianimeScrapServerData)==null?void 0:T.currentEpisodeIndex)??-1,f=((g=window.hianimeScrapServerData)==null?void 0:g.totalEpisodes)??0;P&&((M=window.hianimeScrapServerData)!=null&&M.episodes)&&P.setEpisodeCallbacks(m>0?()=>{const b=window.hianimeScrapServerData.episodes[m-1];b&&(b.id||`${window.hianimeScrapServerData.animeId}${b.number}`,window.hianimeScrapServerData.currentEpisodeIndex=m-1,playHianimeScrapStream(b.id,window.hianimeScrapServerData.currentServerType||"sub",b.name||`Episode ${b.number}`))}:null,m<f-1?()=>{const b=window.hianimeScrapServerData.episodes[m+1];b&&(b.id||`${window.hianimeScrapServerData.animeId}${b.number}`,window.hianimeScrapServerData.currentEpisodeIndex=m+1,playHianimeScrapStream(b.id,window.hianimeScrapServerData.currentServerType||"sub",b.name||`Episode ${b.number}`))}:null)}function he(e,t){h.innerHTML=`<h3>Servers for Episode ${t}</h3>`;let s=[];if(Array.isArray(e)?s=e:e&&e.servers&&Array.isArray(e.servers)?s=e.servers:e&&e.sources&&Array.isArray(e.sources)?s=e.sources:e&&e.data&&Array.isArray(e.data)?s=e.data:e&&e.streamingServers&&Array.isArray(e.streamingServers)&&(s=e.streamingServers),s.length===0){h.innerHTML+="<p>No servers available for this episode. Try a different episode.</p>";return}let n='<div class="servers-list">';s.forEach((i,r)=>{const o=i.name||i.serverName||i.quality||`Server ${r+1}`,a=i.url||i.file||i.src||i.streamUrl||"";if(n+=`
      <div class="server-option">
        <strong>${o}</strong>
    `,a){const u=`${De}/fetch?url=${encodeURIComponent(a)}`;n+=`
        <p><a href="${a}" target="_blank" rel="noopener noreferrer">Open Original</a></p>
        <p><a href="${u}" target="_blank" rel="noopener noreferrer">Open via Proxy</a></p>
        <p><button class="play-btn" onclick="playStream('${u.replace(/'/g,"\\'")}', '${o.replace(/'/g,"\\'")}')">▶ Play</button></p>
      `,i.sources&&Array.isArray(i.sources)&&i.sources.forEach((p,m)=>{const f=p.url||p.file||p.src||"";if(f){const L=`${De}/fetch?url=${encodeURIComponent(f)}`,B=p.quality||`Source ${m+1}`;n+=`
              <hr style="margin: 10px 0; border-color: rgba(233,69,96,0.3);">
              <p><strong>${B}</strong></p>
              <p><a href="${f}" target="_blank" rel="noopener noreferrer">Open Original</a></p>
              <p><a href="${L}" target="_blank" rel="noopener noreferrer">Open via Proxy</a></p>
              <p><button class="play-btn" onclick="playStream('${L.replace(/'/g,"\\'")}', '${B.replace(/'/g,"\\'")}')">▶ Play</button></p>
            `}})}else n+="<p>No direct URL available</p>";(i.intro||i.outro)&&(n+='<p class="meta">',i.intro&&(n+=`Intro: ${i.intro.start}-${i.intro.end}s `),i.outro&&(n+=`Outro: ${i.outro.start}-${i.outro.end}s`),n+="</p>"),n+="</div>"}),n+="</div>",h.innerHTML+=n}window.playStream=async function(e,t){if(!e)return alert("No stream URL available");console.log("Playing stream:",e);const s=document.getElementById("customVideoPlayer");s&&s.remove();let n=document.getElementById("videoPlayer");n||(n=document.createElement("div"),n.id="videoPlayer",n.className="video-player-section",n.style.marginBottom="20px"),h.prepend(n),window.currentAnimeTitle=t||window.currentAnimeTitle,n.innerHTML=`<h3>Now Playing: ${t}</h3>`;const i=Oe({videoUrl:e,title:t,tracks:[],intro:{},outro:{}});n.appendChild(i),P=_e(i,{videoUrl:e});const r=U.findIndex(o=>{var p,m;const a=o.number||o.episode||o.ep||0,u=parseInt(((m=(p=document.querySelector(".episode-btn.active"))==null?void 0:p.textContent)==null?void 0:m.trim())||"0");return a===u});P&&U.length>0&&P.setEpisodeCallbacks(r>0?()=>{const o=U[r-1];if(o){const a=o.id||`${ie}-episode-${o.number||r}`,u=o.number||o.episode||o.ep||r;we(a,String(u))}}:null,r<U.length-1?()=>{const o=U[r+1];if(o){const a=o.id||`${ie}-episode-${o.number||r+2}`,u=o.number||o.episode||o.ep||r+2;we(a,String(u))}}:null)};ot.addEventListener("click",$e);Y.addEventListener("keypress",e=>{e.key==="Enter"&&$e()});O.addEventListener("change",()=>{G.innerHTML="",X.innerHTML="",ne.innerHTML="",h.innerHTML="",ie=null,U=[],S=null});document.getElementById("homeBtn").addEventListener("click",Se);document.getElementById("searchNavBtn").addEventListener("click",re);document.addEventListener("DOMContentLoaded",()=>{Se()});
