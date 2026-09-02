(function () {
  "use strict";

  var desktopMedia = window.matchMedia("(min-width: 769px)");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function afterCriticalRender(callback) {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(callback, { timeout: 1200 });
        } else {
          window.setTimeout(callback, 150);
        }
      });
    });
  }

  function releaseVideo(video) {
    video.pause();
    if (video.hasAttribute("src")) {
      video.removeAttribute("src");
      video.load();
    }
    video.dataset.loaded = "false";
  }

  function loadDesktopHeroes() {
    var videos = document.querySelectorAll("video[data-desktop-src]");

    if (!desktopMedia.matches || reducedMotion.matches) {
      videos.forEach(releaseVideo);
      return;
    }

    videos.forEach(function (video) {
      if (video.dataset.loaded === "true") return;
      video.src = video.dataset.desktopSrc;
      video.dataset.loaded = "true";
      video.load();
      var playAttempt = video.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(function () {});
      }
    });
  }

  function setupDeferredMotion() {
    var videos = document.querySelectorAll("video[data-motion-src]");
    if (!videos.length || reducedMotion.matches) return;

    if (!("IntersectionObserver" in window)) {
      videos.forEach(function (video) {
        video.src = video.dataset.motionSrc;
        video.load();
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting) {
          if (video.dataset.loaded !== "true") {
            video.src = video.dataset.motionSrc;
            video.dataset.loaded = "true";
            video.load();
          }
          var playAttempt = video.play();
          if (playAttempt && typeof playAttempt.catch === "function") {
            playAttempt.catch(function () {});
          }
        } else {
          video.pause();
        }
      });
    }, { rootMargin: "300px 0px", threshold: 0.01 });

    videos.forEach(function (video) {
      observer.observe(video);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    afterCriticalRender(loadDesktopHeroes);
    setupDeferredMotion();
  });

  if (typeof desktopMedia.addEventListener === "function") {
    desktopMedia.addEventListener("change", function () {
      afterCriticalRender(loadDesktopHeroes);
    });
    reducedMotion.addEventListener("change", function () {
      afterCriticalRender(loadDesktopHeroes);
    });
  }
})();
