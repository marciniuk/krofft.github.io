// === Developer Info ===
// === Developer Info ===
window.DevInfo = {
  name: "Adrian Marciniuk",
  website: "https://marcini.uk",
  mail: "adrian@marcini.uk",
  sayHello() {
    console.log(
      "%c👋 Developed by %cAdrian Marciniuk%c\n🌐 https://marcini.uk\n📧 adrian@marcini.uk",
      "color: #999; font-size: 13px;",
      "color: #007acc; font-weight: bold; font-size: 13px;",
      "color: #999; font-size: 13px;"
    );
  },
};

// === Auto-run on page load ===
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => DevInfo.sayHello());
} else {
  DevInfo.sayHello();
}

/* ==========================================
   UTILS
   ========================================== */
function lerp(start, end, t) {
  return start + (end - start) * t;
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/* ==========================================
   NAVBAR & PRZYCISKI
   ========================================== */
const navbar = document.getElementById("navbar");
const logo = document.getElementById("logo");
const phoneBtn = document.getElementById("phoneBtn");
const phoneIcon = phoneBtn?.querySelector(".phone-icon");
const langBtn = document.getElementById("langBtn");

let lastScrollY = 0;
let tickingNavbar = false;

function handleNavbarScroll() {
  lastScrollY = window.scrollY;
  if (!tickingNavbar) {
    tickingNavbar = true;
    requestAnimationFrame(() => {
      updateNavbar();
      tickingNavbar = false;
    });
  }
}

function updateNavbar() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const progress = clamp(lastScrollY / (windowHeight / 2), 0, 1);

  /* MAŁE EKRANY */

  if (windowWidth < 1024) {
    navbar.style.backgroundColor = "#bfdbfe";
    navbar.style.color = "#1e3a8a";
    logo.style.filter = "none";

    [phoneBtn, langBtn].forEach((btn) => {
      if (!btn) return;
      btn.style.transition =
        "background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease";
      btn.style.color = "#1e3a8a";
      btn.style.borderColor = "#1e3a8a";
      btn.style.backgroundColor = "transparent";
    });

    if (phoneIcon) {
      phoneIcon.style.backgroundColor = "#1e3a8a";
      phoneIcon
        .querySelector("i")
        .style.setProperty("color", "#cde3fe", "important");
    }
    return;
  }

  /* DUŻE EKRANY */
  const bg = [
    lerp(122, 191, progress),
    lerp(81, 219, progress),
    lerp(61, 254, progress),
    lerp(0.2, 1, progress),
  ];
  navbar.style.backgroundColor = `rgba(${Math.round(bg[0])},${Math.round(
    bg[1]
  )},${Math.round(bg[2])},${bg[3].toFixed(2)})`;

  const text = [
    lerp(255, 30, progress),
    lerp(255, 58, progress),
    lerp(255, 138, progress),
  ];
  const textColor = `rgb(${Math.round(text[0])},${Math.round(
    text[1]
  )},${Math.round(text[2])})`;
  navbar.style.color = textColor;

  logo.style.filter = `brightness(${lerp(5, 1, progress)}) contrast(${lerp(
    2,
    1,
    progress
  )})`;

  /* PRZYCISKI (TELEFON + JĘZYK) */
  [phoneBtn, langBtn].forEach((btn) => {
    if (!btn) return;
    btn.style.transition =
      "background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease";
    btn.style.color = textColor;
    btn.style.borderColor = textColor;
  });

  if (phoneIcon) {
    phoneIcon.style.backgroundColor = textColor;

    const startColor = [44, 46, 131];
    const endColor = [205, 227, 254];
    const iconColor = [
      lerp(startColor[0], endColor[0], progress),
      lerp(startColor[1], endColor[1], progress),
      lerp(startColor[2], endColor[2], progress),
    ];
    phoneIcon.querySelector("i").style.color = `rgb(${Math.round(
      iconColor[0]
    )},${Math.round(iconColor[1])},${Math.round(iconColor[2])})`;
  }
}

window.addEventListener("scroll", handleNavbarScroll, { passive: true });
window.addEventListener("resize", handleNavbarScroll);
handleNavbarScroll();

/* ==========================================
   MENU HAMBURGER
   ========================================== */
const menuBtn = document.querySelector("#menu-btn");
const navRight = document.querySelector("#nav-right");

