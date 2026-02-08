/**
 * Smooth Video Player JavaScript
 * Optimizations for smoother playback experience
 */

// ============================================
// SMOOTH PROGRESS BAR UPDATE (requestAnimationFrame)
// ============================================

let progressAnimationFrame = null;
let bufferedAnimationFrame = null;

function startSmoothProgressUpdate(video, progressBar, currentTimeEl, durationEl) {
  stopSmoothProgressUpdate();
  
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const updateProgress = () => {
    if (!video || !progressBar) return;
    
    const duration = video.duration;
    if (!duration || !isFinite(duration)) {
      progressAnimationFrame = requestAnimationFrame(updateProgress);
      return;
    }
    
    const currentTime = video.currentTime;
    const percent = (currentTime / duration) * 100;
    
    // Use CSS custom property for smooth updates
    progressBar.style.setProperty('--progress', `${percent}%`);
    progressBar.style.width = `${percent}%`;
    
    // Update time display
    if (currentTimeEl) {
      currentTimeEl.textContent = formatTime(currentTime);
    }
    if (durationEl) {
      durationEl.textContent = formatTime(duration);
    }
    
    progressAnimationFrame = requestAnimationFrame(updateProgress);
  };
  
  progressAnimationFrame = requestAnimationFrame(updateProgress);
}

function stopSmoothProgressUpdate() {
  if (progressAnimationFrame) {
    cancelAnimationFrame(progressAnimationFrame);
    progressAnimationFrame = null;
  }
}

// ============================================
// SMOOTH BUFFERED BAR UPDATE
// ============================================

function startBufferedUpdate(video, bufferedBar) {
  stopBufferedUpdate();
  
  const updateBuffered = () => {
    if (!video || !bufferedBar) return;
    
    if (video.buffered && video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const duration = video.duration;
      
      if (duration && isFinite(duration)) {
        const percent = (bufferedEnd / duration) * 100;
        bufferedBar.style.setProperty('--buffered', `${percent}%`);
        bufferedBar.style.width = `${percent}%`;
      }
    }
    
    bufferedAnimationFrame = requestAnimationFrame(updateBuffered);
  };
  
  bufferedAnimationFrame = requestAnimationFrame(updateBuffered);
}

function stopBufferedUpdate() {
  if (bufferedAnimationFrame) {
    cancelAnimationFrame(bufferedAnimationFrame);
    bufferedAnimationFrame = null;
  }
}

// ============================================
// SMOOTH SEEK ANIMATION
// ============================================

let seekAnimationFrame = null;

function smoothSeek(video, targetTime, progressBar, duration) {
  if (!video) return;
  
  const startTime = video.currentTime;
  const seekDuration = 300; // ms for smooth seek animation
  const startTimeStamp = performance.now();
  
  // Add seeking class for visual feedback
  if (progressBar) {
    progressBar.classList.add('seeking');
  }
  
  function animateSeek(currentTime) {
    const elapsed = currentTime - startTimeStamp;
    const progress = Math.min(elapsed / seekDuration, 1);
    
    // Use easing function for smooth seek
    const eased = easeOutCubic(progress);
    
    const newTime = startTime + (targetTime - startTime) * eased;
    video.currentTime = Math.max(0, Math.min(newTime, duration || video.duration));
    
    if (progress < 1) {
      seekAnimationFrame = requestAnimationFrame(animateSeek);
    } else {
      // Seek complete
      if (progressBar) {
        progressBar.classList.remove('seeking');
      }
      video.currentTime = targetTime; // Ensure exact final position
    }
  }
  
  if (seekAnimationFrame) {
    cancelAnimationFrame(seekAnimationFrame);
  }
  
  seekAnimationFrame = requestAnimationFrame(animateSeek);
}

// Easing function for smooth animations
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ============================================
// SMOOTH CONTROLS AUTO-HIDE
// ============================================

let controlsTimeout = null;
let controlsHideAnimationFrame = null;

