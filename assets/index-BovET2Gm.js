(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function t(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(o){if(o.ep)return;o.ep=!0;const i=t(o);fetch(o.href,i)}})();let W=null,J=null;function mt(e,s,t,n){Ve();const o=r=>{if(isNaN(r))return"0:00";const a=Math.floor(r/60),d=Math.floor(r%60);return`${a}:${d.toString().padStart(2,"0")}`},i=()=>{if(!e||!s)return;const r=e.duration;if(!r||!isFinite(r)){W=requestAnimationFrame(i);return}const a=e.currentTime,d=a/r*100;s.style.setProperty("--progress",`${d}%`),s.style.width=`${d}%`,t&&(t.textContent=o(a)),n&&(n.textContent=o(r)),W=requestAnimationFrame(i)};W=requestAnimationFrame(i)}function Ve(){W&&(cancelAnimationFrame(W),W=null)}function vt(e,s){De();const t=()=>{if(!(!e||!s)){if(e.buffered&&e.buffered.length>0){const n=e.buffered.end(e.buffered.length-1),o=e.duration;if(o&&isFinite(o)){const i=n/o*100;s.style.setProperty("--buffered",`${i}%`),s.style.width=`${i}%`}}J=requestAnimationFrame(t)}};J=requestAnimationFrame(t)}function De(){J&&(cancelAnimationFrame(J),J=null)}let le=null;function ht(e,s,t,n){if(!e)return;const o=e.currentTime,i=300,r=performance.now();t&&t.classList.add("seeking");function a(d){const c=d-r,p=Math.min(c/i,1),h=ye(p),w=o+(s-o)*h;e.currentTime=Math.max(0,Math.min(w,n||e.duration)),p<1?le=requestAnimationFrame(a):(t&&t.classList.remove("seeking"),e.currentTime=s)}le&&cancelAnimationFrame(le),le=requestAnimationFrame(a)}function ye(e){return 1-Math.pow(1-e,3)}let ce=null;function ft(e){if(!e)return;ce&&(clearTimeout(ce),ce=null),e.classList.add("show-controls"),e.classList.remove("hide-cursor");const s=e.classList.contains("playing")?4e3:5e3;ce=setTimeout(()=>{e.classList.contains("playing")&&(e.classList.remove("show-controls"),e.classList.add("hide-cursor"))},s)}function gt(e){e&&(e.classList.remove("show-controls"),e.classList.add("hide-cursor"))}let de=null;function O(e,s,t,n,o=150){if(!e)return;const i=e.volume,r=performance.now();de&&cancelAnimationFrame(de);function a(d){const c=d-r,p=Math.min(c/o,1),h=ye(p),w=i+(s-i)*h;e.volume=Math.max(0,Math.min(w,1)),t&&(t.value=e.volume),e.volume>0&&e.muted&&(e.muted=!1,n&&Bt(n)),p<1&&(de=requestAnimationFrame(a))}de=requestAnimationFrame(a)}function Bt(e,s){if(!e)return;const t={volumeHigh:'<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>'};e.innerHTML=t.volumeHigh}function zt(e,s){!e||!s||(e.classList.add("visible"),s.style.opacity="0",s.style.transform="translateY(10px)",s.offsetWidth,s.style.transition="opacity 0.15s ease-out, transform 0.15s ease-out",s.style.opacity="1",s.style.transform="translateY(0)")}function Ut(e,s){!e||!s||(s.style.transition="opacity 0.1s ease-in, transform 0.1s ease-in",s.style.opacity="0",s.style.transform="translateY(5px)",setTimeout(()=>{e.classList.remove("visible")},100))}function me(e,s,t){e&&(e.paused?(e.play().catch(()=>{}),s.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',t.classList.add("playing"),s.style.transform="scale(1.1)",setTimeout(()=>{s.style.transform=""},150)):(e.pause(),s.innerHTML='<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',t.classList.remove("playing"),s.style.transform="scale(0.95)",setTimeout(()=>{s.style.transform=""},100)))}function bt(e){var s,t,n,o,i,r;e&&(!document.fullscreenElement&&!document.webkitFullscreenElement&&!document.mozFullScreenElement?(e.style.transition="transform 0.3s ease-out",(s=e.requestFullscreen)!=null&&s.call(e)||(t=e.webkitRequestFullscreen)!=null&&t.call(e)||((n=e.mozRequestFullScreen)==null||n.call(e)),e.classList.add("is-fullscreen")):((o=document.exitFullscreen)!=null&&o.call(document)||(i=document.webkitExitFullscreen)!=null&&i.call(document)||((r=document.mozCancelFullScreen)==null||r.call(document)),e.classList.remove("is-fullscreen")))}let ue=null;function Ft(e,s,t=200){if(!e)return;const n=e.playbackRate,o=performance.now();ue&&cancelAnimationFrame(ue);function i(r){const a=r-o,d=Math.min(a/t,1),c=ye(d),p=n+(s-n)*c;e.playbackRate=p,d<1?ue=requestAnimationFrame(i):e.playbackRate=s}ue=requestAnimationFrame(i)}let pe=null;function Q(e,s,t=150){if(!e)return;const n=e.currentTime,o=Math.max(0,Math.min(n+s,e.duration||1/0)),i=performance.now();Et(e.parentElement,s);function r(a){const d=a-i,c=Math.min(d/t,1),p=ye(c);e.currentTime=n+(o-n)*p,c<1?pe=requestAnimationFrame(r):e.currentTime=o}pe&&cancelAnimationFrame(pe),pe=requestAnimationFrame(r)}function Et(e,s){if(!e)return;let t=e.querySelector(".skip-indicator");t||(t=document.createElement("div"),t.className="skip-indicator",t.innerHTML=`
      <span class="skip-indicator-icon">${s>0?"⏩":"⏪"}</span>
      <span class="skip-indicator-text">${Math.abs(s)}s</span>
    `,t.style.cssText=`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      background: rgba(0, 0, 0, 0.8);
      padding: 20px 40px;
      border-radius: 10px;
      z-index: 30;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      opacity: 0;
      transition: all 0.3s ease-out;
    `,e.appendChild(t)),t.style.opacity="1",t.style.transform="translate(-50%, -50%) scale(1)",setTimeout(()=>{t.style.opacity="0",t.style.transform="translate(-50%, -50%) scale(0.5)",setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},300)},500)}function qe(e){e&&(e.classList.remove("hidden"),e.style.opacity="0",e.style.transform="scale(0.95)",requestAnimationFrame(()=>{e.style.transition="opacity 0.3s ease-out, transform 0.3s ease-out",e.style.opacity="1",e.style.transform="scale(1)"}))}function ve(e){e&&(e.style.transition="opacity 0.25s ease-in, transform 0.25s ease-in",e.style.opacity="0",e.style.transform="scale(0.95)",setTimeout(()=>{e.classList.add("hidden"),e.style.transform=""},250))}function it(e){e&&(e.classList.remove("hidden"),e.style.opacity="0",e.style.transform="scale(0.95)",requestAnimationFrame(()=>{e.style.transition="opacity 0.3s ease-out, transform 0.3s ease-out",e.style.opacity="1",e.style.transform="scale(1)"}))}function yt(e){e&&(e.classList.add("visible"),e.style.transform="translateY(10px) scale(0.98)",e.style.opacity="0",requestAnimationFrame(()=>{e.style.transition="transform 0.3s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.3s ease-out",e.style.transform="translateY(0) scale(1)",e.style.opacity="1"}))}function Ie(e){e&&(e.style.transition="transform 0.2s ease-in, opacity 0.2s ease-in",e.style.transform="translateY(10px) scale(0.98)",e.style.opacity="0",setTimeout(()=>{e.classList.remove("visible"),e.style.transform="",e.style.opacity=""},200))}function Vt(e,s){let t;return function(...n){t||(e.apply(this,n),t=!0,setTimeout(()=>t=!1,s))}}function Dt(e,s){let t;return function(...n){clearTimeout(t),t=setTimeout(()=>e.apply(this,n),s)}}const Me=[];let Ae=!1;function Rt(e){Me.push(e),Ae||(Ae=!0,requestAnimationFrame(()=>{Me.forEach(s=>s()),Me.length=0,Ae=!1}))}function Nt(e,s={}){const t=e==null?void 0:e.querySelector("#customVideo"),n=e==null?void 0:e.querySelector(".player-loading"),o=e==null?void 0:e.querySelector(".player-error"),i=e==null?void 0:e.querySelector(".progress-bar"),r=e==null?void 0:e.querySelector(".buffered-bar"),a=e==null?void 0:e.querySelector(".play-btn-main"),d=e==null?void 0:e.querySelector(".volume-btn"),c=e==null?void 0:e.querySelector(".volume-slider"),p=e==null?void 0:e.querySelector(".time-display"),h=p==null?void 0:p.querySelector(".current-time"),w=p==null?void 0:p.querySelector(".duration"),C=e==null?void 0:e.querySelector(".progress-container"),k=e==null?void 0:e.querySelector(".subtitle-container");k==null||k.querySelector(".subtitle-text");const g=e==null?void 0:e.querySelector(".settings-menu"),M=e==null?void 0:e.querySelector(".settings-btn");return!t||!e?null:(t.addEventListener("loadedmetadata",()=>{if(w){const b=v=>{if(isNaN(v))return"0:00";const x=Math.floor(v/60),E=Math.floor(v%60);return`${x}:${E.toString().padStart(2,"0")}`};w.textContent=b(t.duration)}ve(n)}),t.addEventListener("play",()=>{a.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',e.classList.add("playing"),mt(t,i,h,w),vt(t,r)}),t.addEventListener("pause",()=>{a.innerHTML='<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',e.classList.remove("playing"),Ve(),De()}),t.addEventListener("waiting",()=>qe(n)),t.addEventListener("canplay",()=>ve(n)),t.addEventListener("error",()=>it(o)),e.addEventListener("mousemove",()=>ft(e)),e.addEventListener("mouseleave",()=>{e.classList.contains("playing")&&gt(e)}),t.addEventListener("click",()=>me(t,a,e)),a.addEventListener("click",()=>me(t,a,e)),d.addEventListener("click",()=>{t.muted?(t.muted=!1,O(t,(c==null?void 0:c.value)||1,c,d)):(t.muted=!0,O(t,0,c,d))}),c==null||c.addEventListener("input",b=>{O(t,b.target.value,c,d,100)}),C==null||C.addEventListener("click",b=>{const v=C.getBoundingClientRect(),E=(b.clientX-v.left)/v.width*t.duration;ht(t,E,i,t.duration)}),M==null||M.addEventListener("click",b=>{b.stopPropagation(),g.classList.contains("visible")?Ie(g):yt(g)}),e==null||e.addEventListener("click",b=>{b.target.closest(".settings-wrapper")||Ie(g)}),document.addEventListener("keydown",b=>{if(e.isConnected&&b.target.tagName!=="INPUT")switch(b.key){case" ":case"k":b.preventDefault(),me(t,a,e);break;case"m":b.preventDefault(),t.muted?(t.muted=!1,O(t,(c==null?void 0:c.value)||1,c,d)):(t.muted=!0,O(t,0,c,d));break;case"f":b.preventDefault(),bt(e);break;case"ArrowLeft":b.preventDefault(),Q(t,-5);break;case"ArrowRight":b.preventDefault(),Q(t,5);break;case"j":Q(t,-10);break;case"l":Q(t,10);break}}),document.addEventListener("fullscreenchange",()=>{document.fullscreenElement||e.classList.remove("is-fullscreen")}),{element:e,video:t,loadVideo:b=>{if(qe(n),hideErrorSmooth(o),t.canPlayType("application/vnd.apple.mpegurl"))t.src=b;else if(window.Hls){const v=new window.Hls({enableWorker:!0,lowLatencyMode:!0});v.loadSource(b),v.attachMedia(t),v.on(window.Hls.Events.MANIFEST_PARSED,()=>{ve(n)}),v.on(window.Hls.Events.ERROR,(x,E)=>{E.fatal&&it(o)})}},setEpisodeCallbacks:s.setEpisodeCallbacks})}window.smoothPlayer={initSmoothPlayer:Nt,startSmoothProgressUpdate:mt,stopSmoothProgressUpdate:Ve,startBufferedUpdate:vt,stopBufferedUpdate:De,smoothSeek:ht,setVolumeSmooth:O,showSubtitleSmooth:zt,hideSubtitleSmooth:Ut,togglePlaySmooth:me,toggleFullscreenSmooth:bt,setPlaybackRateSmooth:Ft,skipVideoSmooth:Q,showLoadingSmooth:qe,hideLoadingSmooth:ve,showSettingsMenuSmooth:yt,hideSettingsMenuSmooth:Ie,showControlsSmooth:ft,hideControlsSmooth:gt,throttle:Vt,debounce:Dt,queueBatchUpdate:Rt};const jt="http://localhost:3000",q=jt,_t={"hianime-scrap":{base:"https://api.animo.qzz.io/api/v1",templates:{search:"https://hianimeapi-6uju.onrender.com/api/v1/search?keyword={query}&page=1",info:"https://hianimeapi-6uju.onrender.com/api/v1/anime/{id}",episodes:"https://hianimeapi-6uju.onrender.com/api/v1/episodes/{id}",servers:"https://hianimeapi-6uju.onrender.com/api/v1/servers/id={id}",stream:"https://api.animo.qzz.io/api/v1/stream?id={id}&type={type}&server={server}",home:"https://hianimeapi-6uju.onrender.com/api/v1/home"}},animekai:{base:q+"/anime/animekai",templates:{search:q+"/anime/animekai/{query}",info:q+"/anime/animekai/info?id={id}",episodes:q+"/anime/animekai/episodes/{id}",watch:q+"/anime/animekai/watch/{episodeId}",home:q+"/anime/animekai/new-releases"}},animepahe:{base:q+"/anime/animepahe",templates:{search:q+"/anime/animepahe/{query}",info:q+"/anime/animepahe/info/{id}",episodes:q+"/anime/animepahe/episodes/{id}",watch:q+"/anime/animepahe/watch?episodeId={episodeId}",home:q+"/anime/animekai/new-releases"}}},rt="https://renewed-georgeanne-nekonode-1aa70c0c.koyeb.app";function P(e,s,t={}){const n=_t[e];if(!n)return console.error(`Provider ${e} not found`),"";const o=n.templates[s];if(!o)return console.error(`Template ${s} not found for provider ${e}`),"";let i=o;return Object.keys(t).forEach(r=>{let a=t[r];r==="episodeId"?a=encodeURIComponent(a):a!=null?a=encodeURIComponent(String(a)):a="",i=i.replace(new RegExp(`\\{${r}\\}`,"g"),a)}),i}async function H(e,s={}){try{const t={Accept:"application/json",...s.headers||{}};s.body&&(t["Content-Type"]="application/json");const n=await fetch(e,{...s,headers:t});if(!n.ok)throw new Error(`HTTP error! status: ${n.status}`);return await n.json()}catch(t){throw console.error(`Fetch error for ${e}:`,t),t}}document.getElementById("app");const K=document.getElementById("searchInput"),Ot=document.getElementById("searchBtn"),Y=document.getElementById("providerSelect"),Z=document.getElementById("results"),ee=document.getElementById("details"),fe=document.getElementById("episodes"),y=document.getElementById("servers");let ge=null,F=[],Pe={},B=null,N=[];function te(){const e=localStorage.getItem("useCustomPlayer");return e===null?!0:e==="true"}function Wt(e){localStorage.setItem("useCustomPlayer",String(e)),Gt()}window.handlePlayerToggle=function(){const e=document.getElementById("playerToggle");if(e){e.checked=!e.checked;const s=e.checked;Wt(s),console.log("Toggle changed to:",s?"Custom":"Default"),setTimeout(()=>{Yt()},50)}};function Yt(){var s,t;if(window.hianimeScrapServerData){const n=document.querySelector(".server-tab.active");if(n){const o=n.textContent.toLowerCase(),i=o.includes("sub")?"sub":o.includes("dub")?"dub":"raw",r=(t=(s=window.hianimeScrapServerData[i])==null?void 0:s[0])==null?void 0:t.id;if(r){playHianimeScrapStream(r,i,n.textContent);return}}}const e=document.querySelector(".server-option .play-btn");if(e){const n=e.getAttribute("onclick");if(n){const o=n.match(/playStream\(['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/);if(o){const i=o[1],r=o[2];playStream(i,r);return}}}}function Gt(){const e=document.getElementById("playerToggle");if(e){const s=te();e.checked=s;const t=e.parentElement.querySelector(".toggle-custom"),n=e.parentElement.querySelector(".toggle-default");t&&n&&(t.style.opacity=s?"1":"0.5",n.style.opacity=s?"0.5":"1")}}function wt(e){const{videoUrl:s="",title:t="Video"}=e,n=document.createElement("div");return n.className="default-video-player",n.id="defaultVideoPlayer",n.innerHTML=`
    <video id="defaultVideo" preload="metadata" controls playsinline>
      <source src="${s}" type="application/vnd.apple.mpegurl">
    </video>
    <div class="default-player-info">
      <p>Using default browser player</p>
      <p class="video-title">${t}</p>
    </div>
  `,n}function St(e,s={}){const t=e.querySelector("#defaultVideo"),n=s.videoUrl||"";return n&&(t.canPlayType("application/vnd.apple.mpegurl")?t.src=n:at(t,n)),{element:e,video:t,loadVideo:o=>{t.canPlayType("application/vnd.apple.mpegurl")?t.src=o:at(t,o)}}}function at(e,s){try{if(window.Hls)lt(e,s);else{const t=document.createElement("script");t.src="https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js",t.onload=()=>lt(e,s),t.onerror=()=>{console.error("Failed to load HLS.js")},document.head.appendChild(t)}}catch(t){console.warn("HLS playback failed:",t)}}function lt(e,s){if(!window.Hls||!e)return;const t=new window.Hls({enableWorker:!0,lowLatencyMode:!0});t.loadSource(s),t.attachMedia(e),t.on(window.Hls.Events.MANIFEST_PARSED,()=>{console.log("HLS manifest parsed for default player")}),t.on(window.Hls.Events.ERROR,(n,o)=>{console.error("HLS error in default player:",o)})}let ct=[];function Be(e){const s=[],t=/(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n\n|\n*$)/g;let n;for(;(n=t.exec(e))!==null;)s.push({startTime:be(n[2]),endTime:be(n[3]),text:n[4].trim()});return s}function ze(e){const s=[],t=/(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})\n([\s\S]*?)(?=\n\n|\n*$)/g;let n;for(e=e.replace(/^WEBVTT.*?\n\n/s,"");(n=t.exec(e))!==null;)s.push({startTime:be(n[1]),endTime:be(n[2]),text:n[3].trim()});return s}function be(e){const s=e.split(/[:,.]/);if(s.length>=4){const t=parseInt(s[0]),n=parseInt(s[1]),o=parseInt(s[2]),i=parseInt(s[3]);return t*3600+n*60+o+i/1e3}return 0}function Ue(e,s,t="en"){if(!B)return;const n=B.video,o=document.createElement("track");o.label=s,o.kind="subtitles",o.srclang=t,o.mode="hidden";let i=`WEBVTT

`;e.forEach((d,c)=>{i+=`${dt(d.startTime)} --> ${dt(d.endTime)}
${d.text}

`});const r=new Blob([i],{type:"text/vtt"}),a=URL.createObjectURL(r);o.src=a,n.appendChild(o),N.push({track:o,url:a,label:s,language:t,cues:e});for(let d=0;d<n.textTracks.length;d++)n.textTracks[d].mode="hidden";return n.textTracks.length>0&&(n.textTracks[n.textTracks.length-1].mode="showing"),o}function dt(e){const s=Math.floor(e/3600),t=Math.floor(e%3600/60),n=Math.floor(e%60),o=Math.floor(e%1*1e3);return`${s.toString().padStart(2,"0")}:${t.toString().padStart(2,"0")}:${n.toString().padStart(2,"0")}.${o.toString().padStart(3,"0")}`}function ut(e){return new Promise((s,t)=>{const n=new FileReader;n.onload=o=>{const i=o.target.result;let r=[];if(e.name.endsWith(".srt")?r=Be(i):e.name.endsWith(".vtt")||i.includes("WEBVTT")?r=ze(i):r=Be(i),r.length>0){const a=Fe(e.name),d=Ue(r,e.name,a);A(`Subtitle "${e.name}" loaded successfully`,"success"),s({cues:r,label:e.name,language:a,track:d})}else A("Failed to parse subtitle file","error"),t(new Error("Failed to parse subtitle"))},n.onerror=()=>{A("Error reading subtitle file","error"),t(new Error("Error reading file"))},n.readAsText(e)})}function Fe(e){const s=e.toLowerCase();return s.includes("english")||s.includes("eng")?"en":s.includes("spanish")||s.includes("español")?"es":s.includes("french")||s.includes("français")?"fr":s.includes("german")||s.includes("deutsch")?"de":s.includes("italian")||s.includes("italiano")?"it":s.includes("portuguese")||s.includes("português")?"pt":s.includes("russian")||s.includes("русский")?"ru":s.includes("japanese")?"ja":s.includes("korean")?"ko":s.includes("chinese")||s.includes("中文")?"zh":"en"}async function Xt(e){try{const s=await H(`http://localhost:3000/anime/animesama/watch?episodeId={episodeId}=${encodeURIComponent(e)}`,{});return s&&s.data&&Array.isArray(s.data)?(ct=s.data.slice(0,10),ct):[]}catch(s){return console.error("Cloud subtitle search error:",s),Qt(e)}}function Qt(e){return[{id:"1",file_name:`${e} English.srt`,language:"en",downloads:1e3,rating:8.5},{id:"2",file_name:`${e} English [SDH].srt`,language:"en",downloads:800,rating:8.2},{id:"3",file_name:`${e} Spanish.srt`,language:"es",downloads:500,rating:7.9},{id:"4",file_name:`${e} French.srt`,language:"fr",downloads:400,rating:7.8},{id:"5",file_name:`${e} Portuguese.srt`,language:"pt",downloads:300,rating:7.5}]}async function Jt(e,s){try{A(`Downloading ${s}...`,"info");const t=await H(`https://api.opensubtitles.com/api/v1/download/${e}`,{headers:{"Api-Key":"Y2xvdWQtMTYzODU2MkAxNzMxNjM2NjI3OmRhMWQxNDM0YWFkZjM0ZGU4NzgwMjhhZTk0OWE0YzU0","User-Agent":"AnimeFlix v1.0.0",Accept:"application/json","Content-Type":"application/json"},method:"POST",body:JSON.stringify({file_name:s})});if(t&&t.link){const i=await H(t.link);let r=[];if(typeof i=="string"?i.includes("WEBVTT")?r=ze(i):r=Be(i):typeof i=="object"&&(r=i),r.length>0){const a=Fe(s);return Ue(r,s,a),A(`Loaded ${s}`,"success"),!0}}const n=[{startTime:0,endTime:2,text:"This is a sample subtitle"},{startTime:2,endTime:4,text:"Downloaded from cloud"},{startTime:4,endTime:6,text:`${s}`}],o=Fe(s);return Ue(n,s,o),A(`Loaded ${s} (demo)`,"success"),!0}catch(t){return console.error("Download error:",t),A("Failed to download subtitle","error"),!1}}function kt(e){const{videoUrl:s="",title:t="Video",tracks:n=[],intro:o={start:0,end:0},outro:i={start:0,end:0}}=e,r=document.createElement("div");r.className="custom-video-player",r.id="customVideoPlayer";const a={play:'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',volumeHigh:'<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',fullscreen:'<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',settings:'<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',upload:'<svg viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>',cloud:'<svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>',skipBack:'<svg viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>',skipForward:'<svg viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>',previous:'<svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>',next:'<svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zm2-5.71L11.29 12H2v-2h9.29l-3-2.29zM22 6h-2V2h-2v4h-2V2h-2v4h-2V2h-2v4h-2V2H8v4H6V2H4v16h2v-4h2v4h2v-4h2v4h2v-4h2v4h2v-4h2v4h2V6z"/></svg>',check:'<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'};let d="";return n.length>0&&(d=n.map(c=>c.kind==="captions"||c.kind==="subtitles"?`<track label="${c.label}" kind="${c.kind}" src="${c.file}" ${c.default?"default":""}>`:"").join("")),r.innerHTML=`
    <video id="customVideo" preload="metadata" crossorigin="anonymous">
      <source src="${s}" type="application/vnd.apple.mpegurl">
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
            <span class="current-episode">${t}</span>
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
              ${[.5,.75,1,1.25,1.5,2].map(c=>`<div class="submenu-item" data-speed="${c}"><span class="check-icon">${a.check}</span><span>${c}x</span></div>`).join("")}
            </div>
            <div class="submenu subtitle-track-menu">
              <div class="submenu-item active" data-track="off"><span class="check-icon">${a.check}</span><span>Off</span></div>
              <div class="submenu-item" data-track="uploaded"><span class="check-icon">${a.check}</span><span>Uploaded</span></div>
            </div>
            <div class="submenu subtitle-size-menu">
              ${["Small","Medium","Large","X-Large"].map(c=>`<div class="submenu-item" data-size="${c.toLowerCase()}"><span class="check-icon">${a.check}</span><span>${c}</span></div>`).join("")}
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
  `,r}function Lt(e,s={}){var Je,Ke,Ze,et,tt,st,nt;const t=e.querySelector("#customVideo"),n=e.querySelector(".player-loading"),o=e.querySelector(".player-error"),i=e.querySelector(".player-controls"),r=e.querySelector(".progress-container"),a=e.querySelector(".progress-bar"),d=e.querySelector(".buffered-bar"),c=e.querySelector(".play-btn-main"),p=e.querySelector(".volume-btn"),h=e.querySelector(".volume-slider"),w=e.querySelectorAll(".skip-btn"),C=e.querySelector(".fullscreen-btn"),k=e.querySelector(".settings-btn"),g=e.querySelector(".settings-menu"),M=e.querySelector(".time-display"),b=M.querySelector(".current-time"),v=M.querySelector(".duration"),x=e.querySelector(".subtitle-container"),E=x.querySelector(".subtitle-text");let V=!1,se=!1,je=null,D=null;function _e(l){if(isNaN(l))return"0:00";const u=Math.floor(l/60),m=Math.floor(l%60);return`${u}:${m.toString().padStart(2,"0")}`}function Mt(){t.duration&&(a.style.width=`${t.currentTime/t.duration*100}%`,b.textContent=_e(t.currentTime))}function At(){t.buffered.length>0&&(d.style.width=`${t.buffered.end(t.buffered.length-1)/t.duration*100}%`)}function ne(){n.classList.remove("hidden")}function Se(){n.classList.add("hidden")}function oe(){o.classList.remove("hidden"),i.classList.add("hidden")}function Oe(){o.classList.add("hidden"),i.classList.remove("hidden")}function ke(){t.paused?(t.play().catch(()=>{}),V=!0,c.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',e.classList.add("playing")):(t.pause(),V=!1,c.innerHTML='<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',e.classList.remove("playing"))}function Le(){se?(t.muted=!1,se=!1,p.innerHTML='<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',h.value=t.volume):(t.muted=!0,se=!0,p.innerHTML='<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',h.value=0)}function We(){var l,u,m,f;document.fullscreenElement?(m=document.exitFullscreen)!=null&&m.call(document)||((f=document.webkitExitFullscreen)==null||f.call(document)):(l=e.requestFullscreen)!=null&&l.call(e)||((u=e.webkitRequestFullscreen)==null||u.call(e))}function G(l){t.currentTime=Math.max(0,Math.min(t.currentTime+l,t.duration))}function Ye(){window.smoothPlayer&&window.smoothPlayer.showControlsSmooth?window.smoothPlayer.showControlsSmooth(e):(e.classList.add("show-controls"),clearTimeout(je),V&&(je=setTimeout(()=>{e.classList.remove("show-controls")},3e3)))}function $e(l){if(t.canPlayType("application/vnd.apple.mpegurl")){t.src=l;return}try{if(window.Hls)Ge(l);else{const u=document.createElement("script");u.src="https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js",u.onload=()=>Ge(l),u.onerror=oe,document.head.appendChild(u)}}catch{oe()}}function Ge(l){window.Hls&&(D&&D.destroy(),D=new window.Hls({enableWorker:!0,lowLatencyMode:!0}),D.loadSource(l),D.attachMedia(t),D.on(window.Hls.Events.MANIFEST_PARSED,()=>{Se(),t.play().catch(()=>{})}),D.on(window.Hls.Events.ERROR,(u,m)=>{m.fatal&&oe()}))}t.addEventListener("loadedmetadata",()=>{v.textContent=_e(t.duration),Se()}),t.addEventListener("play",()=>{V=!0,c.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',Ye()}),t.addEventListener("pause",()=>{V=!1,c.innerHTML='<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'}),t.addEventListener("timeupdate",()=>{Mt(),At()}),t.addEventListener("waiting",ne),t.addEventListener("canplay",Se),t.addEventListener("error",oe),c.addEventListener("click",ke),t.addEventListener("click",ke),p.addEventListener("click",Le),h.addEventListener("input",l=>{t.volume=l.target.value,h.value=t.volume,t.volume>0&&se&&Le()}),w.forEach(l=>l.addEventListener("click",()=>G(parseInt(l.dataset.seconds)))),r.addEventListener("click",l=>{const u=(l.clientX-r.getBoundingClientRect().left)/r.getBoundingClientRect().width;t.currentTime=u*t.duration}),C.addEventListener("click",We),k.addEventListener("click",()=>{g.classList.toggle("visible")}),e.addEventListener("click",l=>{l.target.closest(".settings-wrapper")||g.classList.remove("visible")});const ie=e.querySelector(".playback-speed-menu");(Je=e.querySelector('[data-setting="playbackSpeed"]'))==null||Je.addEventListener("click",()=>{ie.classList.toggle("visible")}),ie.querySelectorAll(".submenu-item").forEach(l=>{l.addEventListener("click",()=>{t.playbackRate=parseFloat(l.dataset.speed),ie.classList.remove("visible"),ie.querySelectorAll(".submenu-item").forEach(u=>u.classList.remove("active")),l.classList.add("active")})});const re=e.querySelector(".subtitle-size-menu");(Ke=e.querySelector('[data-setting="subtitleSize"]'))==null||Ke.addEventListener("click",()=>{re.classList.toggle("visible")}),re.querySelectorAll(".submenu-item").forEach(l=>{l.addEventListener("click",()=>{x.className=`subtitle-container subtitle-size-${l.dataset.size}`,re.classList.remove("visible"),re.querySelectorAll(".submenu-item").forEach(u=>u.classList.remove("active")),l.classList.add("active")})});const Te=e.querySelector(".subtitle-position-menu");(Ze=e.querySelector('[data-setting="subtitlePosition"]'))==null||Ze.addEventListener("click",()=>{Te.classList.toggle("visible")}),Te.querySelectorAll(".submenu-item[data-position]").forEach(l=>{l.addEventListener("click",()=>{x.classList.remove("subtitle-position-top","subtitle-position-middle","subtitle-position-bottom"),x.classList.add(`subtitle-position-${l.dataset.position}`),Te.querySelectorAll(".submenu-item").forEach(u=>u.classList.remove("active")),l.classList.add("active"),A(`Subtitle position: ${l.dataset.position}`,"info")})});let _=0;const Ct=e.querySelector(".offset-value");e.querySelectorAll(".offset-btn").forEach(l=>{l.addEventListener("click",()=>{const u=parseInt(l.dataset.offset);_=Math.max(-200,Math.min(200,_+u)),Ct.textContent=_>0?`+${_}`:_,x.style.bottom=`calc(100px + ${_}px)`,x.style.top="auto",x.style.transform="translateX(-50%)"})});const Xe=e.querySelector(".subtitle-track-menu");(et=e.querySelector('[data-setting="subtitleTrack"]'))==null||et.addEventListener("click",()=>{Xe.classList.toggle("visible")});const Ht=e.querySelector(".upload-subtitle-menu");(tt=e.querySelector('[data-setting="uploadSubtitle"]'))==null||tt.addEventListener("click",()=>{Ht.classList.toggle("visible"),Xe.classList.remove("visible"),cloudSubtitlesMenu.classList.remove("visible")});const L=e.querySelector(".upload-zone"),R=L==null?void 0:L.querySelector(".subtitle-input");L==null||L.addEventListener("click",()=>{R==null||R.click()}),R==null||R.addEventListener("change",async l=>{const u=l.target.files;if(u&&u.length>0)for(let m=0;m<u.length;m++){const f=u[m];if(f.name.endsWith(".srt")||f.name.endsWith(".vtt"))try{await ut(f),X()}catch(z){console.error("Subtitle upload error:",z)}}R.value=""}),L==null||L.addEventListener("dragover",l=>{l.preventDefault(),L.classList.add("dragover")}),L==null||L.addEventListener("dragleave",()=>{L.classList.remove("dragover")}),L==null||L.addEventListener("drop",async l=>{var m;l.preventDefault(),L.classList.remove("dragover");const u=(m=l.dataTransfer)==null?void 0:m.files;if(u&&u.length>0)for(let f=0;f<u.length;f++){const z=u[f];if(z.name.endsWith(".srt")||z.name.endsWith(".vtt"))try{await ut(z),X()}catch(T){console.error("Subtitle upload error:",T)}}});function X(){const l=e.querySelector(".uploaded-subtitles-list");if(l){if(N.length===0){l.innerHTML='<p style="color: var(--text-light); font-size: 0.85em; padding: 10px;">No subtitles uploaded</p>';return}l.innerHTML=N.map((u,m)=>`
      <div class="loaded-subtitle-item ${m===N.length-1?"active":""}">
        <span class="name">${u.label.substring(0,25)}${u.label.length>25?"...":""}</span>
        <button class="remove-btn" onclick="removeSubtitle(${m})">✕</button>
      </div>
    `).join("")}}window.removeSubtitle=function(l){if(N[l]){const u=N[l];u.track&&u.track.parentNode&&u.track.parentNode.removeChild(u.track),u.url&&URL.revokeObjectURL(u.url),N.splice(l,1),X(),A("Subtitle removed","info")}};let S=null;function qt(){const l=document.getElementById("cloudSubtitlesModal");if(l&&l.remove(),S=document.createElement("div"),S.id="cloudSubtitlesModal",S.className="cloud-subtitles-modal",S.innerHTML=`
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
    `,document.body.appendChild(S),!document.getElementById("cloudSubtitlesModalStyles")){const T=document.createElement("style");T.id="cloudSubtitlesModalStyles",T.textContent=`
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
      `,document.head.appendChild(T)}S.querySelector(".close-cloud-modal").addEventListener("click",ae),S.addEventListener("click",T=>{T.target===S&&ae()}),document.addEventListener("keydown",Qe);const m=S.querySelector(".cloud-search-input-modal"),f=S.querySelector(".cloud-search-btn-modal");async function z(){const T=m.value.trim();if(!T){A("Please enter a search term","warning");return}const ot=S.querySelector(".cloud-results-modal");ot.innerHTML=`
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Searching for "${T}"...</p>
        </div>
      `,f.disabled=!0;try{const xe=await Xt(T);It(xe,T)}catch(xe){console.error("Cloud search error:",xe),ot.innerHTML=`
          <div class="no-results">
            <div class="no-results-icon">😕</div>
            <p>Search failed. Please try again.</p>
          </div>
        `}finally{f.disabled=!1}}f.addEventListener("click",z),m.addEventListener("keypress",T=>{T.key==="Enter"&&z()}),setTimeout(()=>m.focus(),100)}function It(l,u){const m=S.querySelector(".cloud-results-modal");if(l.length===0){m.innerHTML=`
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <p>No subtitles found for "${u}"</p>
          <p style="font-size: 0.9em; margin-top: 10px; color: rgba(255,255,255,0.5);">Try a different search term or upload your own subtitle</p>
        </div>
      `;return}m.innerHTML=l.map((f,z)=>{var T;return`
      <div class="subtitle-result" data-id="${f.id}" data-filename="${f.file_name.replace(/'/g,"\\'")}" onclick="handleSubtitleClick('${f.id}', '${f.file_name.replace(/'/g,"\\'")}', this)">
        <div class="subtitle-result-info">
          <div class="name">${f.file_name}</div>
          <div class="details">
            ${((T=f.language)==null?void 0:T.toUpperCase())||"Unknown"} 
            • ⭐ ${f.rating||"N/A"} 
            • ↓ ${f.downloads||0}
          </div>
        </div>
        <button class="download-btn" onclick="event.stopPropagation(); handleSubtitleDownload('${f.id}', '${f.file_name.replace(/'/g,"\\'")}', this)">⬇</button>
      </div>
    `}).join("")}window.handleSubtitleClick=async function(l,u,m){m.parentElement.querySelectorAll(".subtitle-result").forEach(f=>f.style.background=""),m.style.background="rgba(233, 69, 96, 0.25)",m.style.borderColor="var(--accent)",await handleSubtitleDownload(l,u,m.querySelector(".download-btn"))},window.handleSubtitleDownload=async function(l,u,m){m.disabled=!0,m.textContent="⏳",await Jt(l,u)?(m.textContent="✓",m.style.background="var(--success, #00d26a)",A(`Loaded: ${u}`,"success"),X(),setTimeout(()=>{ae()},1e3)):(m.disabled=!1,m.textContent="⬇")};function Pt(){S||qt(),S.classList.add("visible");const l=S==null?void 0:S.querySelector(".cloud-search-input-modal");l&&window.currentAnimeTitle&&(l.value=window.currentAnimeTitle)}function ae(){S&&(S.classList.remove("visible"),document.removeEventListener("keydown",Qe))}function Qe(l){l.key==="Escape"&&ae()}return(st=e.querySelector('[data-setting="cloudSubtitles"]'))==null||st.addEventListener("click",()=>{Pt(),g==null||g.classList.remove("visible")}),X(),document.addEventListener("keydown",l=>{if(e.isConnected&&l.target.tagName!=="INPUT")switch(l.key){case" ":case"k":l.preventDefault(),ke();break;case"m":Le();break;case"f":We();break;case"ArrowLeft":l.preventDefault(),G(-5);break;case"ArrowRight":l.preventDefault(),G(5);break;case"j":G(-10);break;case"l":G(10);break}}),e.addEventListener("mousemove",Ye),e.addEventListener("mouseleave",()=>{window.smoothPlayer&&window.smoothPlayer.hideControlsSmooth&&V?window.smoothPlayer.hideControlsSmooth(e):V&&e.classList.remove("show-controls")}),t.addEventListener("timeupdate",()=>{var u;const l=t.textTracks;for(let m=0;m<l.length;m++)if(l[m].mode==="showing"){const f=(u=l[m].activeCues)==null?void 0:u[0];E.textContent=f?f.text:"",x.classList.toggle("visible",!!f);break}}),(nt=o.querySelector(".retry-btn"))==null||nt.addEventListener("click",()=>{Oe(),ne(),$e(e.dataset.videoUrl)}),e.dataset.videoUrl=s.videoUrl||"",s.videoUrl&&(ne(),$e(s.videoUrl)),{element:e,video:t,loadVideo:l=>{e.dataset.videoUrl=l,Oe(),ne(),$e(l)},setEpisodeCallbacks:(l,u)=>{const m=e.querySelector(".prev-episode"),f=e.querySelector(".next-episode");m.disabled=!l,f.disabled=!u,m.onclick=l||(()=>{}),f.onclick=u||(()=>{})}}}let $=null,j=0,he=null;async function Kt(){const e=Y.value,s=P(e,"home");console.log("Fetching home page data from:",s);try{const t=await H(s);return Zt(t)}catch(t){throw console.error("Error fetching home page data:",t),t}}function Zt(e){return e?(e.data&&(e=e.data),{status:e.status||!0,spotlight:es(e.spotlight||[]),trending:I(e.trending||[]),topAiring:I(e.topAiring||[]),mostPopular:I(e.mostPopular||[]),mostFavorite:I(e.mostFavorite||[]),latestCompleted:I(e.latestCompleted||[]),latestEpisode:I(e.latestEpisode||[]),newAdded:I(e.newAdded||[]),topUpcoming:I(e.topUpcoming||[]),topTen:ts(e.topTen||{today:[],week:[],month:[]}),genres:e.genres||[]}):null}function es(e){return e.map(s=>{var t,n,o;return{title:s.title||"Unknown Title",alternativeTitle:s.alternativeTitle||"",id:s.id||"",poster:s.poster||"https://via.placeholder.com/400x600",episodes:{sub:((t=s.episodes)==null?void 0:t.sub)||0,dub:((n=s.episodes)==null?void 0:n.dub)||0,eps:((o=s.episodes)==null?void 0:o.eps)||0},rank:s.rank||0,type:s.type||"TV",quality:s.quality||"HD",duration:s.duration||"Unknown",aired:s.aired||"Unknown",synopsis:s.synopsis||"No synopsis available."}})}function I(e){return e.map(s=>{var t,n,o;return{title:s.title||"Unknown Title",alternativeTitle:s.alternativeTitle||"",id:s.id||"",poster:s.poster||"https://via.placeholder.com/200x300",episodes:{sub:((t=s.episodes)==null?void 0:t.sub)||0,dub:((n=s.episodes)==null?void 0:n.dub)||0,eps:((o=s.episodes)==null?void 0:o.eps)||0},type:s.type||"TV"}})}function ts(e){return{today:I(e.today||[]).slice(0,10),week:I(e.week||[]).slice(0,10),month:I(e.month||[]).slice(0,10)}}function Re(){const e=document.getElementById("homePage"),s=document.querySelector(".search-container"),t=document.getElementById("results"),n=document.getElementById("details"),o=document.getElementById("episodes"),i=document.getElementById("servers"),r=document.getElementById("homeBtn"),a=document.getElementById("searchNavBtn");r.classList.add("active"),a.classList.remove("active"),e.classList.add("visible"),e.classList.remove("hidden"),s.classList.remove("visible"),t.innerHTML="",n.innerHTML="",o.innerHTML="",i.innerHTML="",$||$t()}function we(){const e=document.getElementById("homePage"),s=document.querySelector(".search-container"),t=document.getElementById("homeBtn"),n=document.getElementById("searchNavBtn");t.classList.remove("active"),n.classList.add("active"),e.classList.remove("visible"),e.classList.add("hidden"),s.classList.add("visible"),cs()}async function $t(){const e=document.getElementById("homeContent");e.innerHTML=ss();try{if($=await Kt(),!$||!$.status)throw new Error("Failed to load home page data");e.innerHTML=os($),ls(),A("Home page loaded successfully","success")}catch(s){console.error("Error loading home page:",s),e.innerHTML=ns(s.message)}}function ss(){return`
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
  `}function ns(e){return`
    <div class="home-error">
      <div class="error-icon">😕</div>
      <h2>Oops! Something went wrong</h2>
      <p>${e||"Unable to load home page data. Please try again."}</p>
      <button class="retry-btn" onclick="loadHomePage()">🔄 Retry</button>
    </div>
  `}function os(e){var t,n,o;let s="";return e.spotlight&&e.spotlight.length>0&&(s+=is(e.spotlight)),e.genres&&e.genres.length>0&&(s+=rs(e.genres)),e.topTen&&(((t=e.topTen.today)==null?void 0:t.length)>0||((n=e.topTen.week)==null?void 0:n.length)>0||((o=e.topTen.month)==null?void 0:o.length)>0)&&(s+=as(e.topTen)),e.trending&&e.trending.length>0&&(s+=U("📈 Trending Now","trending",e.trending)),e.topAiring&&e.topAiring.length>0&&(s+=U("▶️ Top Airing","topAiring",e.topAiring)),e.mostPopular&&e.mostPopular.length>0&&(s+=U("⭐ Most Popular","mostPopular",e.mostPopular)),e.mostFavorite&&e.mostFavorite.length>0&&(s+=U("❤️ Most Favorite","mostFavorite",e.mostFavorite)),e.latestCompleted&&e.latestCompleted.length>0&&(s+=U("✅ Latest Completed","latestCompleted",e.latestCompleted)),e.latestEpisode&&e.latestEpisode.length>0&&(s+=U("🎬 Latest Episodes","latestEpisode",e.latestEpisode)),e.newAdded&&e.newAdded.length>0&&(s+=U("🆕 Newly Added","newAdded",e.newAdded)),e.topUpcoming&&e.topUpcoming.length>0&&(s+=U("🚀 Top Upcoming","topUpcoming",e.topUpcoming)),s}function is(e){const s=e.map((n,o)=>{var i,r,a;return`
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
  `}).join(""),t=e.map((n,o)=>`
    <button class="spotlight-dot ${o===0?"active":""}" data-index="${o}"></button>
  `).join("");return`
    <div class="home-section">
      <div class="spotlight-container">
        <div class="spotlight-slider">
          ${s}
          <button class="spotlight-nav prev" onclick="prevSpotlight()">❮</button>
          <button class="spotlight-nav next" onclick="nextSpotlight()">❯</button>
          <div class="spotlight-dots">${t}</div>
        </div>
      </div>
    </div>
  `}function rs(e){return`
    <div class="home-section">
      <div class="section-header">
        <h2>🏷️ Browse by Genre</h2>
      </div>
      <div class="genres-container">${e.map(t=>`
    <button class="genre-tag-btn" onclick="searchByGenre('${t.replace(/'/g,"\\'")}')">${t}</button>
  `).join("")}</div>
    </div>
  `}function as(e){const s=(t,n)=>!t||t.length===0?'<p style="color: var(--text-light); text-align: center;">No data available</p>':t.slice(0,5).map((o,i)=>{var r;return`
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
          ${s(e.today)}
        </div>
        <div class="top10-category">
          <h3>📆 This Week</h3>
          ${s(e.week)}
        </div>
        <div class="top10-category">
          <h3>🗓️ This Month</h3>
          ${s(e.month)}
        </div>
      </div>
    </div>
  `}function U(e,s,t){const n=t.slice(0,12).map(o=>{var i;return`
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
        <button class="see-all-btn" onclick="viewAllCategory('${s}')">See All →</button>
      </div>
      <div class="home-anime-grid">${n}</div>
    </div>
  `}function ls(){var e;(e=$==null?void 0:$.spotlight)!=null&&e.length&&(j=0,he=setInterval(()=>{Tt()},5e3))}function cs(){he&&(clearInterval(he),he=null)}function Tt(){var e;(e=$==null?void 0:$.spotlight)!=null&&e.length&&(j=(j+1)%$.spotlight.length,xt())}function ds(){var e;(e=$==null?void 0:$.spotlight)!=null&&e.length&&(j=(j-1+$.spotlight.length)%$.spotlight.length,xt())}function xt(){const e=document.querySelectorAll(".spotlight-slide"),s=document.querySelectorAll(".spotlight-dot");e.forEach((t,n)=>{t.classList.toggle("active",n===j)}),s.forEach((t,n)=>{t.classList.toggle("active",n===j)})}function us(e){console.log("View all category:",e),A(`Showing all ${e} - Filter by provider if needed`,"info"),we(),K.focus()}function ps(e){we(),K.value=e,K.focus(),Ne()}window.loadHomePage=$t;window.showHomePage=Re;window.showSearchPage=we;window.nextSpotlight=Tt;window.prevSpotlight=ds;window.viewAllCategory=us;window.searchByGenre=ps;function A(e,s="info"){const t=document.querySelector(".toast-container");t&&t.remove();const n=document.createElement("div");n.className="toast-container";const o=document.createElement("div");o.className=`toast ${s}`;const i=s==="success"?"✓":s==="error"?"✕":"ℹ";o.innerHTML=`<span style="font-size:1.2em;">${i}</span> ${e}`,n.appendChild(o),document.body.appendChild(n),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateX(100px)",o.style.transition="all 0.3s ease",setTimeout(()=>n.remove(),300)},3e3)}function ms(){let s="";for(let t=0;t<12;t++)s+=`
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
    `;Z.innerHTML=s}async function Ne(){const e=K.value.trim();if(!e){A("Please enter a search query","warning");return}try{ms();const s=Y.value,t=P(s,"search",{query:e});console.log("Search URL:",t);const n=await H(t);let o=[];if(n&&n.data&&n.data.response&&Array.isArray(n.data.response)?o=n.data.response:Array.isArray(n)?o=n:n&&n.results&&Array.isArray(n.results)?o=n.results:n&&n.anime&&Array.isArray(n.anime)?o=n.anime:n&&n.data&&Array.isArray(n.data)&&(o=n.data),o.length===0){Z.innerHTML='<p style="text-align:center;padding:40px;color:var(--text-light);">No results found. Try a different search term.</p>';return}vs(o),A(`Found ${o.length} results`,"success")}catch(s){console.error("Search error:",s),Z.innerHTML=`<p class="error" style="text-align:center;padding:40px;color:var(--accent);">Search failed: ${s.message}. Check your connection and try again.</p>`}}function vs(e){Pe={},Z.innerHTML=e.map(s=>{const t=s.title||s.name||s.englishName||"Unknown Title",n=s.id||s.animeId||s.mal_id||"",o=s.image||s.poster||s.coverImage||"https://via.placeholder.com/150x200",i=s.releaseDate||s.year||s.startDate||"N/A";let r="";if(s.episodes)if(typeof s.episodes=="object"){const p=s.episodes.sub||0,h=s.episodes.dub||0,w=s.episodes.eps||0;p>0||h>0?r=`<p>${p>0?`Sub: ${p}`:""}${p>0&&h>0?" | ":""}${h>0?`Dub: ${h}`:""}</p>`:w>0&&(r=`<p>Episodes: ${w}</p>`)}else r=`<p>Episodes: ${s.episodes}</p>`;const a=s.type?`<p>${s.type}</p>`:"",d=s.duration?`<p>${s.duration}</p>`:"";return Y.value==="hianime-scrap"?(Pe[n]=s,`
        <div class="anime-card" onclick="selectAnime('${n.replace(/'/g,"\\'")}')">
          <img src="${o}" alt="${t}" loading="lazy">
          <h3>${t}</h3>
          ${r}
          ${a}
          ${d}
          <p>${i}</p>
        </div>
      `):`
      <div class="anime-card" onclick="selectAnime('${n.replace(/'/g,"\\'")}', '${t.replace(/'/g,"\\'")}')">
        <img src="${o}" alt="${t}" loading="lazy">
        <h3>${t}</h3>
        ${r}
        ${a}
        ${d}
        <p>${i}</p>
      </div>
    `}).join("")}async function hs(e,s){var i,r,a,d,c,p;if(!e){alert("Invalid anime ID");return}const t=Y.value;console.log(t);const n=t==="hianime-scrap",o=n?Pe[e]:null;try{if(ee.innerHTML="<p>Loading details...</p>",n&&o){const g={...o,id:o.id||e,__provider:t};try{const b=P(t,"episodes",{id:e});console.log("Episodes URL:",b);const v=await H(b);if(g.episodes=pt(v,t),g.episodes.length>0){Ce(g,o.title);return}}catch(b){console.warn("Could not fetch episodes for hianime-scrap:",b)}const M=((i=g.episodes)==null?void 0:i.eps)||((r=g.episodes)==null?void 0:r.sub)||((a=g.episodes)==null?void 0:a.dub)||((d=g.episodes)==null?void 0:d.total)||((c=g.episodes)==null?void 0:c.episodeCount)||((p=g.episodes)==null?void 0:p.totalEpisodes)||0;M>0?(g.episodes=Array.from({length:Math.min(M,500)},(b,v)=>({id:`${e}::ep=${v+1}`,number:v+1,title:`Episode ${v+1}`,isFiller:!1})),console.log(`Generated ${M} episode buttons from count`)):g.episodes=[],Ce(g,o.title);return}const h=typeof s=="string"?s:null,w=P(t,"info",{id:e});console.log("Info URL:",w);const C=await H(w);let k=fs(C,e,t);if(!k.episodes||k.episodes.length===0)try{const g=P(t,"episodes",{id:e});console.log("Episodes URL:",g);const M=await H(g);k.episodes=pt(M,t)}catch(g){console.warn("Could not fetch episodes separately:",g),k.episodes=[]}k.__provider=t,Ce(k,h||k.title)}catch(h){console.error("Details error:",h),ee.innerHTML=`<p class="error">Error loading anime details: ${h.message}</p>`}}function fs(e,s,t){var n,o,i;if(e&&e.data&&t==="hianime-scrap")return{...e.data,id:e.data.id||s,title:e.data.title,poster:e.data.poster,image:e.data.poster,type:e.data.type,status:e.data.status,genres:e.data.genres||[],description:e.data.description||e.data.synopsis||"",totalEpisodes:((n=e.data.episodes)==null?void 0:n.eps)||((o=e.data.episodes)==null?void 0:o.sub)||((i=e.data.episodes)==null?void 0:i.dub)||"Unknown"};if(Array.isArray(e)){const r=e.find(a=>a&&a.id===s)||e[0];return r?{...r,id:r.id||s}:{id:s,episodes:[]}}if(e&&e.results&&Array.isArray(e.results)){const r=e.results.find(a=>a&&a.id===s)||e.results[0];return r?{...r,id:r.id||s}:{...e,id:e.id||s}}return e&&e.data?{...e.data,id:e.data.id||s}:e&&(e.title||e.name||e.englishName)?{...e,id:e.id||s}:{id:s,...e||{}}}function pt(e,s){return e?s==="hianime-scrap"&&e&&e.data&&Array.isArray(e.data)?e.data.map((t,n)=>({id:t.id||`${n+1}`,number:t.episodeNumber||n+1,title:t.title||t.alternativeTitle||`Episode ${t.episodeNumber||n+1}`,isFiller:t.isFiller||!1})):Array.isArray(e)?e.map((t,n)=>({id:t.id||t.episodeId||`${n+1}`,number:t.number||t.episode||t.ep||n+1,title:t.title||t.name||`Episode ${n+1}`})):e.episodes&&Array.isArray(e.episodes)?e.episodes.map((t,n)=>({id:t.id||t.episodeId||`${n+1}`,number:t.number||t.episode||t.ep||n+1,title:t.title||t.name||`Episode ${n+1}`})):e.data&&Array.isArray(e.data)?e.data.map((t,n)=>({id:t.id||t.episodeId||`${n+1}`,number:t.number||t.episode||t.ep||n+1,title:t.title||t.name||`Episode ${n+1}`})):[]:[]}async function Ee(e,s){if(!e){alert("Invalid episode ID");return}const t=Y.value;try{if(y.innerHTML=`
      <h3>Servers for Episode ${s||"?"}</h3>
      <p class="loading-servers" style="padding: 20px; text-align: center; color: var(--accent);">
        <span class="loading-spinner"></span> Loading servers...
      </p>
    `,t==="hianime-scrap"){let i=e,r=s;const a=e.match(/::ep=(\d+)$/);a&&(r=a[1],console.log(`Episode ${r} selected (ID: ${e})`));const d=P(t,"servers",{id:e});console.log("Servers URL:",d);const c=await H(d);bs(c,r||s||"1",e),y.scrollIntoView({behavior:"smooth"});return}if(t==="animepahe"){const i=P(t,"watch",{episodeId:e});console.log("Watch URL:",i);const r=await H(i);He(r,s||"1"),y.scrollIntoView({behavior:"smooth"});return}if(t==="animekai"){const i=P(t,"watch",{episodeId:e});console.log("Watch URL:",i);const r=await H(i);He(r,s||"1"),y.scrollIntoView({behavior:"smooth"});return}const n=P(t,"servers",{id:e});console.log("Servers URL:",n);const o=await H(n);He(o,s||"1"),y.scrollIntoView({behavior:"smooth"})}catch(n){console.error("Servers error:",n),y.innerHTML=`<p class="error">Error loading servers: ${n.message}. Try a different episode.</p>`}}window.selectAnime=hs;window.selectEpisode=Ee;function Ce(e,s){var h;console.log("Displaying anime details:",e),ge=e.id||null;const t=e.title||s||"Unknown Title";window.currentAnimeTitle=s||t;const n=e.image||e.poster||e.coverImage||"https://via.placeholder.com/200x300",o=e.japaneseTitle||e.jname||"",i=e.type||e.format||"Unknown",r=e.status||"",a=e.genres||(e.genre?[e.genre]:[]),d=e.totalEpisodes||e.episodeCount||((h=e.episodes)==null?void 0:h.length)||"Unknown",c=e.description||e.synopsis||"No description available",p=e.url||e.animeUrl||"";ee.innerHTML=`
    <div class="anime-details">
      <div class="anime-header">
        <img src="${n}" alt="${t}" onerror="this.src='https://via.placeholder.com/200x300'">
        <div class="anime-info">
          <h2>${t}</h2>
          ${o?`<p><strong>Japanese:</strong> ${o}</p>`:""}
          <p><strong>Type:</strong> ${i}</p>
          ${r?`<p><strong>Status:</strong> ${r}</p>`:""}
          ${a.length>0?`<p><strong>Genres:</strong> ${a.join(", ")}</p>`:""}
          <p><strong>Episodes:</strong> ${d}</p>
          <p><strong>Description:</strong> ${c}</p>
          ${p?`<p><a href="${p}" target="_blank" rel="noopener noreferrer" class="watch-link">View on Provider →</a></p>`:""}
        </div>
      </div>
    </div>
  `,ee.scrollIntoView({behavior:"smooth"}),e.episodes&&e.episodes.length>0?(F=e.episodes,gs(e.episodes)):(fe.innerHTML="<p>No episodes available</p>",F=[]),y.innerHTML=""}function gs(e){fe.innerHTML="<h3>Episodes</h3>";const s=e.map((t,n)=>{const o=t.number||t.episode||t.ep||n+1,i=t.title||t.name||"",r=t.id||`${n+1}`,a=t.isFiller,d=a?'<span style="color:#ffcc00;font-size:0.7em;"> ★Filler</span>':"";return`
      <button 
        class="episode-btn ${a?"filler":""}" 
        onclick="selectEpisode('${String(r).replace(/'/g,"\\'")}', '${o}')"
        title="${i}${a?" (Filler)":""}"
      >
        ${o}${d}
        ${i?`<br><small style="font-size:0.7em">${i.substring(0,20)}${i.length>20?"...":""}</small>`:""}
      </button>
    `}).join("");fe.innerHTML+=`<div class="episodes-grid">${s}</div>`}function bs(e,s,t){const n=te();if(y.innerHTML=`
    <div class="player-toggle-header">
      <h3>Servers for Episode ${s}</h3>
      <div class="player-toggle">
        <span class="toggle-custom">🎬 Custom</span>
        <label class="toggle-switch" onclick="handlePlayerToggle()">
          <input type="checkbox" id="playerToggle" ${n?"checked":""}>
          <span class="toggle-slider"></span>
        </label>
        <span class="toggle-default">🌐 Default</span>
      </div>
    </div>
  `,!e||!e.success||!e.data){y.innerHTML+="<p>No servers available for this episode. Try a different episode.</p>";return}const o=e.data,i=o.sub||[],r=o.dub||[],a=o.raw||[];if(i.length===0&&r.length===0&&a.length===0){y.innerHTML+="<p>No servers available for this episode. Try a different episode.</p>";return}window.hianimeScrapServerData={episodeId:t,sub:i,dub:r,raw:a};let d='<div class="servers-tabs">';d+=`<div class="server-tab ${i.length>0?"active":""}" onclick="showHianimeScrapServers('sub')">Sub (${i.length})</div>`,d+=`<div class="server-tab ${i.length===0&&r.length>0?"active":""}" onclick="showHianimeScrapServers('dub')">Dub (${r.length})</div>`,d+=`<div class="server-tab ${i.length===0&&r.length===0&&a.length>0?"active":""}" onclick="showHianimeScrapServers('raw')">Raw (${a.length})</div>`,d+="</div>",d+='<div id="hianimeScrapServersList" class="servers-list"></div>',y.innerHTML+=d,i.length>0?showHianimeScrapServers("sub"):r.length>0?showHianimeScrapServers("dub"):showHianimeScrapServers("raw")}window.showHianimeScrapServers=function(e){const s=document.getElementById("hianimeScrapServersList");if(!s||!window.hianimeScrapServerData)return;document.querySelectorAll(".server-tab").forEach(n=>{n.classList.remove("active"),n.textContent.toLowerCase().includes(e)&&n.classList.add("active")});const t=window.hianimeScrapServerData[e]||[];if(t.length===0){s.innerHTML=`<p>No ${e} servers available.</p>`;return}s.innerHTML=t.map(n=>{const o=n.name||`Server ${n.index||""}`,i=n.id,r=e;return`
      <div class="server-option">
        <strong>${o}</strong>
        <p>Type: ${r.charAt(0).toUpperCase()+r.slice(1)}</p>
        <p><button class="play-btn" onclick="playHianimeScrapStream('${i}', '${r}', '${o.replace(/'/g,"\\'")}')">▶ Play</button></p>
      </div>
    `}).join("")};window.playHianimeScrapStream=async function(e,s,t){if(!window.hianimeScrapServerData)return alert("No server data available");const n=window.hianimeScrapServerData.episodeId,o=P("hianime-scrap","stream",{id:n,type:s,server:t});console.log("Stream URL:",o);try{let i=y.querySelector(".stream-loading");i||(i=document.createElement("p"),i.className="stream-loading",i.innerHTML='<span class="loading-spinner"></span> Loading stream...',i.style.cssText="padding: 20px; text-align: center; color: var(--accent);",y.prepend(i));const r=await H(o);if(i&&i.parentNode&&i.parentNode.removeChild(i),r&&r.success&&r.data)ys(r.data,t);else{let a=y.querySelector(".stream-error");a||(a=document.createElement("p"),a.className="stream-error error",a.textContent="Failed to load stream. Try a different server.",y.prepend(a))}}catch(i){console.error("Stream error:",i);const r=y.querySelector(".stream-loading");r&&r.parentNode&&r.parentNode.removeChild(r);let a=y.querySelector(".stream-error");a||(a=document.createElement("p"),a.className="stream-error error",a.textContent=`Error loading stream: ${i.message}`,y.prepend(a))}};function ys(e,s){var C,k,g,M,b;const t=((C=e.link)==null?void 0:C.file)||((k=e.link)==null?void 0:k.directUrl)||"",n=e.tracks||[],o=e.intro||{start:0,end:0},i=e.outro||{start:0,end:0},r=te();if(!t){if(!y.querySelector(".stream-error")){const x=document.createElement("p");x.className="stream-error error",x.textContent="No video URL available",y.prepend(x)}return}const a=document.getElementById("customVideoPlayer");a&&a.remove();const d=document.getElementById("defaultVideoPlayer");d&&d.remove();let c=document.getElementById("videoPlayer");c||(c=document.createElement("div"),c.id="videoPlayer",c.className="video-player-section",c.style.marginBottom="20px"),y.prepend(c);let p="";if((o.start!==0||o.end!==0)&&(p+=`<p style="color:#ffcc00;">Skip intro: ${o.start}s - ${o.end}s</p>`),(i.start!==0||i.end!==0)&&(p+=`<p style="color:#ffcc00;">Skip outro: ${i.start}s - ${i.end}s</p>`),window.currentAnimeTitle=s||window.currentAnimeTitle,c.innerHTML=`
    <h3>Now Playing: ${s}</h3>
    ${p}
  `,r){const v=kt({videoUrl:t,title:s,tracks:n,intro:o,outro:i});c.appendChild(v),B=Lt(v,{videoUrl:t})}else{const v=wt({videoUrl:t,title:s});c.appendChild(v),B=St(v,{videoUrl:t})}const h=((g=window.hianimeScrapServerData)==null?void 0:g.currentEpisodeIndex)??-1,w=((M=window.hianimeScrapServerData)==null?void 0:M.totalEpisodes)??0;B&&((b=window.hianimeScrapServerData)!=null&&b.episodes)&&B.setEpisodeCallbacks(h>0?()=>{const v=window.hianimeScrapServerData.episodes[h-1];v&&(v.id||`${window.hianimeScrapServerData.animeId}${v.number}`,window.hianimeScrapServerData.currentEpisodeIndex=h-1,playHianimeScrapStream(v.id,window.hianimeScrapServerData.currentServerType||"sub",v.name||`Episode ${v.number}`))}:null,h<w-1?()=>{const v=window.hianimeScrapServerData.episodes[h+1];v&&(v.id||`${window.hianimeScrapServerData.animeId}${v.number}`,window.hianimeScrapServerData.currentEpisodeIndex=h+1,playHianimeScrapStream(v.id,window.hianimeScrapServerData.currentServerType||"sub",v.name||`Episode ${v.number}`))}:null)}function He(e,s){const t=te();y.innerHTML=`
    <div class="player-toggle-header">
      <h3>Servers for Episode ${s}</h3>
      <div class="player-toggle">
        <span class="toggle-custom">🎬 Custom</span>
        <label class="toggle-switch" onclick="handlePlayerToggle()">
          <input type="checkbox" id="playerToggle" ${t?"checked":""}>
          <span class="toggle-slider"></span>
        </label>
        <span class="toggle-default">🌐 Default</span>
      </div>
    </div>
  `;let n=[];if(Array.isArray(e)?n=e:e&&e.servers&&Array.isArray(e.servers)?n=e.servers:e&&e.sources&&Array.isArray(e.sources)?n=e.sources:e&&e.data&&Array.isArray(e.data)?n=e.data:e&&e.streamingServers&&Array.isArray(e.streamingServers)&&(n=e.streamingServers),n.length===0){y.innerHTML+="<p>No servers available for this episode. Try a different episode.</p>";return}let o='<div class="servers-list">';n.forEach((i,r)=>{const a=i.name||i.serverName||i.quality||`Server ${r+1}`,d=i.url||i.file||i.src||i.streamUrl||"";if(o+=`
      <div class="server-option">
        <strong>${a}</strong>
    `,d){const c=`${rt}/fetch?url=${encodeURIComponent(d)}`;o+=`
        <p><a href="${d}" target="_blank" rel="noopener noreferrer">Open Original</a></p>
        <p><a href="${c}" target="_blank" rel="noopener noreferrer">Open via Proxy</a></p>
        <p><button class="play-btn" onclick="playStream('${c.replace(/'/g,"\\'")}', '${a.replace(/'/g,"\\'")}')">▶ Play</button></p>
      `,i.sources&&Array.isArray(i.sources)&&i.sources.forEach((p,h)=>{const w=p.url||p.file||p.src||"";if(w){const C=`${rt}/fetch?url=${encodeURIComponent(w)}`,k=p.quality||`Source ${h+1}`;o+=`
              <hr style="margin: 10px 0; border-color: rgba(233,69,96,0.3);">
              <p><strong>${k}</strong></p>
              <p><a href="${w}" target="_blank" rel="noopener noreferrer">Open Original</a></p>
              <p><a href="${C}" target="_blank" rel="noopener noreferrer">Open via Proxy</a></p>
              <p><button class="play-btn" onclick="playStream('${C}')">▶ Play</button></p>
            `}})}else o+="<p>No direct URL available</p>";(i.intro||i.outro)&&(o+='<p class="meta">',i.intro&&(o+=`Intro: ${i.intro.start}-${i.intro.end}s `),i.outro&&(o+=`Outro: ${i.outro.start}-${i.outro.end}s`),o+="</p>"),o+="</div>"}),o+="</div>",y.innerHTML+=o}window.playStream=async function(e,s){if(!e)return alert("No stream URL available");console.log("Playing stream:",e);const t=te(),n=document.getElementById("customVideoPlayer");n&&n.remove();const o=document.getElementById("defaultVideoPlayer");o&&o.remove();let i=document.getElementById("videoPlayer");if(i||(i=document.createElement("div"),i.id="videoPlayer",i.className="video-player-section",i.style.marginBottom="20px"),y.prepend(i),window.currentAnimeTitle=s||window.currentAnimeTitle,i.innerHTML=`<h3>Now Playing: ${s}</h3>`,t){const a=kt({videoUrl:e,title:s,tracks:[],intro:{},outro:{}});i.appendChild(a),B=Lt(a,{videoUrl:e})}else{const a=wt({videoUrl:e,title:s});i.appendChild(a),B=St(a,{videoUrl:e})}const r=F.findIndex(a=>{var p,h;const d=a.number||a.episode||a.ep||0,c=parseInt(((h=(p=document.querySelector(".episode-btn.active"))==null?void 0:p.textContent)==null?void 0:h.trim())||"0");return d===c});B&&F.length>0&&B.setEpisodeCallbacks(r>0?()=>{const a=F[r-1];if(a){const d=a.id||`${ge}-episode-${a.number||r}`,c=a.number||a.episode||a.ep||r;Ee(d,String(c))}}:null,r<F.length-1?()=>{const a=F[r+1];if(a){const d=a.id||`${ge}-episode-${a.number||r+2}`,c=a.number||a.episode||a.ep||r+2;Ee(d,String(c))}}:null)};Ot.addEventListener("click",Ne);K.addEventListener("keypress",e=>{e.key==="Enter"&&Ne()});Y.addEventListener("change",()=>{Z.innerHTML="",ee.innerHTML="",fe.innerHTML="",y.innerHTML="",ge=null,F=[],$=null});document.getElementById("homeBtn").addEventListener("click",Re);document.getElementById("searchNavBtn").addEventListener("click",we);document.addEventListener("DOMContentLoaded",()=>{Re()});