if (menuBtn && navRight) {
  let menuOpen = !navRight.classList.contains("nav-hidden");
  let cooldown = false;

  const openMenu = () => {
    if (menuOpen) return;
    menuOpen = true;
    navRight.classList.remove("nav-hidden", "nav-up");
    navRight.classList.add("nav-down");
    menuBtn.classList.add("open");
    menuBtn.setAttribute("aria-expanded", "true");
  };
  const closeMenu = () => {
    if (!menuOpen) return;
    menuOpen = false;
    navRight.classList.add("nav-up");
    navRight.classList.remove("nav-down");
    setTimeout(() => {
      if (!menuOpen) navRight.classList.add("nav-hidden");
    }, 220);
    menuBtn.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  };
  const toggle = (e) => {
    if (cooldown) return;
    e?.stopPropagation?.();
    cooldown = true;
    setTimeout(() => (cooldown = false), 250);
    menuOpen ? closeMenu() : openMenu();
  };

  menuBtn.addEventListener("click", toggle);
  menuBtn.addEventListener("pointerdown", (e) => e.stopPropagation());

  document.addEventListener(
    "pointerdown",
    (e) => {
      if (!menuOpen) return;
      if (!navRight.contains(e.target) && !menuBtn.contains(e.target))
        closeMenu();
    },
    { passive: true }
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuOpen) closeMenu();
  });

  navRight.setAttribute("aria-hidden", menuOpen ? "false" : "true");
  new MutationObserver(() => {
    navRight.setAttribute("aria-hidden", menuOpen ? "false" : "true");
  }).observe(navRight, { attributes: true, attributeFilter: ["class"] });
}

/* ==========================================
   STOPKA
   ========================================== */
document.getElementById("year").innerHTML = new Date().getFullYear();

/* ==========================================
   TEKSTY (nowrap)
   ========================================== */
document.querySelectorAll(".nowrap-single").forEach((el) => {
  el.innerHTML = el.innerHTML.replace(
    /\b(a|i|o|z|w|u|e|na|do)\b\s+/g,
    "$1&nbsp;"
  );
});

/* ==========================================
   GALERIA + LAZY + COUNTERS + ANIMATIONS
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
  // gallery init
  initGalleryObserver();
  initGalleryModal();
  initOfertaModals();

  /* --- Lazy-load images (IntersectionObserver) --- */
  (function initLazyImages() {
    const images = document.querySelectorAll(".lazy-img");
    if (!images.length) return;

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const loadImage = () => {
              const img = entry.target;
              if (!img.src || img.src.includes("placeholder")) {
                img.src = "/assets/img/placeholder.png";
              }
              const temp = new Image();
              temp.src = img.dataset.src;
              temp.srcset = img.dataset.srcset;
              temp.sizes = img.dataset.sizes;

              temp.onload = () => {
                img.src = img.dataset.src;
                if (img.dataset.srcset) img.srcset = img.dataset.srcset;
                if (img.dataset.sizes) img.sizes = img.dataset.sizes;
                img.classList.add("opacity-100");
                obs.unobserve(img);
              };

              temp.onerror = () => {
                console.warn(`⚠️ Nie udało się załadować: ${img.dataset.src}`);
                obs.unobserve(img);
              };
            };

            if ("requestIdleCallback" in window) {
              requestIdleCallback(loadImage);
            } else {
              setTimeout(loadImage, 150);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    images.forEach((img) => {
      img.classList.add("transition-opacity", "duration-500", "opacity-0");
      io.observe(img);
    });
  })();

  /* --- Counters (when in view) --- */
  (function initCounters() {
    const counters = document.querySelectorAll(".counter");
    if (!counters.length) return;
    const duration = 2000;

    const animate = (counter) => {
      const target = +counter.getAttribute("data-target");
      const suffix = counter.getAttribute("data-suffix") || "";
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = value + suffix;

        if (progress < 1) requestAnimationFrame(step);
        else counter.textContent = target + suffix;
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach((counter) => io.observe(counter));
  })();

  /* --- Play CSS animations when in view --- */
  (function initPlayOnView() {
    const animatedElements = document.querySelectorAll(".animate-fadeInUp");
    if (!animatedElements.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running";
          }
        });
      },
      { threshold: 0.2 }
    );

    animatedElements.forEach((el) => {
      el.style.animationPlayState = "paused";
      io.observe(el);
    });
  })();
});