function showControlsSmooth(playerElement) {
  if (!playerElement) return;
  
  // Clear any existing hide timeout
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  
  // Add show-controls class
  playerElement.classList.add('show-controls');
  playerElement.classList.remove('hide-cursor');
  
  // Set auto-hide timeout (longer for smoother experience)
  const autoHideDelay = playerElement.classList.contains('playing') ? 4000 : 5000;
  
  controlsTimeout = setTimeout(() => {
    if (playerElement.classList.contains('playing')) {
      playerElement.classList.remove('show-controls');
      playerElement.classList.add('hide-cursor');
    }
  }, autoHideDelay);
}

function hideControlsSmooth(playerElement) {
  if (!playerElement) return;
  
  playerElement.classList.remove('show-controls');
  playerElement.classList.add('hide-cursor');
}

// ============================================
// SMOOTH VOLUME CHANGE
// ============================================

let volumeAnimationFrame = null;

function setVolumeSmooth(video, targetVolume, volumeSlider, volumeBtn, duration = 150) {
  if (!video) return;
  
  const startVolume = video.volume;
  const startTime = performance.now();
  
  // Cancel any ongoing volume animation
  if (volumeAnimationFrame) {
    cancelAnimationFrame(volumeAnimationFrame);
  }
  
  function animateVolume(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    
    const newVolume = startVolume + (targetVolume - startVolume) * eased;
    video.volume = Math.max(0, Math.min(newVolume, 1));
    
    // Update slider if provided
    if (volumeSlider) {
      volumeSlider.value = video.volume;
    }
    
    // Update mute state
    if (video.volume > 0 && video.muted) {
      video.muted = false;
      if (volumeBtn) {
        updateVolumeIcon(volumeBtn, false);
      }
    }
    
    if (progress < 1) {
      volumeAnimationFrame = requestAnimationFrame(animateVolume);
    }
  }
  
  volumeAnimationFrame = requestAnimationFrame(animateVolume);
}

function updateVolumeIcon(volumeBtn, isMuted) {
  if (!volumeBtn) return;
  
  const icons = {
    volumeHigh: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
    volumeMute: '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>'
  };
  
  volumeBtn.innerHTML = isMuted ? icons.volumeMute : icons.volumeHigh;
}

// ============================================
// SMOOTH SUBTITLE FADE
// ============================================

let subtitleFadeFrame = null;

function showSubtitleSmooth(subtitleContainer, subtitleText) {
  if (!subtitleContainer || !subtitleText) return;
  
  subtitleContainer.classList.add('visible');
  
  // Smooth fade-in effect
  subtitleText.style.opacity = '0';
  subtitleText.style.transform = 'translateY(10px)';
  
  // Trigger reflow
  void subtitleText.offsetWidth;
  
  subtitleText.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out';
  subtitleText.style.opacity = '1';
  subtitleText.style.transform = 'translateY(0)';
}

function hideSubtitleSmooth(subtitleContainer, subtitleText) {
  if (!subtitleContainer || !subtitleText) return;
  
  subtitleText.style.transition = 'opacity 0.1s ease-in, transform 0.1s ease-in';
  subtitleText.style.opacity = '0';
  subtitleText.style.transform = 'translateY(5px)';
  
  setTimeout(() => {
    subtitleContainer.classList.remove('visible');
  }, 100);
}

// ============================================
// SMOOTH PLAY/PAUSE TOGGLE
// ============================================

function togglePlaySmooth(video, playBtn, playerElement) {
  if (!video) return;
  
  if (video.paused) {
    video.play().catch(() => {});
    playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    playerElement.classList.add('playing');
    
    // Add smooth animation class
    playBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
      playBtn.style.transform = '';
    }, 150);
  } else {
    video.pause();
    playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    playerElement.classList.remove('playing');
    
    // Add smooth animation class
    playBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      playBtn.style.transform = '';
    }, 100);
  }
}

// ============================================
// SMOOTH FULLSCREEN TOGGLE
// ============================================

