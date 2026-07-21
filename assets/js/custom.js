window.__lc = window.__lc || {};
window.__lc.asyncInit = true;

$(document).ready(function () {

  function loadDeferredImage(image) {
    if (!image || !image.dataset) return;

    if (image.dataset.srcset) {
      image.srcset = image.dataset.srcset;
      image.removeAttribute("data-srcset");
    }

    if (image.dataset.src) {
      image.src = image.dataset.src;
      image.removeAttribute("data-src");
    }
  }

  function loadDeferredVideo(video) {
    if (!video || video.dataset.loaded === "true") return;

    var sources = video.querySelectorAll("source[data-src]");
    sources.forEach(function (source) {
      source.src = source.dataset.src;
      source.removeAttribute("data-src");
    });

    video.dataset.loaded = "true";
    video.load();

    var playPromise = video.play && video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  function setupLazyVideos(selector, rootMargin) {
    var videos = document.querySelectorAll(selector);
    if (!videos.length) return;

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          loadDeferredVideo(entry.target);
          observer.unobserve(entry.target);
        });
      }, { rootMargin: rootMargin || "500px 0px", threshold: 0.01 });

      videos.forEach(function (video) {
        observer.observe(video);
      });
    } else {
      videos.forEach(loadDeferredVideo);
    }
  }

  function loadPopupAssets(modal) {
    if (!modal || modal.dataset.assetsLoaded === "true") return;

    modal.querySelectorAll("img[data-src], img[data-srcset]").forEach(loadDeferredImage);
    modal.dataset.assetsLoaded = "true";
  }

  function loadRecaptchaScript() {
    if (window.grecaptcha || document.querySelector("script[data-flo-recaptcha]")) return;

    var script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    script.setAttribute("data-flo-recaptcha", "true");
    document.head.appendChild(script);
  }

  function queueIdle(callback, delayMs) {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(callback, { timeout: delayMs || 4000 });
    } else {
      setTimeout(callback, delayMs || 3000);
    }
  }

  function runAfterLoad(callback, delayMs) {
    var run = function () {
      queueIdle(callback, delayMs || 2500);
    };

    if (document.readyState === "complete") {
      run();
    } else {
      window.addEventListener("load", run, { once: true });
    }
  }

  function runOnFirstIntent(callback) {
    var fired = false;
    var run = function () {
      if (fired) return;
      fired = true;
      callback();
    };

    window.addEventListener("pointerdown", run, { once: true, passive: true });
    window.addEventListener("keydown", run, { once: true });
    window.addEventListener("scroll", run, { once: true, passive: true });
  }

  function getAssetBase() {
    var currentScript = document.currentScript;
    var scripts = document.getElementsByTagName("script");

    if (!currentScript && scripts.length) {
      for (var i = scripts.length - 1; i >= 0; i -= 1) {
        if ((scripts[i].getAttribute("src") || "").indexOf("custom.js") !== -1) {
          currentScript = scripts[i];
          break;
        }
      }
    }

    var src = currentScript ? currentScript.getAttribute("src") || "" : "";
    return src.replace(/js\/custom\.js(?:\?.*)?$/, "");
  }

  var assetBase = getAssetBase() || "assets/";

  function loadStylesheetOnce(href) {
    if (!href || document.querySelector('link[href="' + href + '"]')) {
      return Promise.resolve();
    }

    return new Promise(function (resolve) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = resolve;
      link.onerror = resolve;
      document.head.appendChild(link);
    });
  }

  function loadScriptOnce(src) {
    var existing = document.querySelector('script[src="' + src + '"]');
    if (existing) {
      return existing.dataset.loaded === "true"
        ? Promise.resolve()
        : new Promise(function (resolve) {
            existing.addEventListener("load", resolve, { once: true });
            existing.addEventListener("error", resolve, { once: true });
          });
    }

    return new Promise(function (resolve) {
      var script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.onload = function () {
        script.dataset.loaded = "true";
        resolve();
      };
      script.onerror = resolve;
      document.body.appendChild(script);
    });
  }

  function whenNear(selector, rootMargin, callback) {
    var targets = document.querySelectorAll(selector);
    if (!targets.length) return;

    var fired = false;
    var run = function () {
      if (fired) return;
      fired = true;
      callback();
    };

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          run();
          observer.disconnect();
        });
      }, { rootMargin: rootMargin || "800px 0px", threshold: 0.01 });

      targets.forEach(function (target) {
        observer.observe(target);
      });
    } else {
      runAfterLoad(run, 3000);
    }
  }

  function initSlickSliders() {
    if (!window.jQuery || !jQuery.fn || !jQuery.fn.slick) return;

    var $heroLogoSlider = $(".hero-logo-slider");
    if ($heroLogoSlider.length) {
      $heroLogoSlider.each(function () {
        var $slider = $(this);

        if ($slider.hasClass("slick-initialized")) return;

        $slider.slick({
          arrows: false,
          dots: false,
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          autoplay: true,
          autoplaySpeed: 0,
          speed: 6500,
          cssEase: "linear",
          pauseOnHover: false,
          responsive: [
            { breakpoint: 769, settings: { slidesToShow: 3 } },
            { breakpoint: 525, settings: { slidesToShow: 2 } }
          ]
        });
      });
    }

    var $testimonialSlider = $(".testimonial-slider");
    if ($testimonialSlider.length) {
      $testimonialSlider.each(function () {
        var $slider = $(this);

        if ($slider.hasClass("slick-initialized")) return;

        $slider.slick({
          arrows: false,
          dots: false,
          centerMode: true,
          centerPadding: "60px",
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          autoplay: true,
          autoplaySpeed: 0,
          speed: 8000,
          cssEase: "linear",
          pauseOnHover: true,
          responsive: [
            { breakpoint: 1025, settings: { centerMode: true, centerPadding: "10px", slidesToShow: 3 } },
            { breakpoint: 769, settings: { arrows: false, centerMode: true, centerPadding: "0px", slidesToShow: 2 } },
            { breakpoint: 525, settings: { arrows: false, centerMode: true, centerPadding: "0px", slidesToShow: 1 } }
          ]
        });
      });
    }
  }

  function initPortfolioSwiper() {
    var portfolioSwiperEl = document.querySelector("section.portfolio .mySwiper");
    if (!portfolioSwiperEl || typeof window.Swiper !== "function" || portfolioSwiperEl.dataset.swiperReady === "true") return;

    portfolioSwiperEl.dataset.swiperReady = "true";

    var mobileMq = window.matchMedia("(max-width: 768px)");
    var swiper = new Swiper("section.portfolio .mySwiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      loop: true,
      loopAdditionalSlides: 2,
      speed: 500,
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      }
    });

    var syncPortfolioAutoplay = function () {
      if (!swiper.autoplay) return;
      if (mobileMq.matches) swiper.autoplay.start();
      else swiper.autoplay.stop();
    };

    syncPortfolioAutoplay();

    if (mobileMq.addEventListener) {
      mobileMq.addEventListener("change", syncPortfolioAutoplay);
    } else if (mobileMq.addListener) {
      mobileMq.addListener(syncPortfolioAutoplay);
    }

    setupDirectionalHover(portfolioSwiperEl, function (direction) {
      if (direction === "next") swiper.slideNext();
      else swiper.slidePrev();
    }, mobileMq, 500);
  }

  function loadCarouselAssets(type) {
    var tasks = [];

    if (type === "swiper") {
      tasks.push(loadStylesheetOnce(assetBase + "css/swiper.min.css"));
      tasks.push(loadScriptOnce(assetBase + "js/swiper.min.js"));
    } else if (type === "slick") {
      tasks.push(loadStylesheetOnce(assetBase + "css/slick-slider.css"));
      tasks.push(loadScriptOnce(assetBase + "js/slick-slider.min.js"));
    }

    return Promise.all(tasks);
  }

  function ensurePopupModal() {
    var existing = document.getElementById("exampleModalCenter");
    if (existing) return Promise.resolve(existing);

    return loadScriptOnce(assetBase + "js/popup-modal.js").then(function () {
      if (!window.FloPopupModalTemplate) return null;

      var wrapper = document.createElement("div");
      var pageBase = assetBase.indexOf("../") === 0 ? "../" : "";
      var modalTemplate = window.FloPopupModalTemplate
        .replace(/\/assets\//g, assetBase)
        .replace(/href="\/privacy-policy\.html"/g, 'href="' + pageBase + 'privacy-policy.html"')
        .replace(/href="\/terms-and-conditions\.html"/g, 'href="' + pageBase + 'terms-and-conditions.html"');

      wrapper.innerHTML = modalTemplate;
      var modal = wrapper.firstElementChild;
      if (!modal) return null;

      document.body.appendChild(modal);
      setupPopupModal(modal);
      return modal;
    });
  }

  function setupPopupModal(modal) {
    if (!modal || modal.dataset.floPopupReady === "true") return;

    modal.dataset.floPopupReady = "true";

    var preparePopup = function () {
      loadPopupAssets(modal);
      loadRecaptchaScript();
    };

    modal.addEventListener("show.bs.modal", preparePopup);
    if (window.jQuery) {
      $(modal).on("show.bs.modal", preparePopup);
    }
  }

  function loadFloLiveChat(openAfterLoad) {
    if (window.LiveChatWidget && typeof window.LiveChatWidget.init === "function") {
      window.LiveChatWidget.init();
    } else if (!document.querySelector("script[data-flo-livechat]")) {
      var script = document.createElement("script");
      script.src = "https://cdn.livechatinc.com/tracking.js";
      script.async = true;
      script.type = "text/javascript";
      script.setAttribute("data-flo-livechat", "true");
      document.head.appendChild(script);
    }

    if (openAfterLoad) {
      var attempts = 0;
      var timer = setInterval(function () {
        attempts += 1;
        if (window.LiveChatWidget && typeof window.LiveChatWidget.call === "function") {
          window.LiveChatWidget.call("maximize");
          clearInterval(timer);
        } else if (attempts > 20) {
          clearInterval(timer);
        }
      }, 250);
    }
  }

  var loadHeroVideos = function () {
    document.querySelectorAll(".flo-hero-video").forEach(loadDeferredVideo);
  };

  runOnFirstIntent(loadHeroVideos);
  runAfterLoad(loadHeroVideos, 3000);
  setupLazyVideos(".flo-lazy-video", "500px 0px");

  var leadForms = document.querySelectorAll(".flo-formspree-ajax-form");
  leadForms.forEach(function (form) {
    form.addEventListener("focusin", loadRecaptchaScript, { once: true });
    form.addEventListener("pointerenter", loadRecaptchaScript, { once: true });
  });

  var popupModal = document.getElementById("exampleModalCenter");
  if (popupModal) {
    setupPopupModal(popupModal);
    document.querySelectorAll('[data-target="#exampleModalCenter"]').forEach(function (trigger) {
      trigger.addEventListener("pointerenter", function () {
        ensurePopupModal().then(function (modal) {
          if (modal) loadPopupAssets(modal);
        });
      }, { once: true });
      trigger.addEventListener("focus", function () {
        ensurePopupModal().then(function (modal) {
          if (modal) loadPopupAssets(modal);
        });
      }, { once: true });
    });
    queueIdle(function () {
      ensurePopupModal().then(function (modal) {
        if (modal) loadPopupAssets(modal);
      });
    }, 18000);
  }

  var shouldAutoShowPopup = window.location.href.indexOf("pay") === -1;
  var autoPopupShown = false;

  function openPopupModal() {
    ensurePopupModal().then(function (modal) {
      if (!modal || !window.jQuery || !jQuery.fn || !jQuery.fn.modal) return;
      loadPopupAssets(modal);
      loadRecaptchaScript();
      $(modal).modal("show");
    });
  }

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest && event.target.closest('[data-toggle="modal"][data-target="#exampleModalCenter"]');
    if (!trigger) return;

    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }

    openPopupModal();
  }, true);

  setTimeout(function () {
    if (autoPopupShown || !shouldAutoShowPopup) return;
    autoPopupShown = true;
    openPopupModal();
  }, 20000);

  var liveChatWarmup = function () {
    loadFloLiveChat(false);
  };
  window.addEventListener("scroll", liveChatWarmup, { once: true, passive: true });
  window.addEventListener("pointermove", liveChatWarmup, { once: true, passive: true });
  setTimeout(liveChatWarmup, 8000);

  window.openFloLiveChat = function () {
    loadFloLiveChat(true);
    if (window.LiveChatWidget && typeof window.LiveChatWidget.call === "function") {
      window.LiveChatWidget.call("maximize");
    }
  };

  window.setButtonURL = window.openFloLiveChat;

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest && event.target.closest("a, button, [role='button']");
    if (!trigger) return;

    var text = (trigger.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    var inlineAction = (trigger.getAttribute("onclick") || "").toLowerCase();
    var isChatTrigger =
      text.indexOf("chat") !== -1 ||
      inlineAction.indexOf("livechatwidget") !== -1 ||
      inlineAction.indexOf("setbuttonurl") !== -1 ||
      trigger.closest(".livechat-btn");

    if (!isChatTrigger) return;

    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }
    window.openFloLiveChat();
  }, true);

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form || !form.classList || !form.classList.contains("flo-formspree-ajax-form")) return;

    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }

    var submitButton = form.querySelector('[type="submit"], button:not([type]), button[type="button"]');
    var originalText = submitButton ? submitButton.textContent : "";
    var successMessage = form.getAttribute("data-success-message") || "Thank You! Your submission has been received";
    var message = form.querySelector(".flo-formspree-message");

    if (!message) {
      message = document.createElement("div");
      message.className = "flo-formspree-message";
      form.appendChild(message);
    }

    message.textContent = "";
    message.classList.remove("is-error");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
      submitButton.classList.remove("flo-formspree-success-button");
      submitButton.style.removeProperty("background");
      submitButton.style.removeProperty("background-color");
      submitButton.style.removeProperty("border-color");
    }

    var recaptcha = form.querySelector(".g-recaptcha-response");
    if (recaptcha && recaptcha.value === "") {
      message.textContent = "Please check the reCAPTCHA and try again.";
      message.classList.add("is-error");
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
      return;
    }

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {
        Accept: "application/json"
      }
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Form submission failed");
        }

        message.textContent = "";
        if (submitButton) {
          submitButton.textContent = successMessage;
          submitButton.classList.add("flo-formspree-success-button");
          submitButton.style.setProperty("background", "#28a745", "important");
          submitButton.style.setProperty("background-color", "#28a745", "important");
          submitButton.style.setProperty("border-color", "#28a745", "important");
          submitButton.style.setProperty("color", "#fff", "important");
        }

        form.reset();
        if (window.grecaptcha && typeof window.grecaptcha.reset === "function") {
          window.grecaptcha.reset();
        }
      })
      .catch(function () {
        message.textContent = "Sorry, something went wrong. Please try again.";
        message.classList.add("is-error");
        if (submitButton) {
          submitButton.textContent = originalText;
          submitButton.classList.remove("flo-formspree-success-button");
          submitButton.style.removeProperty("background");
          submitButton.style.removeProperty("background-color");
          submitButton.style.removeProperty("border-color");
          submitButton.style.removeProperty("color");
        }
      })
      .finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
        }
      });
  }, true);

  $("li:first-child").addClass("first");
  $("li:last-child").addClass("last");
  $('[href="#"]').attr("href", "javascript:;");

  $(".menu-Bar").click(function () {
    $(this).toggleClass("open");
    $(".menuWrap").toggleClass("open");
    $("body").toggleClass("ovr-hiddn");
    $("body").toggleClass("overflw");
  });

  /* Unified scroll header: transparent → white on all pages */
  var header = document.querySelector("header");
  if (header) {
    var updateHeaderState = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    };
    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
  }

  var counters = document.querySelectorAll(".about-counter");

  function animateCounter(counter) {
    if (counter.dataset.counted === "true") {
      return;
    }

    counter.dataset.counted = "true";
    var target = parseInt(counter.dataset.target, 10) || 0;
    var suffix = counter.dataset.suffix || "";
    var duration = 3800;
    var startTime = performance.now();

    function tick(currentTime) {
      var progress = Math.min((currentTime - startTime) / duration, 1);
      var easedProgress = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * easedProgress);

      counter.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counter.textContent = target + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });

      counters.forEach(function (counter) {
        counterObserver.observe(counter);
      });
    } else {
      counters.forEach(animateCounter);
    }
  }

  function addRevealClass(element, effect, delayMs) {
    if (!element || element.classList.contains("scroll-reveal")) return;

    element.classList.add("scroll-reveal", effect);
    if (typeof delayMs === "number") {
      element.style.setProperty("--reveal-delay", delayMs + "ms");
    }
  }

  function isInsideCarousel(element) {
    if (!element || !element.closest) return false;

    return !!element.closest(
      ".hero-logo-slider .hero-logo-item, .testimonial-slider .testimonial-item, .slick-slide, .slick-track, .slick-list, .swiper-slide, .coverBookSwiper .swiper-slide"
    );
  }

  function autoWireSectionAnimations() {
    var sections = document.querySelectorAll("section");
    if (!sections.length) return;

    var sectionEffects = [
      "reveal-fade-up",
      "reveal-fade-down",
      "reveal-left",
      "reveal-right",
      "reveal-zoom",
      "reveal-soft-rotate",
      "reveal-glide-up",
      "reveal-tilt-in"
    ];

    sections.forEach(function (section, sectionIndex) {
      if (section.closest(".modal")) return;

      addRevealClass(section, sectionEffects[sectionIndex % sectionEffects.length], 0);

      var rowColumns = section.querySelectorAll(".row > [class*='col-']");
      rowColumns.forEach(function (column, columnIndex) {
        if (column.closest(".modal")) return;
        if (isInsideCarousel(column)) return;
        addRevealClass(
          column,
          columnIndex % 2 === 0 ? "reveal-left" : "reveal-right",
          Math.min(columnIndex, 6) * 90
        );
      });

      var cards = section.querySelectorAll(
        ".icon-box, .icon-box-odd, .writers-item, .accordion-item, .testimonial-item, .cover-hero-stat, .step-box, .genre-content-box, .portfolio-box, .process-box, .service-box, .blog-box"
      );
      cards.forEach(function (card, cardIndex) {
        if (isInsideCarousel(card)) return;
        addRevealClass(card, cardIndex % 3 === 0 ? "reveal-pop" : "reveal-glide-up", Math.min(cardIndex, 8) * 70);
      });

      var media = section.querySelectorAll(
        "img, video, .swiper, .testimonial-slider, .hero-logo-slider, .coverBookSwiper, .before-after-image, .teblet, .tablet, .popup-laptop, .popup-tablet"
      );
      media.forEach(function (item, mediaIndex) {
        if (item.closest(".modal")) return;
        if (isInsideCarousel(item) && !item.matches(".swiper, .testimonial-slider, .hero-logo-slider, .coverBookSwiper")) return;
        addRevealClass(item, mediaIndex % 2 === 0 ? "reveal-zoom" : "reveal-soft-rotate", Math.min(mediaIndex, 5) * 80);
      });

      var textBlocks = section.querySelectorAll(
        "h1, h2, h3, h4, p, ul, ol, .banner-form, form, .services-buttons, .call-btns, .banner-content, .banner-contents, .story-writer-content, .comprehensive-content, .contact-content, .reviews-content, .portfolio-content"
      );
      textBlocks.forEach(function (item, textIndex) {
        if (item.closest(".modal")) return;
        if (isInsideCarousel(item)) return;
        if (item.closest(".accordion-content")) return;
        addRevealClass(item, "reveal-fade-up", Math.min(textIndex, 6) * 55);
      });
    });

    var revealItems = document.querySelectorAll(".scroll-reveal");

    if ("IntersectionObserver" in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px"
      });

      revealItems.forEach(function (item) {
        revealObserver.observe(item);
      });
    } else {
      revealItems.forEach(function (item) {
        item.classList.add("reveal-visible");
      });
    }
  }

  autoWireSectionAnimations();

  document
    .querySelectorAll(".popup-redesign-textarea")
    .forEach(function (textarea) {
      var counter = textarea
        .closest(".popup-redesign-field")
        .querySelector(".popup-redesign-count");
      if (!counter) return;

      var maxLength = parseInt(textarea.getAttribute("maxlength") || "500", 10);

      function updateCount() {
        counter.textContent = textarea.value.length + "/" + maxLength;
      }

      textarea.addEventListener("input", updateCount);
      updateCount();
    });

  function setupDirectionalHover(container, stepFn, mobileMq, stepIntervalMs) {
    if (!container) return;

    stepIntervalMs = stepIntervalMs || 500;
    var timer = null;
    var dir = 0;

    function stop() {
      dir = 0;
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function start(direction) {
      if (mobileMq.matches) return;

      dir = direction;
      if (timer) return;

      stepFn(dir === 1 ? "next" : "prev");
      timer = setInterval(function () {
        if (dir === 1) stepFn("next");
        else if (dir === -1) stepFn("prev");
      }, stepIntervalMs);
    }

    container.addEventListener("mousemove", function (e) {
      if (mobileMq.matches) {
        stop();
        return;
      }

      var rect = container.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var w = rect.width;
      var zone = Math.min(w * 0.25, 140);

      if (x < zone) {
        if (dir !== -1) {
          stop();
          start(-1);
        }
      } else if (x > w - zone) {
        if (dir !== 1) {
          stop();
          start(1);
        }
      } else {
        stop();
      }
    });

    container.addEventListener("mouseleave", stop);

    if (mobileMq.addEventListener) {
      mobileMq.addEventListener("change", stop);
    } else if (mobileMq.addListener) {
      mobileMq.addListener(stop);
    }
  }

  whenNear("section.portfolio .mySwiper", "900px 0px", function () {
    loadCarouselAssets("swiper").then(initPortfolioSwiper);
  });

  whenNear(".hero-logo-slider, .testimonial-slider", "900px 0px", function () {
    loadCarouselAssets("slick").then(initSlickSliders);
  });

  var accordionItems = document.querySelectorAll(".accordion button");
  accordionItems.forEach(function (item) {
    item.addEventListener("click", function () {
      var itemToggle = this.getAttribute("aria-expanded");

      accordionItems.forEach(function (accordionItem) {
        accordionItem.setAttribute("aria-expanded", "false");
      });

      if (itemToggle === "false") {
        this.setAttribute("aria-expanded", "true");
      }
    });
  });

});