/* =================== OBSERVER GALERII =================== */
function initGalleryObserver() {
  const gallerySection = document.getElementById("gallery");
  let galleryLoaded = false;

  if (!gallerySection) return console.warn("⚠️ Nie znaleziono sekcji #gallery");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !galleryLoaded) {
          galleryLoaded = true;
          observer.unobserve(gallerySection);

          const lazyLoadGallery = () => {
            initMainGallery();
            document.querySelectorAll("#slider-main img").forEach((img) => {
              const realSrc = img.dataset.src;
              if (realSrc) {
                const temp = new Image();
                temp.src = realSrc;
                temp.srcset = img.dataset.srcset;
                temp.sizes = img.dataset.sizes;
                temp.onload = () => {
                  img.src = realSrc;
                  img.srcset = img.dataset.srcset;
                  img.sizes = img.dataset.sizes;
                  img.classList.add("opacity-100");
                };
              }
            });
          };

          if ("requestIdleCallback" in window)
            requestIdleCallback(lazyLoadGallery);
          else setTimeout(lazyLoadGallery, 200);
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(gallerySection);
}

/* =================== SLIDER =================== */
function initMainGallery() {
  const slider = document.getElementById("slider-main");
  const imgCount = 11;
  if (!slider) return console.warn("⚠️ Nie znaleziono #slider-main");

  slider.innerHTML = "";

  for (let i = 1; i <= imgCount; i++) slider.appendChild(createSliderItem(i));
  for (let i = 1; i <= imgCount; i++) {
    const clone = createSliderItem(i);
    clone.classList.add("clone");
    slider.appendChild(clone);
  }

  initSliderScroll(slider);
}

function createSliderItem(index) {
  const wrapper = document.createElement("div");
  wrapper.className = "img-wrapper";

  const img = document.createElement("img");
  img.src = "/assets/img/placeholder.png";
  img.dataset.src = `/assets/img/gallery/${index}-800.jpg`;
  img.dataset.srcset = `/assets/img/gallery/${index}-400.jpg 400w, /assets/img/gallery/${index}-800.jpg 800w, /assets/img/gallery/${index}.jpg 1200w`;
  img.dataset.sizes =
    "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 1200px";
  img.alt = `Galeria ${index}`;
  img.loading = "lazy";
  img.className =
    "w-full object-cover transition-opacity duration-500 opacity-0";

  const btn = document.createElement("button");

  // --- wykrywanie języka na podstawie ścieżki URL ---
  const path = window.location.pathname;
  const isEnglish = path.startsWith("/en/");
  btn.textContent = isEnglish ? "View more" : "Zobacz więcej";

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    openGalleryModal(index);
  });

  wrapper.appendChild(img);
  wrapper.appendChild(btn);
  return wrapper;
}

function initSliderScroll(slider) {
  const viewport = slider.parentElement;
  const speed = 0.5;
  let isDragging = false,
    startX = 0,
    offsetX = 0;

  let translate = 0;

  slider.style.willChange = "transform";

  const updateTransform = () => {
    slider.style.transform = `translateX(${-translate}px)`;
  };

  // =================== RĘCZNY DRAG ===================
  const startDrag = (x) => {
    isDragging = true;
    startX = x;
    offsetX = translate;
  };

  const moveDrag = (x) => {
    if (!isDragging) return;
    const dx = x - startX;
    translate = offsetX - dx;
    updateTransform();
  };

  const endDrag = () => {
    isDragging = false;
  };

  // Mysz
  viewport.addEventListener("mousedown", (e) => startDrag(e.pageX));
  viewport.addEventListener("mousemove", (e) => moveDrag(e.pageX));
  viewport.addEventListener("mouseup", endDrag);
  viewport.addEventListener("mouseleave", endDrag);

  // Touch
  viewport.addEventListener("touchstart", (e) => startDrag(e.touches[0].pageX));
  viewport.addEventListener("touchmove", (e) => moveDrag(e.touches[0].pageX));
  viewport.addEventListener("touchend", endDrag);
  viewport.addEventListener("touchcancel", endDrag);

  // =================== AUTO SCROLL ===================
  const maxScroll = slider.scrollWidth / 2;

  const step = () => {
    if (!isDragging) {
      translate += speed;
      if (translate >= maxScroll) translate -= maxScroll;
      updateTransform();
    }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---   Gallery modal / Modal galerii   --- */
function initGalleryModal() {
  const modal = document.getElementById("gallery-modal");
  const closeBtn = document.getElementById("modal-close");

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener("click", closeGalleryModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeGalleryModal();
  });
  const modalContent = modal.querySelector(".modal-content");
  modalContent?.addEventListener("click", (e) => e.stopPropagation());
}

async function openGalleryModal(index) {
  const modal = document.getElementById("gallery-modal");
  if (!modal) return;
  modal.classList.add("active");
  const gallery = document.getElementById("modal-gallery");
  if (!gallery) return;
  gallery.innerHTML = `<p class="text-gray-500">Wczytywanie...</p>`;

  try {
    const res = await fetch(`/assets/img/gallery/${index}/lista.json`);
    if (!res.ok) throw new Error("Błąd ładowania JSON");
    const data = await res.json();
    gallery.innerHTML = "";

    // =================== WIDEO ===================
    if (data.video && Array.isArray(data.video)) {
      data.video.forEach((videoName) => {
        const video = document.createElement("video");
        video.src = `/assets/img/gallery/${index}/${videoName}`;
        video.controls = true;
        video.preload = "none";
        video.autoplay = false;
        video.muted = true;

        const thumb = videoName.replace(/\.[^.]+$/, ".jpg");
        video.poster = `/assets/img/gallery/${index}/${thumb}`;

        video.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleLightbox(video);
        });
        gallery.appendChild(video);
      });
    } else if (data.video) {
      const video = document.createElement("video");
      video.src = `/assets/img/gallery/${index}/${data.video}`;
      video.controls = true;
      video.preload = "none";
      video.autoplay = false;
      video.muted = true;

      const thumb = data.video.replace(/\.[^.]+$/, ".jpg");
      video.poster = `/assets/img/gallery/${index}/${thumb}`;

      video.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleLightbox(video);
      });
      gallery.appendChild(video);
    }

    // =================== OBRAZY ===================
    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((imgName) => {
        const img = document.createElement("img");
        img.src = `/assets/img/gallery/${index}/${imgName}`;
        img.loading = "lazy";
        img.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleLightbox(img);
        });
        gallery.appendChild(img);
      });
    }

    if ((!data.images || data.images.length === 0) && !data.video) {
      gallery.innerHTML = `<p class="text-gray-500">Brak materiałów do wyświetlenia.</p>`;
    }
  } catch (err) {
    console.error(err);
    gallery.innerHTML = `<p class="text-red-600">Nie udało się wczytać zawartości.</p>`;
  }
}

