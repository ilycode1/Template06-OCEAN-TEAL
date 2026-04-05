"use strict";

/* ================================================
   1. NAVBAR SCROLL + ACTIVE SPY
================================================ */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navLinks = document.querySelectorAll(".nav-menu a");

  function onScroll() {
    if (window.scrollY > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");

    let current = "";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ================================================
   2. HAMBURGER MENU
================================================ */
function initHamburger() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    menu.classList.toggle("open");
  });
  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      toggle.classList.remove("open");
      menu.classList.remove("open");
    });
  });
}

/* ================================================
   3. HERO SLIDER
================================================ */
function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  if (!slides.length) return;
  let cur = 0,
    timer;

  function goTo(i) {
    slides[cur].classList.remove("active");
    dots[cur].classList.remove("active");
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add("active");
    dots[cur].classList.add("active");
  }

  function start() {
    timer = setInterval(() => goTo(cur + 1), 4000);
  }
  function reset() {
    clearInterval(timer);
    start();
  }

  dots.forEach((d, i) =>
    d.addEventListener("click", () => {
      goTo(i);
      reset();
    }),
  );
  start();
}

/* ================================================
   4. HERO PARALLAX (mouse) — desktop only
================================================ */
function initParallax() {
  const hero = document.getElementById("hero");
  const shapes = document.querySelectorAll(".hero-shapes > *");
  if (!hero || !shapes.length) return;

  let rafId;
  hero.addEventListener(
    "mousemove",
    (e) => {
      if (window.innerWidth < 1024) return;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const cx = hero.offsetWidth / 2;
        const cy = hero.offsetHeight / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        shapes.forEach((s, i) => {
          const speed = (i + 1) * 0.008;
          s.style.transform = `translate(${dx * speed}px, ${dy * speed}px)`;
        });
      });
    },
    { passive: true },
  );

  hero.addEventListener("mouseleave", () => {
    shapes.forEach((s) => {
      s.style.transform = "";
    });
  });
}

