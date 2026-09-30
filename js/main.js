/**
 * SAMIR EL-HOSARY — Public Website Controller (main.js)
 * English-only implementation.
 */

import { i18n } from "./i18n.js";
import { getPublishedProjects, getSiteSettings } from "./api.js";
import { Toast, escapeHtml } from "./utils.js";
import { CONFIG } from "./config.js";

let allPublishedProjects = [];
let activeCategory = "all";

document.addEventListener("DOMContentLoaded", async () => {
  i18n.applyToDOM();

  setupHeader();
  setupMobileNav();
  setupCustomCursor();

  const portfolioGrid = document.getElementById("portfolio-grid");
  if (portfolioGrid) {
    await initHomepage();
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    setupContactForm(contactForm);
  }
});

/* ============================================================
 * HEADER & SCROLL BEHAVIOR
 * ============================================================ */
function setupHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

function setupMobileNav() {
  const toggle = document.querySelector(".mobile-nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!toggle || !navLinks) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.classList.toggle("open");
    navLinks.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.classList.remove("open");
      navLinks.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}

/* ============================================================
 * HOMEPAGE PORTFOLIO & SHOWREEL
 * ============================================================ */
async function initHomepage() {
  const portfolioGrid = document.getElementById("portfolio-grid");
  const filterBtns = document.querySelectorAll(".filter-btn");

  portfolioGrid.innerHTML = `
    <div class="project-card featured-hero skeleton" style="height: 480px;"></div>
    <div class="project-card medium-span-6 skeleton" style="height: 360px;"></div>
    <div class="project-card medium-span-6 skeleton" style="height: 360px;"></div>
  `;

  try {
    allPublishedProjects = await getPublishedProjects();
    renderProjects(allPublishedProjects, activeCategory);
  } catch (err) {
    console.error("Failed to load projects", err);
    portfolioGrid.innerHTML = `
      <div class="empty-state" style="grid-column: span 12;">
        <p class="empty-state-text">Something went wrong while loading the projects.</p>
      </div>
    `;
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.getAttribute("data-category") || "all";
      renderProjects(allPublishedProjects, activeCategory);
    });
  });

  setupShowreelPlayer();
}

function renderProjects(projects, category = "all") {
  const grid = document.getElementById("portfolio-grid");
  if (!grid) return;

  const filtered = category === "all" 
    ? projects 
    : projects.filter((p) => (p.category || "").toLowerCase() === category.toLowerCase());

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: span 12;">
        <p class="empty-state-text">No published projects found.</p>
      </div>
    `;
    return;
  }

  let html = "";
  filtered.forEach((p, idx) => {
    let spanClass = "medium-span-6";
    if (idx === 0 || (idx % 3 === 0 && p.featured)) {
      spanClass = "featured-hero";
    }

    const title = escapeHtml(i18n.getLocalized(p, "title") || "Untitled Project");
    const role = escapeHtml(i18n.getLocalized(p, "role") || "Director");
    const client = escapeHtml(p.client_name || "");
    const year = escapeHtml(p.year || "");
    const cover = p.cover_image || p.hero_media || "assets/images/placeholder.jpg";
    const categoryLabel = getCategoryLabel(p.category);

    html += `
      <article class="project-card ${spanClass}" data-category="${escapeHtml(p.category || '')}">
        <a href="project.html?id=${encodeURIComponent(p.slug || p.id)}" class="project-card-link" aria-label="${title}">
          <div class="project-card-media">
            <img class="project-card-img" src="${escapeHtml(cover)}" alt="${title}" loading="lazy" />
            <div class="project-card-overlay"></div>
            ${p.featured ? `<span class="project-card-badge">FEATURED</span>` : ""}
          </div>
          <div class="project-card-meta">
            <div class="project-card-category">${categoryLabel} • ${role}</div>
            <h3 class="project-card-title">${title}</h3>
            <div class="project-card-client-year">${client} <span>—</span> ${year}</div>
          </div>
        </a>
      </article>
    `;
  });

  grid.innerHTML = html;
}

function getCategoryLabel(cat) {
  switch ((cat || "").toLowerCase()) {
    case "commercial": return "COMMERCIAL";
    case "branded": return "BRANDED CONTENT";
    case "reels": return "REELS";
    case "social": return "SOCIAL";
    default: return "OTHER";
  }
}

/* ============================================================
 * SHOWREEL PLAYER CONTROLLER
 * ============================================================ */
function setupShowreelPlayer() {
  const container = document.querySelector(".showreel-player-wrapper");
  if (!container) return;

  const video = container.querySelector(".showreel-video");
  const playBtn = container.querySelector(".showreel-play-center");
  const muteBtn = container.querySelector(".showreel-mute-btn");
  const fullscreenBtn = container.querySelector(".showreel-fs-btn");
  const progressFill = container.querySelector(".showreel-progress-fill");
  const progressBar = container.querySelector(".showreel-progress-bar");

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

  if (playBtn) playBtn.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);

  video.addEventListener("timeupdate", () => {
    if (video.duration && progressFill) {
      const pct = (video.currentTime / video.duration) * 100;
      progressFill.style.width = `${pct}%`;
    }
  });

  if (progressBar) {
    progressBar.addEventListener("click", (e) => {
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      if (video.duration) {
        video.currentTime = pos * video.duration;
      }
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? "UNMUTE" : "MUTE";
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        container.requestFullscreen();
      }
    });
  }
}

/* ============================================================
 * CONTACT FORM
 * ============================================================ */
function setupContactForm(form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("#contact-name")?.value || "";
    const email = form.querySelector("#contact-email")?.value || "";
    const company = form.querySelector("#contact-company")?.value || "";
    const type = form.querySelector("#contact-type")?.value || "";
    const message = form.querySelector("#contact-message")?.value || "";

    if (!name || !email || !message) {
      Toast.error("Please fill in all required fields.");
      return;
    }

    const subject = encodeURIComponent(`Project Inquiry: ${name} (${company || "Direct"}) - ${type}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nProject Type: ${type}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:${CONFIG.CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    Toast.success("Opening your email client to send inquiry...");
    form.reset();
  });
}

/* ============================================================
 * CUSTOM CINEMATIC CURSOR
 * ============================================================ */
function setupCustomCursor() {
  if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const cursor = document.createElement("div");
  cursor.className = "cinematic-cursor";
  cursor.innerHTML = `<div class="cursor-dot"></div>`;
  document.body.appendChild(cursor);

  let mouseX = -100, mouseY = -100;
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  const clickables = "a, button, input, select, textarea, .still-item, .project-card";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(clickables)) {
      cursor.classList.add("cursor-hover");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(clickables)) {
      cursor.classList.remove("cursor-hover");
    }
  });
}