function toggleFullscreenSmooth(playerElement) {
  if (!playerElement) return;
  
  if (!document.fullscreenElement && 
      !document.webkitFullscreenElement && 
      !document.mozFullScreenElement) {
    
    // Enter fullscreen with smooth transition
    playerElement.style.transition = 'transform 0.3s ease-out';
    
    playerElement.requestFullscreen?.() || 
    playerElement.webkitRequestFullscreen?.() || 
    playerElement.mozRequestFullScreen?.();
    
    playerElement.classList.add('is-fullscreen');
  } else {
    // Exit fullscreen
    document.exitFullscreen?.() || 
    document.webkitExitFullscreen?.() || 
    document.mozCancelFullScreen?.();
    
    playerElement.classList.remove('is-fullscreen');
  }
}

// ============================================
// SMOOTH PLAYBACK SPEED CHANGE
// ============================================

let speedAnimationFrame = null;

function setPlaybackRateSmooth(video, targetRate, duration = 200) {
  if (!video) return;
  
  const startRate = video.playbackRate;
  const startTime = performance.now();
  
  if (speedAnimationFrame) {
    cancelAnimationFrame(speedAnimationFrame);
  }
  
  function animateRate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    
    const newRate = startRate + (targetRate - startRate) * eased;
    video.playbackRate = newRate;
    
    if (progress < 1) {
      speedAnimationFrame = requestAnimationFrame(animateRate);
    } else {
      video.playbackRate = targetRate;
    }
  }
  
  speedAnimationFrame = requestAnimationFrame(animateRate);
}

// ============================================
// SMOOTH SKIP ANIMATION
// ============================================

let skipAnimationFrame = null;

function skipVideoSmooth(video, seconds, duration = 150) {
  if (!video) return;
  
  const startTime = video.currentTime;
  const targetTime = Math.max(0, Math.min(startTime + seconds, video.duration || Infinity));
  const startTimeStamp = performance.now();
  
  // Show skip indicator
  showSkipIndicator(video.parentElement, seconds);
  
  function animateSkip(currentTime) {
    const elapsed = currentTime - startTimeStamp;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    
    video.currentTime = startTime + (targetTime - startTime) * eased;
    
    if (progress < 1) {
      skipAnimationFrame = requestAnimationFrame(animateSkip);
    } else {
      video.currentTime = targetTime;
    }
  }
  
  if (skipAnimationFrame) {
    cancelAnimationFrame(skipAnimationFrame);
  }
  
  skipAnimationFrame = requestAnimationFrame(animateSkip);
}

function showSkipIndicator(playerContainer, seconds) {
  if (!playerContainer) return;
  
  let indicator = playerContainer.querySelector('.skip-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'skip-indicator';
    indicator.innerHTML = `
      <span class="skip-indicator-icon">${seconds > 0 ? '⏩' : '⏪'}</span>
      <span class="skip-indicator-text">${Math.abs(seconds)}s</span>
    `;
    indicator.style.cssText = `
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
    `;
    playerContainer.appendChild(indicator);
  }
  
  indicator.style.opacity = '1';
  indicator.style.transform = 'translate(-50%, -50%) scale(1)';
  
  setTimeout(() => {
    indicator.style.opacity = '0';
    indicator.style.transform = 'translate(-50%, -50%) scale(0.5)';
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    }, 300);
  }, 500);
}

// ============================================
// SMOOTH LOADING STATE
// ============================================

function showLoadingSmooth(loadingOverlay) {
  if (!loadingOverlay) return;
  
  loadingOverlay.classList.remove('hidden');
  loadingOverlay.style.opacity = '0';
  loadingOverlay.style.transform = 'scale(0.95)';
  
  requestAnimationFrame(() => {
    loadingOverlay.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    loadingOverlay.style.opacity = '1';
    loadingOverlay.style.transform = 'scale(1)';
  });
}

function hideLoadingSmooth(loadingOverlay) {
  if (!loadingOverlay) return;
  
  loadingOverlay.style.transition = 'opacity 0.25s ease-in, transform 0.25s ease-in';
  loadingOverlay.style.opacity = '0';
  loadingOverlay.style.transform = 'scale(0.95)';
  
  setTimeout(() => {
    loadingOverlay.classList.add('hidden');
    loadingOverlay.style.transform = '';
  }, 250);
}