function closeGalleryModal() {
  const modal = document.getElementById("gallery-modal");
  if (!modal) return;
  modal.classList.remove("active");
  document
    .querySelectorAll("#modal-gallery img, #modal-gallery video")
    .forEach((el) => el.classList.remove("expanded"));
  hideLightbox();
}

/* ---   Lightbox / Powiększanie obrazów i wideo   --- */
function toggleLightbox(el) {
  let overlay = document.getElementById("lightbox-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "lightbox-overlay";
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = "";

  const clone = el.cloneNode(true);
  clone.classList.add("visible");
  overlay.appendChild(clone);
  overlay.classList.add("active");
  overlay.addEventListener("click", hideLightbox);

  if (clone.tagName.toLowerCase() === "video") {
    clone.controls = true;
    clone.muted = false;
    setTimeout(() => clone.play(), 200);
  }
}

function hideLightbox() {
  const overlay = document.getElementById("lightbox-overlay");
  if (overlay) {
    const video = overlay.querySelector("video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    overlay.classList.remove("active");
    setTimeout(() => {
      overlay.innerHTML = "";
    }, 300);
  }
}

/* ==========================================
   INNE MODALE
   ========================================== */
function initOfertaModals() {
  document.querySelectorAll("[data-oferta]").forEach((m) => {
    m.addEventListener("click", (e) => {
      if (e.target === m) {
        m.classList.add("opacity-0", "pointer-events-none");
        m.querySelector("div")?.classList.replace("scale-100", "scale-95");
      }
    });
  });
  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      const m = btn.closest("[data-oferta]");
      if (!m) return;
      m.classList.add("opacity-0", "pointer-events-none");
      m.querySelector("div")?.classList.replace("scale-100", "scale-95");
    });
  });
  document.querySelectorAll("[data-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const m = document.getElementById(btn.dataset.modal);
      if (!m) return;
      m.classList.remove("opacity-0", "pointer-events-none");
      m.querySelector("div")?.classList.replace("scale-95", "scale-100");
    });
  });
}

/* ==========================================
   FORMULARZ KONTAKTOWY
   ========================================== */
