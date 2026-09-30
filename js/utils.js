/**
 * SAMIR EL-HOSARY — Utility Module (utils.js)
 * Toast notifications, Custom Lightbox, Before/After Slider, Modals, Formatters.
 */

import { i18n } from "./i18n.js";

/**
 * Toast Notification System
 */
export const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "toast-container";
      this.container.className = "toast-container";
      document.body.appendChild(this.container);
    }
  },

  show(message, type = "info", duration = 4000) {
    this.init();
    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type}`;
    
    // Icon
    let iconSvg = "";
    if (type === "success") {
      iconSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === "error") {
      iconSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    } else {
      iconSvg = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-message">${escapeHtml(message)}</div>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;

    toast.querySelector(".toast-close").addEventListener("click", () => {
      this.dismiss(toast);
    });

    this.container.appendChild(toast);

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(toast);
      }, duration);
    }
  },

  success(msg, dur) { this.show(msg, "success", dur); },
  error(msg, dur) { this.show(msg, "error", dur); },
  info(msg, dur) { this.show(msg, "info", dur); },

  dismiss(toast) {
    toast.classList.add("toast-hiding");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }
};

/**
 * Custom Confirmation Modal Dialog
 */
export function confirmDialog(message, title = null) {
  return new Promise((resolve) => {
    const isAr = i18n.lang === "ar";
    const modal = document.createElement("div");
    modal.className = "cinematic-modal-overlay active";
    modal.innerHTML = `
      <div class="cinematic-modal-box">
        ${title ? `<h3 class="modal-title">${escapeHtml(title)}</h3>` : ""}
        <p class="modal-text">${escapeHtml(message)}</p>
        <div class="modal-actions">
          <button class="btn btn-secondary modal-cancel-btn">${isAr ? "إلغاء" : "Cancel"}</button>
          <button class="btn btn-danger modal-confirm-btn">${isAr ? "تأكيد" : "Confirm"}</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const onCancel = () => {
      document.body.removeChild(modal);
      resolve(false);
    };

    const onConfirm = () => {
      document.body.removeChild(modal);
      resolve(true);
    };

    modal.querySelector(".modal-cancel-btn").addEventListener("click", onCancel);
    modal.querySelector(".modal-confirm-btn").addEventListener("click", onConfirm);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) onCancel();
    });
  });
}

/**
 * Custom Vanilla Lightbox for Fullscreen Image Viewing
 */
export class Lightbox {
  constructor() {
    this.images = [];
    this.currentIndex = 0;
    this.overlay = null;
    this.boundKeyHandler = this.onKeyDown.bind(this);
    this.init();
  }

  init() {
    if (document.getElementById("cinematic-lightbox")) return;

    this.overlay = document.createElement("div");
    this.overlay.id = "cinematic-lightbox";
    this.overlay.className = "lightbox-overlay";
    this.overlay.innerHTML = `
      <div class="lightbox-toolbar">
        <span class="lightbox-counter"></span>
        <button class="lightbox-close" aria-label="Close Lightbox">&times;</button>
      </div>
      <button class="lightbox-prev" aria-label="Previous Image">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="lightbox-stage">
        <img class="lightbox-image" src="" alt="Fullscreen Still" />
        <div class="lightbox-caption"></div>
      </div>
      <button class="lightbox-next" aria-label="Next Image">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    `;

    document.body.appendChild(this.overlay);

    this.imgEl = this.overlay.querySelector(".lightbox-image");
    this.captionEl = this.overlay.querySelector(".lightbox-caption");
    this.counterEl = this.overlay.querySelector(".lightbox-counter");

    this.overlay.querySelector(".lightbox-close").addEventListener("click", () => this.close());
    this.overlay.querySelector(".lightbox-prev").addEventListener("click", () => this.prev());
    this.overlay.querySelector(".lightbox-next").addEventListener("click", () => this.next());

    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay || e.target.classList.contains("lightbox-stage")) {
        this.close();
      }
    });
  }

  setItems(items) {
    // items: array of { src, caption, title }
    this.images = items;
  }

  open(index = 0) {
    if (!this.images || this.images.length === 0) return;
    this.currentIndex = index;
    this.updateContent();
    this.overlay.classList.add("active");
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", this.boundKeyHandler);
  }

  close() {
    this.overlay.classList.remove("active");
    document.body.style.overflow = "";
    window.removeEventListener("keydown", this.boundKeyHandler);
  }

  prev() {
    if (this.images.length <= 1) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateContent();
  }

  next() {
    if (this.images.length <= 1) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateContent();
  }

  updateContent() {
    const item = this.images[this.currentIndex];
    if (!item) return;

    this.imgEl.style.opacity = "0";
    setTimeout(() => {
      this.imgEl.src = item.src;
      this.imgEl.alt = item.title || "";
      this.captionEl.textContent = item.caption || item.title || "";
      this.counterEl.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
      this.imgEl.style.opacity = "1";
    }, 150);
  }

  onKeyDown(e) {
    if (e.key === "Escape") this.close();
    if (e.key === "ArrowLeft") {
      i18n.lang === "ar" ? this.next() : this.prev();
    }
    if (e.key === "ArrowRight") {
      i18n.lang === "ar" ? this.prev() : this.next();
    }
  }
}

/**
 * Before/After Image & Video Comparison Slider
 */
export function initBeforeAfterSlider(container) {
  if (!container) return;

  const sliderHandle = container.querySelector(".ba-slider-handle");
  const beforeWrapper = container.querySelector(".ba-before-wrapper");
  if (!sliderHandle || !beforeWrapper) return;

  let isDragging = false;

  const setPosition = (percent) => {
    const clamped = Math.max(0, Math.min(100, percent));
    sliderHandle.style.left = `${clamped}%`;
    beforeWrapper.style.clipPath = `polygon(0 0, ${clamped}% 0, ${clamped}% 100%, 0 100%)`;
  };

  const handleMove = (clientX) => {
    const rect = container.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percent = (offsetX / rect.width) * 100;
    setPosition(percent);
  };

  sliderHandle.addEventListener("mousedown", () => { isDragging = true; });
  window.addEventListener("mouseup", () => { isDragging = false; });
  window.addEventListener("mousemove", (e) => {
    if (isDragging) handleMove(e.clientX);
  });

  // Touch support for mobile
  sliderHandle.addEventListener("touchstart", () => { isDragging = true; }, { passive: true });
  window.addEventListener("touchend", () => { isDragging = false; });
  window.addEventListener("touchmove", (e) => {
    if (isDragging && e.touches[0]) handleMove(e.touches[0].clientX);
  });

  // Click on container anywhere to move divider
  container.addEventListener("click", (e) => {
    handleMove(e.clientX);
  });

  // Default at 50%
  setPosition(50);
}

/**
 * Safe HTML escape
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