// ============================================
// SMOOTH ERROR STATE
// ============================================

function showErrorSmooth(errorOverlay) {
  if (!errorOverlay) return;
  
  errorOverlay.classList.remove('hidden');
  errorOverlay.style.opacity = '0';
  errorOverlay.style.transform = 'scale(0.95)';
  
  requestAnimationFrame(() => {
    errorOverlay.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    errorOverlay.style.opacity = '1';
    errorOverlay.style.transform = 'scale(1)';
  });
}

// ============================================
// SMOOTH SETTINGS MENU
// ============================================

function showSettingsMenuSmooth(menu) {
  if (!menu) return;
  
  menu.classList.add('visible');
  menu.style.transform = 'translateY(10px) scale(0.98)';
  menu.style.opacity = '0';
  
  requestAnimationFrame(() => {
    menu.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.3s ease-out';
    menu.style.transform = 'translateY(0) scale(1)';
    menu.style.opacity = '1';
  });
}

function hideSettingsMenuSmooth(menu) {
  if (!menu) return;
  
  menu.style.transition = 'transform 0.2s ease-in, opacity 0.2s ease-in';
  menu.style.transform = 'translateY(10px) scale(0.98)';
  menu.style.opacity = '0';
  
  setTimeout(() => {
    menu.classList.remove('visible');
    menu.style.transform = '';
    menu.style.opacity = '';
  }, 200);
}

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

// Throttle function for frequent events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Debounce function for delayed events
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Batch DOM updates using requestAnimationFrame
const batchUpdateQueue = [];
let batchScheduled = false;

function queueBatchUpdate(updateFn) {
  batchUpdateQueue.push(updateFn);
  
  if (!batchScheduled) {
    batchScheduled = true;
    requestAnimationFrame(() => {
      batchUpdateQueue.forEach(fn => fn());
      batchUpdateQueue.length = 0;
      batchScheduled = false;
    });
  }
}

// ============================================
// INITIALIZE SMOOTH PLAYER
// ============================================