function toggleSubmit() {
  const submitBtn = document.getElementById("submitBtn");
  const rodo = document.getElementById("rodo");
  if (!submitBtn || !rodo) return;
  submitBtn.disabled = !rodo.checked;
}
async function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById("contactForm");
  if (!form) return;
  if (form.querySelector('input[name="honeypot"]').value !== "") {
    alert("Wykryto bota 🚫");
    return false;
  }
  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
    });
    if (res.ok) {
      showPopup();
      form.reset();
      toggleSubmit();
    } else alert("Ups! Coś poszło nie tak. Spróbuj ponownie później.");
  } catch (err) {
    console.error(err);
    alert("Błąd połączenia. Spróbuj ponownie.");
  }
}
function showPopup() {
  const popup = document.getElementById("successPopup"),
    backdrop = document.getElementById("popupBackdrop");
  if (!popup || !backdrop) return;
  popup.classList.remove("hidden", "opacity-0", "scale-90");
  backdrop.classList.remove("hidden", "opacity-0");
  setTimeout(() => {
    popup.classList.add("opacity-100", "scale-100");
    backdrop.classList.add("opacity-100");
  }, 10);
  setTimeout(closePopup, 20000);
}
function closePopup() {
  const popup = document.getElementById("successPopup"),
    backdrop = document.getElementById("popupBackdrop");
  if (!popup || !backdrop) return;
  popup.classList.add("opacity-0", "scale-90");
  backdrop.classList.add("opacity-0");
  setTimeout(() => {
    popup.classList.add("hidden");
    backdrop.classList.add("hidden");
  }, 500);
}

/* ==========================================
   BUTTONY SOCIAL & CONTACT - OPTIMIZED
   ========================================== */
function updateContactLayoutOptimized() {
  const container = document.querySelector(".contact-buttons");
  if (!container) return;

  const buttons = Array.from(container.querySelectorAll("a"));
  const gap = parseInt(getComputedStyle(container).gap) || 0;

  // --- READ ---
  const btnWidths = buttons.map((btn) => btn.getBoundingClientRect().width);
  const totalWidth = btnWidths.reduce((sum, w) => sum + w, 0);
  const totalGap = gap * (buttons.length - 1);
  const containerWidth = container.getBoundingClientRect().width;

  // --- WRITE ---
  requestAnimationFrame(() => {
    const useCol = totalWidth + totalGap > containerWidth;
    container.classList.toggle("flex-col", useCol);
    container.classList.toggle("flex-row", !useCol);
  });
}

function updateSocialLayoutOptimized() {
  const container = document.getElementById("social-buttons");
  if (!container) return;

  const buttons = Array.from(container.querySelectorAll(".social-btn"));
  const gap = parseInt(getComputedStyle(container).gap) || 0;

  // --- READ ---
  const btnWidths = buttons.map((btn) => btn.getBoundingClientRect().width);
  const totalWidth = btnWidths.reduce((sum, w) => sum + w, 0);
  const totalGap = gap * (buttons.length - 1);
  const containerWidth = container.getBoundingClientRect().width;

  // --- WRITE ---
  requestAnimationFrame(() => {
    const useCol = totalWidth + totalGap > containerWidth;
    container.classList.toggle("flex-col", useCol);
    container.classList.toggle("flex-row", !useCol);
  });
}

// debounce resize
let resizeTimeout;
function handleResizeOptimized() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateContactLayoutOptimized();
    updateSocialLayoutOptimized();
  }, 100);
}

window.addEventListener("resize", handleResizeOptimized);
window.addEventListener("load", () => {
  updateContactLayoutOptimized();
  updateSocialLayoutOptimized();
});

/* ==========================================
   ANIMACJA CZYM SIĘ WYRÓŻNIAMY (ACCORDION)
   ========================================== */
function toggleAccordion(button) {
  const content = button.nextElementSibling;
  const icon = button.querySelector("svg");
  const isLarge = window.innerWidth >= 1024;

  // jeśli NIE jest lg, zamykamy inne
  if (!isLarge) {
    document.querySelectorAll(".accordion-content").forEach((el) => {
      if (el !== content) closeAccordion(el);
    });
    document
      .querySelectorAll(".accordion-content + svg, button svg")
      .forEach((svg) => {
        if (svg !== icon) svg.classList.remove("rotate-180");
      });
  }

  // przełącz aktualny
  if (content.classList.contains("open")) {
    closeAccordion(content);
    icon.classList.remove("rotate-180");
  } else {
    openAccordion(content);
    icon.classList.add("rotate-180");
  }
}

function openAccordion(content) {
  content.classList.add("open");
  content.style.maxHeight = content.scrollHeight + "px";
  content.style.opacity = "1";
}

function closeAccordion(content) {
  content.classList.remove("open");
  content.style.maxHeight = "0";
  content.style.opacity = "0";
}

// reset wysokości po resize, by uniknąć glitchy
window.addEventListener("resize", () => {
  document.querySelectorAll(".accordion-content.open").forEach((el) => {
    el.style.maxHeight = el.scrollHeight + "px";
  });
});
