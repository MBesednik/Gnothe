/* ============================================
   iOS Video Playback Fix
   Osigurava da se video prikazuje na iPhone/iPad
============================================ */

(function() {
  'use strict';

  // Funkcija za detekciju iOS uređaja
  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  // Funkcija za pokretanje video elementa
  function playVideo(video) {
    if (!video) return;

    // iOS Safari fix - mora biti muted da bi auto-play radio
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    // Pokušaj playback
    var playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.then(function() {
        console.log('Video playback started successfully');
      }).catch(function(error) {
        console.warn('Video autoplay prevented:', error);

        // Fallback: pokušaj ponovo nakon user interakcije
        document.addEventListener('touchstart', function playOnTouch() {
          video.play().then(function() {
            console.log('Video playback started after touch');
          }).catch(function(err) {
            console.error('Video playback failed:', err);
          });
          // Remove listener nakon prvog touch-a
          document.removeEventListener('touchstart', playOnTouch);
        }, { once: true });
      });
    }
  }

  // Funkcija za inicijalizaciju svih video elemenata
  function initVideos() {
    var videos = document.querySelectorAll('video[autoplay]');

    if (videos.length === 0) {
      console.log('No autoplay videos found');
      return;
    }

    console.log('Found ' + videos.length + ' autoplay video(s)');

    videos.forEach(function(video) {
      // Osiguraj da je video muted (iOS requirement)
      video.muted = true;
      video.playsInline = true;

      // Load video data
      if (video.readyState < 3) {
        video.load();
      }

      // Event listener za kada je video spreman
      video.addEventListener('loadeddata', function() {
        console.log('Video data loaded, attempting playback');
        playVideo(video);
      });

      // iOS specific: pokušaj play nakon metadata load-a
      video.addEventListener('loadedmetadata', function() {
        if (isIOS()) {
          console.log('iOS detected, forcing video attributes');
          video.setAttribute('playsinline', 'true');
          video.setAttribute('webkit-playsinline', 'true');
          video.setAttribute('muted', 'true');
          playVideo(video);
        }
      });

      // Ako je video već loaded, pokreni ga odmah
      if (video.readyState >= 3) {
        console.log('Video already loaded, playing immediately');
        playVideo(video);
      }
    });
  }

  // Pokreni kada je DOM spreman
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideos);
  } else {
    // DOM je već spreman
    initVideos();
  }

  // Fallback: pokušaj ponovo nakon window load-a
  window.addEventListener('load', function() {
    var videos = document.querySelectorAll('video[autoplay]');
    videos.forEach(function(video) {
      if (video.paused) {
        console.log('Video is paused after load, attempting to play');
        playVideo(video);
      }
    });
  });

  // iOS Safari Workaround - force play na scroll (ako je video visible)
  if (isIOS()) {
    var hasScrolled = false;
    window.addEventListener('scroll', function() {
      if (hasScrolled) return;
      hasScrolled = true;

      var videos = document.querySelectorAll('video[autoplay]');
      videos.forEach(function(video) {
        // Check ako je video u viewport-u
        var rect = video.getBoundingClientRect();
        var isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible && video.paused) {
          console.log('Video visible after scroll, attempting play');
          playVideo(video);
        }
      });
    }, { once: true });
  }

})();
