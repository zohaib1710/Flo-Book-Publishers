window.__lc = window.__lc || {};
window.__lc.asyncInit = true;

$(document).ready(function () {
  var recaptchaAllowedHosts = [
    "flobookpublishers.com",
    "www.flobookpublishers.com"
  ];

  function isProductionRecaptchaHost() {
    var hostname = window.location.hostname;
    return recaptchaAllowedHosts.indexOf(hostname) !== -1;
  }

  function disableRecaptchaForLocalPreview() {
    if (isProductionRecaptchaHost()) return;

    document.querySelectorAll(".g-recaptcha").forEach(function (widget) {
      widget.setAttribute("data-flo-recaptcha-disabled", "true");
      widget.style.display = "none";
    });

    document.querySelectorAll(".popup-redesign-recaptcha").forEach(function (wrap) {
      wrap.style.display = "none";
    });
  }

  function loadDeferredImage(image) {
    if (!image || !image.dataset || !image.dataset.src) return;

    image.src = image.dataset.src;
    image.removeAttribute("data-src");
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

    modal.querySelectorAll("img[data-src]").forEach(loadDeferredImage);
    modal.dataset.assetsLoaded = "true";
  }

  function loadRecaptchaScript() {
    if (!isProductionRecaptchaHost()) return;
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

  disableRecaptchaForLocalPreview();

  setupLazyVideos(".flo-hero-video", "0px 0px");
  setupLazyVideos(".flo-lazy-video", "500px 0px");

  var leadForms = document.querySelectorAll(".flo-formspree-ajax-form");
  leadForms.forEach(function (form) {
    form.addEventListener("focusin", loadRecaptchaScript, { once: true });
    form.addEventListener("pointerenter", loadRecaptchaScript, { once: true });
  });

  var popupModal = document.getElementById("exampleModalCenter");
  if (popupModal) {
    var preparePopup = function () {
      loadPopupAssets(popupModal);
      loadRecaptchaScript();
    };

    popupModal.addEventListener("show.bs.modal", preparePopup);
    $(popupModal).on("show.bs.modal", preparePopup);
    document.querySelectorAll('[data-target="#exampleModalCenter"]').forEach(function (trigger) {
      trigger.addEventListener("pointerenter", preparePopup, { once: true });
      trigger.addEventListener("focus", preparePopup, { once: true });
    });
    queueIdle(function () {
      loadPopupAssets(popupModal);
    }, 18000);
  }

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

  var $heroLogoSlider = $(".hero-logo-slider");

  if ($heroLogoSlider.length && $.fn.slick) {
    $heroLogoSlider.each(function () {
      var $slider = $(this);

      if (!$slider.hasClass("slick-initialized")) {
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
            {
              breakpoint: 769,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 525,
              settings: {
                slidesToShow: 2,
              },
            },
          ],
        });
      }
    });
  }

  var $testimonialSlider = $(".testimonial-slider");

  if ($testimonialSlider.length && $.fn.slick) {
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
          {
            breakpoint: 1025,
            settings: {
              centerMode: true,
              centerPadding: "10px",
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 769,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: "0px",
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 525,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: "0px",
              slidesToShow: 1,
            },
          },
        ],
      });
    });
  }

});