function initSmoothPlayer(playerElement, options = {}) {
  const video = playerElement?.querySelector('#customVideo');
  const loadingOverlay = playerElement?.querySelector('.player-loading');
  const errorOverlay = playerElement?.querySelector('.player-error');
  const progressBar = playerElement?.querySelector('.progress-bar');
  const bufferedBar = playerElement?.querySelector('.buffered-bar');
  const playBtn = playerElement?.querySelector('.play-btn-main');
  const volumeBtn = playerElement?.querySelector('.volume-btn');
  const volumeSlider = playerElement?.querySelector('.volume-slider');
  const timeDisplay = playerElement?.querySelector('.time-display');
  const currentTimeEl = timeDisplay?.querySelector('.current-time');
  const durationEl = timeDisplay?.querySelector('.duration');
  const progressContainer = playerElement?.querySelector('.progress-container');
  const subtitleContainer = playerElement?.querySelector('.subtitle-container');
  const subtitleText = subtitleContainer?.querySelector('.subtitle-text');
  const settingsMenu = playerElement?.querySelector('.settings-menu');
  const settingsBtn = playerElement?.querySelector('.settings-btn');
  
  if (!video || !playerElement) return null;
  
  // Event listeners for smooth updates
  video.addEventListener('loadedmetadata', () => {
    if (durationEl) {
      const formatTime = (seconds) => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };
      durationEl.textContent = formatTime(video.duration);
    }
    hideLoadingSmooth(loadingOverlay);
  });
  
  video.addEventListener('play', () => {
    playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    playerElement.classList.add('playing');
    startSmoothProgressUpdate(video, progressBar, currentTimeEl, durationEl);
    startBufferedUpdate(video, bufferedBar);
  });
  
  video.addEventListener('pause', () => {
    playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    playerElement.classList.remove('playing');
    stopSmoothProgressUpdate();
    stopBufferedUpdate();
  });
  
  video.addEventListener('waiting', () => showLoadingSmooth(loadingOverlay));
  video.addEventListener('canplay', () => hideLoadingSmooth(loadingOverlay));
  video.addEventListener('error', () => showErrorSmooth(errorOverlay));
  
  // Mouse movement for controls visibility
  playerElement.addEventListener('mousemove', () => showControlsSmooth(playerElement));
  playerElement.addEventListener('mouseleave', () => {
    if (playerElement.classList.contains('playing')) {
      hideControlsSmooth(playerElement);
    }
  });
  
  // Click to toggle play
  video.addEventListener('click', () => togglePlaySmooth(video, playBtn, playerElement));
  playBtn.addEventListener('click', () => togglePlaySmooth(video, playBtn, playerElement));
  
  // Volume control with smooth transition
  volumeBtn.addEventListener('click', () => {
    if (video.muted) {
      video.muted = false;
      setVolumeSmooth(video, volumeSlider?.value || 1, volumeSlider, volumeBtn);
    } else {
      video.muted = true;
      setVolumeSmooth(video, 0, volumeSlider, volumeBtn);
    }
  });
  
  volumeSlider?.addEventListener('input', (e) => {
    setVolumeSmooth(video, e.target.value, volumeSlider, volumeBtn, 100);
  });
  
  // Progress bar click with smooth seek
  progressContainer?.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const targetTime = pos * video.duration;
    smoothSeek(video, targetTime, progressBar, video.duration);
  });
  
  // Settings menu toggle
  settingsBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (settingsMenu.classList.contains('visible')) {
      hideSettingsMenuSmooth(settingsMenu);
    } else {
      showSettingsMenuSmooth(settingsMenu);
    }
  });
  
  // Click outside to close settings
  playerElement?.addEventListener('click', (e) => {
    if (!e.target.closest('.settings-wrapper')) {
      hideSettingsMenuSmooth(settingsMenu);
    }
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (!playerElement.isConnected) return;
    if (e.target.tagName === 'INPUT') return;
    
    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        togglePlaySmooth(video, playBtn, playerElement);
        break;
      case 'm':
        e.preventDefault();
        if (video.muted) {
          video.muted = false;
          setVolumeSmooth(video, volumeSlider?.value || 1, volumeSlider, volumeBtn);
        } else {
          video.muted = true;
          setVolumeSmooth(video, 0, volumeSlider, volumeBtn);
        }
        break;
      case 'f':
        e.preventDefault();
        toggleFullscreenSmooth(playerElement);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        skipVideoSmooth(video, -5);
        break;
      case 'ArrowRight':
        e.preventDefault();
        skipVideoSmooth(video, 5);
        break;
      case 'j':
        skipVideoSmooth(video, -10);
        break;
      case 'l':
        skipVideoSmooth(video, 10);
        break;
    }
  });
  
  // Fullscreen change handler
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      playerElement.classList.remove('is-fullscreen');
    }
  });
  
  return {
    element: playerElement,
    video,
    loadVideo: (url) => {
      showLoadingSmooth(loadingOverlay);
      hideErrorSmooth(errorOverlay);
      
      // Smooth HLS initialization
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (window.Hls) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          hideLoadingSmooth(loadingOverlay);
        });
        hls.on(window.Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            showErrorSmooth(errorOverlay);
          }
        });
      }
    },
    setEpisodeCallbacks: options.setEpisodeCallbacks
  };
}

// Export functions for use in main.js
window.smoothPlayer = {
  initSmoothPlayer,
  startSmoothProgressUpdate,
  stopSmoothProgressUpdate,
  startBufferedUpdate,
  stopBufferedUpdate,
  smoothSeek,
  setVolumeSmooth,
  showSubtitleSmooth,
  hideSubtitleSmooth,
  togglePlaySmooth,
  toggleFullscreenSmooth,
  setPlaybackRateSmooth,
  skipVideoSmooth,
  showLoadingSmooth,
  hideLoadingSmooth,
  showSettingsMenuSmooth,
  hideSettingsMenuSmooth,
  showControlsSmooth,
  hideControlsSmooth,
  throttle,
  debounce,
  queueBatchUpdate
};

