/**
 * profile-sync.js — Samir El-Hosary Portfolio
 * ─────────────────────────────────────────────
 * Reads the profile object saved by the Admin CMS from:
 *   localStorage key: samir_portfolio_db_profile
 *
 * Then updates every matching [data-profile-*] element and
 * [data-profile-href-*] attribute on the page.
 *
 * Usage — add attributes to any HTML element:
 *   data-profile-text="email"        → sets element.textContent
 *   data-profile-text="phone"        → sets element.textContent
 *   data-profile-text="full_name_en" → sets element.textContent
 *   data-profile-text="title_en"     → sets element.textContent
 *   data-profile-text="bio_en"       → sets element.textContent
 *   data-profile-text="image_url"    → sets element.textContent
 *
 *   data-profile-href="email"        → sets href="mailto:{value}"
 *   data-profile-href="phone"        → sets href="tel:{value}"
 *   data-profile-href="instagram"    → sets href="{value}"
 *   data-profile-href="behance"      → sets href="{value}"
 *   data-profile-href="linkedin"     → sets href="{value}"
 *   data-profile-href="youtube"      → sets href="{value}"
 *
 *   data-profile-src="image_url"     → sets element.src (for <img>)
 *   data-profile-alt="full_name_en"  → sets element.alt (for <img>)
 *
 * Works on file:/// and any HTTP server. No dependencies.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'samir_portfolio_db_profile';

  /** Default fallback (mirrors admin-bundle.js DEMO_PROFILE) */
  const DEFAULTS = {
    full_name_en:       'Samir El-Hosary',
    title_en:           'Director & Filmmaker',
    secondary_title_en: 'Commercial Director / Videographer',
    bio_en:             "I'm Samir El-Hosary, a director and filmmaker focused on commercials, branded content and visual storytelling. My work combines directing, cinematography, editing and visual development to build films that communicate clearly and feel visually intentional.",
    image_url:          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    email:              'contact@samirelhosary.com',
    phone:              '+20 100 000 0000',
    instagram:          'https://instagram.com/samirelhosary',
    behance:            'https://behance.net/samirelhosary',
    linkedin:           'https://linkedin.com/in/samirelhosary',
    youtube:            'https://youtube.com/@samirelhosary'
  };

  /** Load profile — merge saved data over defaults */
  function loadProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return Object.assign({}, DEFAULTS, JSON.parse(raw));
      }
    } catch (e) {
      // JSON parse error — fall through to defaults
    }
    return Object.assign({}, DEFAULTS);
  }

  /** Build the correct href value for a field */
  function buildHref(field, value) {
    if (!value) return '#';
    if (field === 'email')   return 'mailto:' + value;
    if (field === 'phone')   return 'tel:'    + value.replace(/\s+/g, '');
    return value; // instagram, behance, linkedin, youtube — already full URLs
  }

  /** Apply profile data to the page */
  function applyProfile(profile) {

    // ── data-profile-text="fieldName" ──────────────────────────────
    document.querySelectorAll('[data-profile-text]').forEach(function (el) {
      var field = el.getAttribute('data-profile-text');
      if (profile[field] !== undefined) {
        el.textContent = profile[field];
      }
    });

    // ── data-profile-href="fieldName" ──────────────────────────────
    document.querySelectorAll('[data-profile-href]').forEach(function (el) {
      var field = el.getAttribute('data-profile-href');
      if (profile[field] !== undefined) {
        el.href = buildHref(field, profile[field]);
        // Also update visible text for email/phone links if they have no separate data-profile-text
        if (!el.hasAttribute('data-profile-text') && (field === 'email' || field === 'phone')) {
          el.textContent = profile[field];
        }
      }
    });

    // ── data-profile-src="fieldName" ───────────────────────────────
    document.querySelectorAll('[data-profile-src]').forEach(function (el) {
      var field = el.getAttribute('data-profile-src');
      if (profile[field] !== undefined && profile[field]) {
        el.src = profile[field];
      }
    });

    // ── data-profile-alt="fieldName" ───────────────────────────────
    document.querySelectorAll('[data-profile-alt]').forEach(function (el) {
      var field = el.getAttribute('data-profile-alt');
      if (profile[field] !== undefined) {
        el.alt = profile[field];
      }
    });
  }

  /** Run immediately (DOM is already parsed since script is at bottom) */
  function run() {
    var profile = loadProfile();
    applyProfile(profile);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

})();