/* ================================================
   5. 3D CARD TILT
================================================ */
function init3DTilt() {
  const cards = document.querySelectorAll(".card-3d");
  let rafId;

  cards.forEach((card) => {
    card.addEventListener(
      "mousemove",
      (e) => {
        if (window.innerWidth < 1024) return;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const xRot = ((e.clientY - r.top) / r.height - 0.5) * -16;
          const yRot = ((e.clientX - r.left) / r.width - 0.5) * 16;
          card.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) translateY(-6px)`;
        });
      },
      { passive: true },
    );

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ================================================
   6. SCROLL ANIMATIONS (IntersectionObserver)
================================================ */
function initScrollAnimations() {
  const els = document.querySelectorAll(".animate, .animate-left, .animate-right");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("visible"));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  els.forEach((el) => obs.observe(el));
}

/* ================================================
   7. COUNTER ANIMATION
================================================ */
function initCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.target, 10);
        const dur = 2000;
        const start = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / dur, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString("id-ID");
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString("id-ID");
        }

        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    },
    { threshold: 0.3 },
  );

  counters.forEach((c) => obs.observe(c));
}

/* ================================================
   8. TAB FILTER — ANIMATED PILL
================================================ */
function initTabs() {
  const nav = document.getElementById("tabNav");
  if (!nav) return;
  const pill = document.getElementById("tabPill");
  const btns = nav.querySelectorAll(".tab-btn");

  function movePill(btn) {
    pill.style.width = btn.offsetWidth + "px";
    pill.style.transform = `translateX(${btn.offsetLeft - 4}px)`;
  }

  function switchTab(btn) {
    const target = btn.dataset.tab;
    btns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    movePill(btn);

    document.querySelectorAll(".tab-panel").forEach((p) => {
      if (p.id === "panel-" + target) {
        p.style.opacity = "0";
        p.style.transform = "scale(0.97)";
        p.style.display = "block";
        requestAnimationFrame(() => {
          p.style.transition = "opacity 0.3s, transform 0.3s";
          p.style.opacity = "1";
          p.style.transform = "scale(1)";
        });
      } else {
        p.style.display = "none";
      }
    });
  }

  btns.forEach((btn) => btn.addEventListener("click", () => switchTab(btn)));

  // Init pill position on first button
  requestAnimationFrame(() => movePill(nav.querySelector(".tab-btn.active")));
  window.addEventListener(
    "resize",
    () => {
      movePill(nav.querySelector(".tab-btn.active"));
    },
    { passive: true },
  );
}

/* ================================================
   9. TESTIMONIAL PEEK CAROUSEL
================================================ */
function initTestimonialCarousel() {
  const track = document.getElementById("testimonialTrack");
  const carousel = document.getElementById("testimonialCarousel");
  if (!track) return;

  const cards = track.querySelectorAll(".testimonial-card");
  const dots = document.querySelectorAll("#tDots .t-dot");
  let cur = 0,
    autoTimer,
    resizeTimer;

  function cardWidth() {
    return cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginLeft) * 2;
  }

  function update(i) {
    cur = (i + cards.length) % cards.length;
    track.style.transform = `translateX(-${cur * cardWidth()}px)`;
    cards.forEach((c, j) => c.classList.toggle("active", j === cur));
    dots.forEach((d, j) => d.classList.toggle("active", j === cur));
  }

  function start() {
    autoTimer = setInterval(() => update(cur + 1), 4000);
  }
  function stop() {
    clearInterval(autoTimer);
  }

  document.getElementById("tPrev").addEventListener("click", () => {
    stop();
    update(cur - 1);
    start();
  });
  document.getElementById("tNext").addEventListener("click", () => {
    stop();
    update(cur + 1);
    start();
  });
  dots.forEach((d, i) =>
    d.addEventListener("click", () => {
      stop();
      update(i);
      start();
    }),
  );

  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);

  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => update(cur), 150);
    },
    { passive: true },
  );

  update(0);
  start();
}

/* ================================================
   10. GALLERY LIGHTBOX
================================================ */
function initGalleryLightbox() {
  const items = document.querySelectorAll(".gallery-item");
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCap = document.getElementById("lbCaption");
  if (!lb) return;

  const gallery = Array.from(items).map((item) => ({
    src: item.dataset.src,
    title: item.dataset.title,
  }));
  let idx = 0;

  function open(i) {
    idx = (i + gallery.length) % gallery.length;
    lbImg.src = gallery[idx].src;
    lbImg.alt = gallery[idx].title;
    lbCap.textContent = gallery[idx].title;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }

  items.forEach((item, i) => item.addEventListener("click", () => open(i)));
  document.getElementById("lbClose").addEventListener("click", close);
  document.getElementById("lbPrev").addEventListener("click", () => open(idx - 1));
  document.getElementById("lbNext").addEventListener("click", () => open(idx + 1));
  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") open(idx - 1);
    if (e.key === "ArrowRight") open(idx + 1);
  });
}

/* ================================================
   11. CONTACT FORM
================================================ */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = document.getElementById("cfNama").value.trim();
    const email = document.getElementById("cfEmail").value.trim();
    const pesan = document.getElementById("cfPesan").value.trim();
    if (!nama || !email || !pesan) return;
    const success = document.getElementById("formSuccess");
    success.style.display = "block";
    form.reset();
    setTimeout(() => {
      success.style.display = "none";
    }, 5000);
  });
}

/* ================================================
   12. NEWSLETTER FORM
================================================ */
function initNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("nlEmail").value.trim();
    if (!email) return;
    const success = document.getElementById("nlSuccess");
    success.style.display = "block";
    form.reset();
  });
}

/* ================================================
   13. SMOOTH SCROLL
================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
    });
  });
}

/* ================================================
   INIT
================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initHamburger();
  initHeroSlider();
  initParallax();
  initScrollAnimations();
  initCounters();
  init3DTilt();
  initTabs();
  initTestimonialCarousel();
  initGalleryLightbox();
  initContactForm();
  initNewsletterForm();
  initSmoothScroll();
});
