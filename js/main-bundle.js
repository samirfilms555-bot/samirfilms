/**
 * SAMIR EL-HOSARY — Public Website (main-bundle.js)
 * Standalone Vanilla JavaScript bundle for Homepage, About, and Contact.
 * Works seamlessly via both HTTP/HTTPS and direct file:/// opening.
 */

(function () {
  "use strict";

  const STORAGE_KEYS = {
    LOCAL_DB_PREFIX: "samir_portfolio_db_"
  };

  const DEMO_PROJECTS = [
    {
      id: "a1111111-1111-1111-1111-111111111111",
      slug: "urban-architecture-campaign",
      title_en: "Urban Architecture Campaign",
      client_name: "Metropolis Development (Demo)",
      year: "2026",
      category: "commercial",
      role_en: "Director / Cinematographer",
      description_en: "A cinematic commercial highlighting contemporary architectural forms and human resonance with urban spaces, told through escalating rhythmic pacing and sculptural natural light.",
      cover_image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
      featured: true,
      status: "published",
      sort_order: 1
    },
    {
      id: "b2222222-2222-2222-2222-222222222222",
      slug: "legacy-of-speed-commercial",
      title_en: "Legacy of Speed Commercial",
      client_name: "Veloce Performance (Demo)",
      year: "2026",
      category: "commercial",
      role_en: "Creative Director & Filmmaker",
      description_en: "A high-octane automotive performance film celebrating precision and adrenaline, marrying raw mechanical speed with stylized cinematic aesthetics.",
      cover_image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
      featured: true,
      status: "published",
      sort_order: 2
    },
    {
      id: "c3333333-3333-3333-3333-333333333333",
      slug: "medical-humanity-campaign",
      title_en: "Echoes of Hope — Medical Campaign",
      client_name: "Cura Health Systems (Demo)",
      year: "2025",
      category: "branded",
      role_en: "Director",
      description_en: "A deeply poignant humanized documentary campaign reflecting physician dedication and the quiet emotional impact of healthcare on families.",
      cover_image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80",
      featured: false,
      status: "published",
      sort_order: 3
    },
    {
      id: "d4444444-4444-4444-4444-444444444444",
      slug: "kinetic-fashion-reels",
      title_en: "Rhythm & Frame — Kinetic Fashion Reels",
      client_name: "AURA Contemporary (Demo)",
      year: "2026",
      category: "reels",
      role_en: "Director & Creative Supervisor",
      description_en: "A high-velocity vertical reels campaign engineered to hook viewers within 1.5 seconds, fusing avant-garde fashion with kinetic movement and match cuts.",
      cover_image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80",
      featured: false,
      status: "published",
      sort_order: 4
    }
  ];

  function getProjects() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_DB_PREFIX + "projects");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return DEMO_PROJECTS;
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* --- HEADER & NAVIGATION --- */
  function setupHeader() {
    const header = document.querySelector(".site-header");
    if (header) {
      window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 40);
      }, { passive: true });
    }

    const toggle = document.querySelector(".mobile-nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (toggle && navLinks) {
      toggle.onclick = () => {
        const isOpen = toggle.classList.toggle("open");
        navLinks.classList.toggle("open");
        document.body.style.overflow = isOpen ? "hidden" : "";
      };
      navLinks.querySelectorAll(".nav-link").forEach((l) => {
        l.onclick = () => {
          toggle.classList.remove("open");
          navLinks.classList.remove("open");
          document.body.style.overflow = "";
        };
      });
    }
  }

  /* --- SHOWREEL PLAYER --- */
  function setupShowreel() {
    const wrapper = document.querySelector(".showreel-player-wrapper");
    if (!wrapper) return;
    const video = wrapper.querySelector(".showreel-video");
    const playBtn = wrapper.querySelector(".showreel-play-center");
    const muteBtn = wrapper.querySelector(".showreel-mute-btn");
    const fsBtn = wrapper.querySelector(".showreel-fs-btn");
    const fill = wrapper.querySelector(".showreel-progress-fill");

    if (!video) return;
    const togglePlay = () => {
      if (video.paused) {
        video.play();
        if (playBtn) playBtn.style.opacity = "0";
      } else {
        video.pause();
        if (playBtn) playBtn.style.opacity = "1";
      }
    };

    if (playBtn) playBtn.onclick = togglePlay;
    video.onclick = togglePlay;

    video.ontimeupdate = () => {
      if (video.duration && fill) {
        fill.style.width = `${(video.currentTime / video.duration) * 100}%`;
      }
    };

    if (muteBtn) {
      muteBtn.onclick = () => {
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? "UNMUTE" : "MUTE";
      };
    }

    if (fsBtn) {
      fsBtn.onclick = () => {
        if (document.fullscreenElement) document.exitFullscreen();
        else wrapper.requestFullscreen();
      };
    }
  }

  /* --- PORTFOLIO GRID --- */
  function setupPortfolio() {
    const grid = document.getElementById("portfolio-grid");
    if (!grid) return;

    let activeCat = "all";
    const all = getProjects().filter((p) => p.status === "published");

    const render = (cat) => {
      const filtered = cat === "all" ? all : all.filter((p) => (p.category || "").toLowerCase() === cat.toLowerCase());
      if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;"><p class="empty-state-text">No projects found.</p></div>`;
        return;
      }

      grid.innerHTML = filtered.map((p, idx) => {
        const spanClass = (idx === 0 || (idx % 3 === 0 && p.featured)) ? "featured-hero" : "medium-span-6";
        const title = escapeHtml(p.title_en || p.title_ar || "Project");
        const client = escapeHtml(p.client_name || "");
        const role = escapeHtml(p.role_en || "Director");
        const year = escapeHtml(p.year || "2026");
        const cover = escapeHtml(p.cover_image || "assets/images/placeholder.jpg");
        const catLabel = (p.category || "commercial").toUpperCase();

        return `
          <article class="project-card ${spanClass}">
            <a href="project.html?id=${encodeURIComponent(p.slug || p.id)}" class="project-card-link">
              <div class="project-card-media">
                <img class="project-card-img" src="${cover}" alt="${title}" loading="lazy" />
                <div class="project-card-overlay"></div>
                ${p.featured ? '<span class="project-card-badge">FEATURED</span>' : ''}
              </div>
              <div class="project-card-meta">
                <div class="project-card-category">${catLabel} • ${role}</div>
                <h3 class="project-card-title">${title}</h3>
                <div class="project-card-client-year">${client} — ${year}</div>
              </div>
            </a>
          </article>
        `;
      }).join("");
    };

    render(activeCat);

    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeCat = btn.getAttribute("data-category") || "all";
        render(activeCat);
      };
    });
  }

  /* --- CONTACT FORM --- */
  function setupContact() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    form.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("contact-name")?.value || "";
      const email = document.getElementById("contact-email")?.value || "";
      const comp = document.getElementById("contact-company")?.value || "";
      const type = document.getElementById("contact-type")?.value || "";
      const msg = document.getElementById("contact-message")?.value || "";

      if (!name || !email || !msg) {
        alert("Please fill in required fields.");
        return;
      }

      const subject = encodeURIComponent(`Project Inquiry: ${name} (${comp || 'Direct'}) - ${type}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCompany: ${comp}\nProject Type: ${type}\n\nMessage:\n${msg}`);
      window.location.href = `mailto:contact@samirelhosary.com?subject=${subject}&body=${body}`;
      form.reset();
    };
  }

  /* --- CURSOR --- */
  function setupCursor() {
    if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cursor = document.createElement("div");
    cursor.className = "cinematic-cursor";
    cursor.innerHTML = `<div class="cursor-dot"></div>`;
    document.body.appendChild(cursor);

    window.addEventListener("mousemove", (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }, { passive: true });

    const targets = "a, button, input, select, textarea, .project-card, .still-item";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(targets)) cursor.classList.add("cursor-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(targets)) cursor.classList.remove("cursor-hover");
    });
  }

  function init() {
    setupHeader();
    setupShowreel();
    setupPortfolio();
    setupContact();
    setupCursor();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
