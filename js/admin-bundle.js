/**
 * SAMIR EL-HOSARY — Director CMS (admin-bundle.js)
 * Standalone Vanilla JavaScript bundle for Admin Dashboard.
 * Works seamlessly both via HTTP/HTTPS and direct file:/// opening.
 * Pure Vanilla JavaScript — zero dependencies, zero frameworks.
 */

(function () {
  "use strict";

  /* ============================================================
   * 1. CONFIGURATION
   * ============================================================ */
  const CONFIG = {
    SUPABASE_URL: "YOUR_SUPABASE_URL",
    SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",
    STORAGE_BUCKET: "portfolio-media",
    CONTACT_EMAIL: "contact@samirelhosary.com",
    DEFAULT_LANG: "en",
    IS_CONFIGURED() {
      return (
        this.SUPABASE_URL &&
        this.SUPABASE_URL !== "YOUR_SUPABASE_URL" &&
        this.SUPABASE_ANON_KEY &&
        this.SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY"
      );
    }
  };

  /* ============================================================
   * 2. STORAGE LAYER (localStorage & Session)
   * ============================================================ */
  const STORAGE_KEYS = {
    SESSION: "samir_portfolio_session",
    LOCAL_DB_PREFIX: "samir_portfolio_db_",
    CONFIG_OVERRIDE: "samir_portfolio_config_override"
  };

  const Storage = {
    getSession() {
      try {
        const s = localStorage.getItem(STORAGE_KEYS.SESSION);
        return s ? JSON.parse(s) : null;
      } catch (e) {
        return null;
      }
    },

    setSession(sessionData) {
      try {
        if (!sessionData) {
          localStorage.removeItem(STORAGE_KEYS.SESSION);
        } else {
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
        }
      } catch (e) {}
    },

    removeSession() {
      try {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      } catch (e) {}
    },

    getLocalCollection(name, defaultData = []) {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_DB_PREFIX + name);
        if (!raw) {
          this.setLocalCollection(name, defaultData);
          return defaultData;
        }
        return JSON.parse(raw);
      } catch (e) {
        return defaultData;
      }
    },

    setLocalCollection(name, data) {
      try {
        localStorage.setItem(STORAGE_KEYS.LOCAL_DB_PREFIX + name, JSON.stringify(data));
      } catch (e) {}
    },

    getConfigOverride() {
      try {
        const s = localStorage.getItem(STORAGE_KEYS.CONFIG_OVERRIDE);
        return s ? JSON.parse(s) : null;
      } catch (e) {
        return null;
      }
    }
  };

  function getActiveConfig() {
    const override = Storage.getConfigOverride();
    if (override && override.SUPABASE_URL && override.SUPABASE_ANON_KEY) {
      return {
        ...CONFIG,
        SUPABASE_URL: override.SUPABASE_URL,
        SUPABASE_ANON_KEY: override.SUPABASE_ANON_KEY
      };
    }
    return CONFIG;
  }

  /* ============================================================
   * 3. INITIAL DEMO DATA
   * ============================================================ */
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
      concept_en: "Transforming static geometric structures into breathing living spaces interacting with residents, driven by disciplined wide anamorphic framing and continuous motion.",
      challenge_en: "Conveying monumental scale without sacrificing human intimacy, while managing extreme contrast in harsh midday sunlight and expansive glass facades.",
      approach_en: "Anchoring the visual palette in golden-hour and twilight transitions, contrasting bold architectural geometry with tactile macro textures.",
      execution_en: "Filmed over 4 production days using RED V-Raptor and stabilized cinema rigs, followed by rhythm-driven pacing and fine-tuned ACES color grading.",
      production_notes_en: "Shot on RED V-Raptor 8K VV with Atlas Orion Anamorphic lenses and Steadicam.",
      cover_image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
      hero_media: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
      hero_media_type: "image",
      final_film_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      featured: true,
      status: "published",
      sort_order: 1,
      credits: {
        director: "Samir El-Hosary",
        cinematographer: "Samir El-Hosary & Crew",
        editor: "Samir El-Hosary",
        colorist: "Ahmed Zaki",
        producer: "Kareem Tarek",
        agency: "Apex Creative"
      },
      created_at: "2026-03-01T10:00:00Z"
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
      concept_en: "Expressing velocity through visceral sensory metaphors: the driver’s heartbeat, muscle tension, and tactile tire friction against asphalt.",
      challenge_en: "Tracking action at 140+ km/h on narrow mountain hairpin curves while ensuring absolute crew safety and flawless camera stability.",
      approach_en: "Deploying high-speed chase vehicles with gyro-stabilized tracking cranes, low-to-ground pursuit angles, and tight shutter angles for razor sharpness.",
      execution_en: "Two continuous production days at a desert circuit with multi-mic onboard engine telemetry recordings for bespoke foley and sound design.",
      production_notes_en: "ARRI Alexa Mini LF with Cooke S7/i Full Frame Plus Cine Primes.",
      cover_image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
      hero_media: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=80",
      hero_media_type: "image",
      final_film_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      featured: true,
      status: "published",
      sort_order: 2,
      credits: {
        director: "Samir El-Hosary",
        cinematographer: "Tamer Mostafa",
        editor: "Samir El-Hosary",
        colorist: "Leo Dupont",
        producer: "Sherif Fawzy",
        agency: "Speed & Vision"
      },
      created_at: "2026-02-15T09:00:00Z"
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
      concept_en: "Shunning cold institutional aesthetics to focus on authentic eye contact, reassuring touch, and powerful quiet pauses of empathy.",
      challenge_en: "Operating within active clinical wards requiring minimal equipment footprint, complete silence, and high ethical sensitivity.",
      approach_en: "Relying on soft available lighting and large-format shallow depth of field, paired with organic conversational direction rather than rigid scripting.",
      execution_en: "Filmed across 3 days in neonatal, cardio, and rehab wings, scored with an original acoustic cello and piano composition.",
      production_notes_en: "Sony FX9 & FX6 rigs with Sony G-Master Cine Primes and Tilta Nucleus-M focus.",
      cover_image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80",
      hero_media: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80",
      hero_media_type: "image",
      final_film_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      featured: false,
      status: "published",
      sort_order: 3,
      credits: {
        director: "Samir El-Hosary",
        cinematographer: "Samir El-Hosary",
        editor: "Nader Adel",
        colorist: "Ahmed Zaki",
        producer: "Mona Salem",
        agency: "Heartbeat Brand Group"
      },
      created_at: "2025-11-10T11:00:00Z"
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
      concept_en: "Treating apparel as fluid kinetic sculptures through seamless in-camera match cuts, dynamic whip pans, and precision tempo-locked speed ramping.",
      challenge_en: "Achieving true anamorphic cine-grade fidelity natively formatted in 9:16 vertical ratio without standard handheld mobile artifacts.",
      approach_en: "Rigging the cinema camera vertically at 90 degrees with motorized DMX-controlled RGB light tubes synchronized to the audio waveform.",
      execution_en: "Studio shoot over a single 12-hour session with 6 performers, followed by frame-accurate beat editing and sound design.",
      production_notes_en: "Blackmagic URSA Mini Pro 12K mounted vertically with DZOFilm Vespid Primes.",
      cover_image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80",
      hero_media: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80",
      hero_media_type: "image",
      final_film_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      featured: false,
      status: "published",
      sort_order: 4,
      credits: {
        director: "Samir El-Hosary",
        cinematographer: "Fady Morris",
        editor: "Samir El-Hosary",
        colorist: "Ahmed Zaki",
        producer: "Nouran Ezzat",
        agency: "Neon Pulse Studios"
      },
      created_at: "2026-01-20T14:00:00Z"
    }
  ];

  const DEMO_FEEDBACK = [
    {
      id: "f1",
      project_id: "a1111111-1111-1111-1111-111111111111",
      quote_en: "Working with Samir was seamless from the first concept to the final delivery. He understood our vision intuitively and translated it into a commanding cinematic piece that made a massive market impression.",
      client_name: "Tarek El-Minshawi",
      client_role_en: "Chief Marketing Officer",
      company: "Metropolis Development",
      is_visible: true,
      created_at: "2026-03-06T10:00:00Z"
    },
    {
      id: "f2",
      project_id: "b2222222-2222-2222-2222-222222222222",
      quote_en: "Samir possesses an unmatched rhythmic sensibility for automotive and high-velocity storytelling. The result surpassed our highest benchmarks and became our top-performing film.",
      client_name: "Carlos Mendez",
      client_role_en: "Global Brand Director",
      company: "Veloce Performance",
      is_visible: true,
      created_at: "2026-02-22T14:00:00Z"
    }
  ];

  const DEMO_MEDIA = [
    {
      id: "m1",
      project_id: "a1111111-1111-1111-1111-111111111111",
      type: "image",
      category: "stills",
      file_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
      title_en: "Geometric Lines Framing",
      caption_en: "Wide composition capturing dawn light reflection",
      is_public: true
    },
    {
      id: "m2",
      project_id: "a1111111-1111-1111-1111-111111111111",
      type: "image",
      category: "stills",
      file_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
      title_en: "Skyward Reflection",
      caption_en: "Low-angle perspective accentuating glass monumentality",
      is_public: true
    },
    {
      id: "m3",
      project_id: "b2222222-2222-2222-2222-222222222222",
      type: "image",
      category: "stills",
      file_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
      title_en: "High-Speed Silhouette",
      caption_en: "Tracking angle through sweeping high-speed corners",
      is_public: true
    }
  ];

  const DEMO_PROFILE = {
    full_name_en: "Samir El-Hosary",
    title_en: "Director & Filmmaker",
    secondary_title_en: "Commercial Director / Videographer",
    bio_en: "I’m Samir El-Hosary, a director and filmmaker focused on commercials, branded content and visual storytelling. My work combines directing, cinematography, editing and visual development to build films that communicate clearly and feel visually intentional.",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    email: "contact@samirelhosary.com",
    phone: "+20 100 000 0000",
    instagram: "https://instagram.com/samirelhosary",
    behance: "https://behance.net/samirelhosary",
    linkedin: "https://linkedin.com/in/samirelhosary",
    youtube: "https://youtube.com/@samirelhosary"
  };

  const DEMO_SETTINGS = {
    hero_title_en: "SAMIR EL-HOSARY",
    hero_desc_en: "I create visual stories, commercials and branded films that turn ideas into images people remember.",
    showreel_video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    showreel_poster: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=80",
    stat_years: "8+",
    stat_projects: "65+"
  };

  /* ============================================================
   * 4. DATA ACCESS LAYER (Supabase Fetch + Local Fallback)
   * ============================================================ */
  async function supabaseFetch(endpoint, options = {}) {
    const cfg = getActiveConfig();
    if (!cfg.IS_CONFIGURED()) {
      throw new Error("SUPABASE_NOT_CONFIGURED");
    }

    const url = `${cfg.SUPABASE_URL.replace(/\/$/, "")}${endpoint}`;
    const session = Storage.getSession();
    const token = session?.access_token || cfg.SUPABASE_ANON_KEY;

    const response = await fetch(url, {
      ...options,
      headers: {
        "apikey": cfg.SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers
      }
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    if (response.status === 204) return null;
    return response.json();
  }

  async function apiLogin(email, password) {
    const cfg = getActiveConfig();
    if (cfg.IS_CONFIGURED()) {
      const url = `${cfg.SUPABASE_URL.replace(/\/$/, "")}/auth/v1/token?grant_type=password`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "apikey": cfg.SUPABASE_ANON_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error("Invalid Supabase credentials");
      const session = await response.json();
      Storage.setSession(session);
      return session;
    }

    // Demo session
    const mockSession = {
      access_token: "demo_admin_token_" + Date.now(),
      token_type: "bearer",
      user: { id: "demo-admin", email: email || "admin@samirelhosary.com" },
      is_demo_mode: true
    };
    Storage.setSession(mockSession);
    return mockSession;
  }

  async function apiLogout() {
    Storage.removeSession();
    return true;
  }

  async function getProjects() {
    const cfg = getActiveConfig();
    if (cfg.IS_CONFIGURED()) {
      try {
        return await supabaseFetch("/rest/v1/projects?select=*&order=sort_order.asc,created_at.desc");
      } catch (e) {}
    }
    return Storage.getLocalCollection("projects", DEMO_PROJECTS);
  }

  async function getProjectById(id) {
    const all = await getProjects();
    return all.find((p) => p.id === id || p.slug === id) || null;
  }

  async function createProject(payload) {
    const all = Storage.getLocalCollection("projects", DEMO_PROJECTS);
    const newProj = {
      ...payload,
      id: "proj_" + Date.now().toString(36),
      slug: (payload.title_en || "project").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      created_at: new Date().toISOString()
    };
    all.unshift(newProj);
    Storage.setLocalCollection("projects", all);
    return newProj;
  }

  async function updateProject(id, payload) {
    const all = Storage.getLocalCollection("projects", DEMO_PROJECTS);
    const idx = all.findIndex((p) => p.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...payload, updated_at: new Date().toISOString() };
      Storage.setLocalCollection("projects", all);
      return all[idx];
    }
    throw new Error("Project not found");
  }

  async function deleteProject(id) {
    let all = Storage.getLocalCollection("projects", DEMO_PROJECTS);
    all = all.filter((p) => p.id !== id);
    Storage.setLocalCollection("projects", all);
    return true;
  }

  async function duplicateProject(id) {
    const orig = await getProjectById(id);
    if (!orig) throw new Error("Original not found");
    const copy = {
      ...orig,
      id: "proj_" + Date.now().toString(36),
      title_en: `${orig.title_en} (Copy)`,
      status: "draft"
    };
    const all = Storage.getLocalCollection("projects", DEMO_PROJECTS);
    all.unshift(copy);
    Storage.setLocalCollection("projects", all);
    return copy;
  }

  async function getAllMedia() {
    return Storage.getLocalCollection("project_media", DEMO_MEDIA);
  }

  async function deleteProjectMedia(id) {
    let all = Storage.getLocalCollection("project_media", DEMO_MEDIA);
    all = all.filter((m) => m.id !== id);
    Storage.setLocalCollection("project_media", all);
    return true;
  }

  async function addProjectMedia(media) {
    const all = Storage.getLocalCollection("project_media", DEMO_MEDIA);
    const item = { ...media, id: "media_" + Date.now().toString(36) };
    all.push(item);
    Storage.setLocalCollection("project_media", all);
    return item;
  }

  async function getFeedback() {
    return Storage.getLocalCollection("project_feedback", DEMO_FEEDBACK);
  }

  async function createFeedback(fb) {
    const all = Storage.getLocalCollection("project_feedback", DEMO_FEEDBACK);
    const item = { ...fb, id: "fb_" + Date.now().toString(36) };
    all.unshift(item);
    Storage.setLocalCollection("project_feedback", all);
    return item;
  }

  async function updateFeedback(id, payload) {
    const all = Storage.getLocalCollection("project_feedback", DEMO_FEEDBACK);
    const idx = all.findIndex((f) => f.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...payload };
      Storage.setLocalCollection("project_feedback", all);
      return all[idx];
    }
  }

  async function deleteFeedback(id) {
    let all = Storage.getLocalCollection("project_feedback", DEMO_FEEDBACK);
    all = all.filter((f) => f.id !== id);
    Storage.setLocalCollection("project_feedback", all);
    return true;
  }

  async function getProfile() {
    return Storage.getLocalCollection("profile", DEMO_PROFILE);
  }

  async function updateProfile(payload) {
    const current = Storage.getLocalCollection("profile", DEMO_PROFILE);
    const updated = { ...current, ...payload };
    Storage.setLocalCollection("profile", updated);
    return updated;
  }

  async function getSiteSettings() {
    return Storage.getLocalCollection("site_settings", DEMO_SETTINGS);
  }

  async function updateSiteSetting(key, val) {
    const current = Storage.getLocalCollection("site_settings", DEMO_SETTINGS);
    current[key] = val;
    Storage.setLocalCollection("site_settings", current);
    return current;
  }

  /* ============================================================
   * 5. UTILITIES (Toast, Confirmation Modal, Escape)
   * ============================================================ */
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getLocalizedText(obj, field) {
    if (!obj) return "";
    return obj[`${field}_en`] || obj[field] || obj[`${field}_ar`] || "";
  }

  const Toast = {
    show(msg, type = "info") {
      let container = document.getElementById("toast-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "toast-container";
        document.body.appendChild(container);
      }

      const item = document.createElement("div");
      item.className = `toast-item toast-${type}`;
      item.innerHTML = `
        <div class="toast-message">${escapeHtml(msg)}</div>
        <button class="toast-close">&times;</button>
      `;
      item.querySelector(".toast-close").addEventListener("click", () => item.remove());
      container.appendChild(item);
      setTimeout(() => item.remove(), 3500);
    },
    success(msg) { this.show(msg, "success"); },
    error(msg) { this.show(msg, "error"); },
    info(msg) { this.show(msg, "info"); }
  };

  function confirmDialog(message) {
    return new Promise((resolve) => {
      const modal = document.createElement("div");
      modal.className = "cinematic-modal-overlay active";
      modal.innerHTML = `
        <div class="cinematic-modal-box">
          <h3 class="modal-title">Confirm Action</h3>
          <p class="modal-text">${escapeHtml(message)}</p>
          <div class="modal-actions">
            <button class="btn btn-secondary modal-cancel-btn">Cancel</button>
            <button class="btn btn-danger modal-confirm-btn">Confirm</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector(".modal-cancel-btn").addEventListener("click", () => {
        modal.remove();
        resolve(false);
      });
      modal.querySelector(".modal-confirm-btn").addEventListener("click", () => {
        modal.remove();
        resolve(true);
      });
    });
  }

  /* ============================================================
   * 6. ROUTING & CONTROLLERS
   * ============================================================ */
  let currentTab = "overview";
  let projectsCache = [];
  let feedbackCache = [];
  let hasUnsavedChanges = false;

  function showLoginView() {
    const login = document.getElementById("admin-login-view");
    const dash = document.getElementById("admin-dashboard-view");
    if (login && dash) {
      login.style.display = "flex";
      dash.style.display = "none";
    }
  }

  function showDashboardView() {
    const login = document.getElementById("admin-login-view");
    const dash = document.getElementById("admin-dashboard-view");
    if (login && dash) {
      login.style.display = "none";
      dash.style.display = "flex";
    }

    setupSidebar();
    const hash = window.location.hash.replace(/^#/, "");
    navigateTo(hash || "overview");
  }

  function setupSidebar() {
    document.querySelectorAll(".sidebar-link[data-tab]").forEach((link) => {
      link.onclick = (e) => {
        e.preventDefault();
        const tab = link.getAttribute("data-tab");
        window.location.hash = `#${tab}`;
        navigateTo(tab);
      };
    });

    const logout = document.getElementById("sidebar-logout");
    if (logout) {
      logout.onclick = () => {
        apiLogout();
        showLoginView();
        Toast.info("Logged out successfully.");
      };
    }
  }

  function navigateTo(tab) {
    currentTab = tab;
    const sidebar = document.querySelector(".admin-sidebar");
    if (sidebar) sidebar.classList.remove("open");

    document.querySelectorAll(".sidebar-link").forEach((l) => {
      l.classList.toggle("active", l.getAttribute("data-tab") === tab);
    });

    const titleEl = document.getElementById("admin-page-title");
    const workspace = document.getElementById("admin-workspace");
    if (!workspace) return;

    if (tab === "overview") {
      if (titleEl) titleEl.textContent = "Dashboard Overview";
      renderOverviewTab(workspace);
    } else if (tab === "projects") {
      if (titleEl) titleEl.textContent = "Projects Management";
      renderProjectsTab(workspace);
    } else if (tab === "add-project") {
      if (titleEl) titleEl.textContent = "Add New Project";
      renderEditorTab(workspace, null);
    } else if (tab === "media") {
      if (titleEl) titleEl.textContent = "Media Library";
      renderMediaTab(workspace);
    } else if (tab === "feedback") {
      if (titleEl) titleEl.textContent = "Client Feedback";
      renderFeedbackTab(workspace);
    } else if (tab === "profile") {
      if (titleEl) titleEl.textContent = "Profile Settings";
      renderProfileTab(workspace);
    } else if (tab === "settings") {
      if (titleEl) titleEl.textContent = "Site Settings";
      renderSettingsTab(workspace);
    } else if (tab.startsWith("edit-project-")) {
      const id = tab.replace("edit-project-", "");
      if (titleEl) titleEl.textContent = "Edit Project";
      renderEditorTab(workspace, id);
    } else {
      renderOverviewTab(workspace);
    }
  }

  /* --- TAB: OVERVIEW --- */
  async function renderOverviewTab(container) {
    container.innerHTML = `
      <div class="admin-stats-row">
        <div class="admin-stat-card">
          <div class="admin-stat-label">TOTAL PROJECTS</div>
          <div class="admin-stat-val" id="stat-total">-</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-label">PUBLISHED</div>
          <div class="admin-stat-val" id="stat-published" style="color: #10b981;">-</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-label">DRAFTS</div>
          <div class="admin-stat-val" id="stat-drafts" style="color: #f59e0b;">-</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-label">CLIENT FEEDBACK</div>
          <div class="admin-stat-val" id="stat-feedback">-</div>
        </div>
        <div class="admin-stat-card">
          <div class="admin-stat-label">MEDIA FILES</div>
          <div class="admin-stat-val" id="stat-media">-</div>
        </div>
      </div>

      <div class="admin-card">
        <div class="admin-card-header">
          <h3 class="admin-card-title">QUICK ACTIONS</h3>
        </div>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button id="qa-add-btn" class="btn btn-primary">+ ADD PROJECT</button>
          <button id="qa-manage-btn" class="btn btn-secondary">MANAGE PROJECTS</button>
          <a href="index.html" target="_blank" class="btn btn-secondary">VIEW PUBLIC PORTFOLIO ↗</a>
        </div>
      </div>

      <div class="admin-card">
        <div class="admin-card-header">
          <h3 class="admin-card-title">RECENT PROJECTS</h3>
          <button id="qa-view-all" class="link-arrow" style="font-size: 0.8rem;">VIEW ALL PROJECTS →</button>
        </div>
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>COVER</th>
                <th>TITLE</th>
                <th>CLIENT</th>
                <th>CATEGORY</th>
                <th>YEAR</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody id="overview-tbody">
              <tr><td colspan="6" style="text-align: center; padding: 2rem;">Loading...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById("qa-add-btn").onclick = () => navigateTo("add-project");
    document.getElementById("qa-manage-btn").onclick = () => navigateTo("projects");
    document.getElementById("qa-view-all").onclick = () => navigateTo("projects");

    const [projects, media, fb] = await Promise.all([getProjects(), getAllMedia(), getFeedback()]);
    document.getElementById("stat-total").textContent = projects.length;
    document.getElementById("stat-published").textContent = projects.filter((p) => p.status === "published").length;
    document.getElementById("stat-drafts").textContent = projects.filter((p) => p.status === "draft").length;
    document.getElementById("stat-feedback").textContent = fb.length;
    document.getElementById("stat-media").textContent = media.length;

    const tbody = document.getElementById("overview-tbody");
    if (projects.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem;">No projects yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = projects.slice(0, 5).map((p) => `
      <tr style="cursor: pointer;" onclick="window.location.hash = '#edit-project-${p.id}'">
        <td><img src="${escapeHtml(p.cover_image || 'assets/images/placeholder.jpg')}" class="tbl-thumbnail" alt="" /></td>
        <td><strong>${escapeHtml(getLocalizedText(p, "title"))}</strong></td>
        <td>${escapeHtml(p.client_name || "")}</td>
        <td style="text-transform: uppercase;">${escapeHtml(p.category || "")}</td>
        <td>${escapeHtml(p.year || "")}</td>
        <td><span class="badge ${p.status === 'published' ? 'badge-published' : 'badge-draft'}">${(p.status || 'draft').toUpperCase()}</span></td>
      </tr>
    `).join("");
  }

  /* --- TAB: PROJECTS --- */
  async function renderProjectsTab(container) {
    container.innerHTML = `
      <div class="table-toolbar">
        <div class="table-filters">
          <input type="text" id="proj-search" class="admin-search-input" placeholder="Search projects..." />
          <select id="proj-filter-status" class="form-select" style="width: auto; padding: 0.6rem 1rem; font-size: 0.85rem;">
            <option value="all">ALL STATUSES</option>
            <option value="published">PUBLISHED</option>
            <option value="draft">DRAFT</option>
            <option value="archived">ARCHIVED</option>
          </select>
        </div>
        <div>
          <button id="add-proj-top" class="btn btn-accent">+ ADD PROJECT</button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>COVER</th>
              <th>PROJECT TITLE</th>
              <th>CLIENT</th>
              <th>CATEGORY</th>
              <th>YEAR</th>
              <th>STATUS</th>
              <th>FEATURED</th>
              <th style="text-align: right;">ACTIONS</th>
            </tr>
          </thead>
          <tbody id="projects-tbody">
            <tr><td colspan="8" style="text-align: center; padding: 2rem;">Loading...</td></tr>
          </tbody>
        </table>
      </div>
    `;

    document.getElementById("add-proj-top").onclick = () => navigateTo("add-project");
    projectsCache = await getProjects();

    const renderRows = (list) => {
      const tbody = document.getElementById("projects-tbody");
      if (!tbody) return;
      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2rem;">No projects found.</td></tr>`;
        return;
      }

      tbody.innerHTML = list.map((p) => `
        <tr>
          <td><img src="${escapeHtml(p.cover_image || 'assets/images/placeholder.jpg')}" class="tbl-thumbnail" alt="" /></td>
          <td><strong>${escapeHtml(getLocalizedText(p, "title"))}</strong></td>
          <td>${escapeHtml(p.client_name || "")}</td>
          <td style="text-transform: uppercase;">${escapeHtml(p.category || "")}</td>
          <td>${escapeHtml(p.year || "")}</td>
          <td><span class="badge ${p.status === 'published' ? 'badge-published' : 'badge-draft'}">${(p.status || 'draft').toUpperCase()}</span></td>
          <td>${p.featured ? '<span style="color: #10b981;">★ Yes</span>' : '<span style="color: var(--gray);">-</span>'}</td>
          <td style="text-align: right;">
            <div class="table-actions" style="justify-content: flex-end;">
              <button class="btn-icon edit-btn" data-id="${p.id}" title="Edit Project">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <a href="project.html?id=${encodeURIComponent(p.slug || p.id)}" target="_blank" class="btn-icon" title="View Public Page">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </a>
              <button class="btn-icon dup-btn" data-id="${p.id}" title="Duplicate">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
              <button class="btn-icon danger del-btn" data-id="${p.id}" title="Delete">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `).join("");

      tbody.querySelectorAll(".edit-btn").forEach((b) => {
        b.onclick = () => {
          window.location.hash = `#edit-project-${b.getAttribute("data-id")}`;
          navigateTo(`edit-project-${b.getAttribute("data-id")}`);
        };
      });

      tbody.querySelectorAll(".dup-btn").forEach((b) => {
        b.onclick = async () => {
          await duplicateProject(b.getAttribute("data-id"));
          Toast.success("Project duplicated successfully.");
          projectsCache = await getProjects();
          renderRows(projectsCache);
        };
      });

      tbody.querySelectorAll(".del-btn").forEach((b) => {
        b.onclick = async () => {
          const ok = await confirmDialog("Are you sure you want to permanently delete this project?");
          if (ok) {
            await deleteProject(b.getAttribute("data-id"));
            Toast.success("Project deleted.");
            projectsCache = await getProjects();
            renderRows(projectsCache);
          }
        };
      });
    };

    renderRows(projectsCache);

    const searchInput = document.getElementById("proj-search");
    const statusSelect = document.getElementById("proj-filter-status");
    const onFilter = () => {
      const q = searchInput.value.toLowerCase().trim();
      const st = statusSelect.value;
      const filtered = projectsCache.filter((p) => {
        const title = (p.title_en || p.title_ar || "").toLowerCase();
        const client = (p.client_name || "").toLowerCase();
        const matchesQ = title.includes(q) || client.includes(q);
        const matchesS = st === "all" || p.status === st;
        return matchesQ && matchesS;
      });
      renderRows(filtered);
    };

    searchInput.oninput = onFilter;
    statusSelect.onchange = onFilter;
  }

  /* --- TAB: ADD/EDIT PROJECT --- */
  async function renderEditorTab(container, projectId) {
    let p = {
      title_en: "",
      client_name: "",
      year: "2026",
      category: "commercial",
      role_en: "Director",
      description_en: "",
      concept_en: "",
      challenge_en: "",
      approach_en: "",
      execution_en: "",
      production_notes_en: "",
      cover_image: "",
      hero_media: "",
      hero_media_type: "image",
      final_film_url: "",
      status: "draft",
      featured: false,
      sort_order: 1,
      credits: { director: "Samir El-Hosary" }
    };

    if (projectId) {
      const existing = await getProjectById(projectId);
      if (existing) p = existing;
    }

    container.innerHTML = `
      <form id="project-form">
        <div class="editor-header">
          <div>
            <h2 style="font-size: 1.35rem; font-weight: 700;">
              ${projectId ? "EDIT PROJECT" : "ADD NEW PROJECT"}
            </h2>
          </div>
          <div style="display: flex; gap: 1rem;">
            <button type="button" id="ed-cancel" class="btn btn-secondary">CANCEL</button>
            <button type="button" id="ed-draft" class="btn btn-secondary">SAVE DRAFT</button>
            <button type="submit" class="btn btn-accent">PUBLISH PROJECT</button>
          </div>
        </div>

        <div class="editor-section">
          <h3 class="editor-section-title">BASIC INFORMATION</h3>
          <div class="form-group">
            <label class="form-label">Project Title *</label>
            <input type="text" id="p-title" class="form-input" value="${escapeHtml(p.title_en || p.title_ar || '')}" required placeholder="e.g. Nike Kinetic Series" />
          </div>

          <div class="form-grid-3" style="margin-top: 1.5rem;">
            <div class="form-group">
              <label class="form-label">Client / Brand *</label>
              <input type="text" id="p-client" class="form-input" value="${escapeHtml(p.client_name || '')}" required placeholder="e.g. Nike" />
            </div>
            <div class="form-group">
              <label class="form-label">Year</label>
              <input type="text" id="p-year" class="form-input" value="${escapeHtml(p.year || '2026')}" />
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <select id="p-cat" class="form-select">
                <option value="commercial" ${p.category === 'commercial' ? 'selected' : ''}>Commercial</option>
                <option value="branded" ${p.category === 'branded' ? 'selected' : ''}>Branded Content</option>
                <option value="reels" ${p.category === 'reels' ? 'selected' : ''}>Reels</option>
                <option value="social" ${p.category === 'social' ? 'selected' : ''}>Social</option>
                <option value="other" ${p.category === 'other' ? 'selected' : ''}>Other</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">Directing Role</label>
            <input type="text" id="p-role" class="form-input" value="${escapeHtml(p.role_en || 'Director')}" />
          </div>
        </div>

        <div class="editor-section">
          <h3 class="editor-section-title">STORY &amp; CREATIVE DETAILS</h3>
          <div class="form-group">
            <label class="form-label">Overview / Description</label>
            <textarea id="p-desc" class="form-textarea">${escapeHtml(p.description_en || p.description_ar || '')}</textarea>
          </div>
          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">The Idea</label>
            <textarea id="p-concept" class="form-textarea">${escapeHtml(p.concept_en || '')}</textarea>
          </div>
          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">The Challenge</label>
            <textarea id="p-challenge" class="form-textarea">${escapeHtml(p.challenge_en || '')}</textarea>
          </div>
          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">The Approach</label>
            <textarea id="p-approach" class="form-textarea">${escapeHtml(p.approach_en || '')}</textarea>
          </div>
          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">Execution</label>
            <textarea id="p-execution" class="form-textarea">${escapeHtml(p.execution_en || '')}</textarea>
          </div>
          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">Production &amp; Technical Notes</label>
            <textarea id="p-notes" class="form-textarea">${escapeHtml(p.production_notes_en || '')}</textarea>
          </div>
        </div>

        <div class="editor-section">
          <h3 class="editor-section-title">MEDIA &amp; VIDEO</h3>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Cover Image URL *</label>
              <input type="url" id="p-cover" class="form-input" value="${escapeHtml(p.cover_image || '')}" required placeholder="https://.../cover.jpg" />
            </div>
            <div class="form-group">
              <label class="form-label">Hero Media URL</label>
              <input type="url" id="p-hero" class="form-input" value="${escapeHtml(p.hero_media || '')}" placeholder="https://.../hero.jpg" />
            </div>
          </div>
          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">Final Film URL (MP4 / WebM)</label>
            <input type="url" id="p-film" class="form-input" value="${escapeHtml(p.final_film_url || '')}" placeholder="https://.../film.mp4" />
          </div>
        </div>

        <div class="editor-section">
          <h3 class="editor-section-title">PROJECT SETTINGS</h3>
          <div class="form-grid-3">
            <div class="form-group">
              <label class="form-label">Status</label>
              <select id="p-status" class="form-select">
                <option value="draft" ${p.status === 'draft' ? 'selected' : ''}>DRAFT</option>
                <option value="published" ${p.status === 'published' ? 'selected' : ''}>PUBLISHED</option>
                <option value="archived" ${p.status === 'archived' ? 'selected' : ''}>ARCHIVED</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Sort Order</label>
              <input type="number" id="p-sort" class="form-input" value="${p.sort_order || 1}" min="0" />
            </div>
            <div class="form-group" style="display: flex; align-items: center; gap: 0.75rem; margin-top: 1.8rem;">
              <input type="checkbox" id="p-feat" ${p.featured ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: var(--orange);" />
              <label for="p-feat" class="form-label" style="margin: 0; cursor: pointer;">Feature on Homepage</label>
            </div>
          </div>
        </div>
      </form>
    `;

    document.getElementById("ed-cancel").onclick = () => navigateTo("projects");

    const save = async (statusOverride) => {
      const title = document.getElementById("p-title").value.trim();
      const client = document.getElementById("p-client").value.trim();
      const cover = document.getElementById("p-cover").value.trim();
      if (!title || !client || !cover) {
        Toast.error("Title, Client, and Cover Image URL are required.");
        return;
      }

      const payload = {
        title_en: title,
        title_ar: title,
        client_name: client,
        year: document.getElementById("p-year").value || "2026",
        category: document.getElementById("p-cat").value,
        role_en: document.getElementById("p-role").value || "Director",
        description_en: document.getElementById("p-desc").value,
        concept_en: document.getElementById("p-concept").value,
        challenge_en: document.getElementById("p-challenge").value,
        approach_en: document.getElementById("p-approach").value,
        execution_en: document.getElementById("p-execution").value,
        production_notes_en: document.getElementById("p-notes").value,
        cover_image: cover,
        hero_media: document.getElementById("p-hero").value || cover,
        hero_media_type: "image",
        final_film_url: document.getElementById("p-film").value,
        status: statusOverride || document.getElementById("p-status").value,
        sort_order: parseInt(document.getElementById("p-sort").value, 10) || 1,
        featured: document.getElementById("p-feat").checked
      };

      try {
        if (projectId) {
          await updateProject(projectId, payload);
          Toast.success("Project updated successfully.");
        } else {
          await createProject(payload);
          Toast.success("Project created successfully.");
        }
        navigateTo("projects");
      } catch (e) {
        Toast.error("Failed to save project.");
      }
    };

    document.getElementById("project-form").onsubmit = (e) => {
      e.preventDefault();
      save("published");
    };

    document.getElementById("ed-draft").onclick = () => save("draft");
  }

  /* --- TAB: MEDIA --- */
  async function renderMediaTab(container) {
    container.innerHTML = `
      <div class="admin-card-header" style="border: none;">
        <div>
          <h2 class="admin-topbar-title">Media Assets</h2>
          <p class="text-muted" style="font-size: 0.85rem;">Manage stills, bts, and raw production media.</p>
        </div>
        <div>
          <label class="btn btn-accent" style="cursor: pointer;">
            + UPLOAD MEDIA
            <input type="file" id="media-upload-input" multiple accept="image/*,video/*" style="display: none;" />
          </label>
        </div>
      </div>
      <div id="media-grid-box" class="media-items-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
        Loading media...
      </div>
    `;

    const loadMedia = async () => {
      const list = await getAllMedia();
      const box = document.getElementById("media-grid-box");
      if (list.length === 0) {
        box.innerHTML = `<p class="empty-state-text">No media uploaded yet.</p>`;
        return;
      }
      box.innerHTML = list.map((m) => `
        <div class="media-item-card">
          <div style="aspect-ratio: 16/10; overflow: hidden; background: var(--dark-2);">
            <img src="${escapeHtml(m.file_url)}" alt="" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div class="media-item-info">
            <div class="media-item-name">${escapeHtml(m.title_en || 'Asset')}</div>
            <div class="media-item-actions">
              <button class="btn-icon copy-url" data-url="${escapeHtml(m.file_url)}" title="Copy URL">Copy URL</button>
              <button class="btn-icon danger del-media" data-id="${m.id}" title="Delete">Delete</button>
            </div>
          </div>
        </div>
      `).join("");

      box.querySelectorAll(".copy-url").forEach((b) => {
        b.onclick = () => {
          navigator.clipboard.writeText(b.getAttribute("data-url"));
          Toast.success("URL copied to clipboard.");
        };
      });

      box.querySelectorAll(".del-media").forEach((b) => {
        b.onclick = async () => {
          await deleteProjectMedia(b.getAttribute("data-id"));
          Toast.success("Media deleted.");
          loadMedia();
        };
      });
    };

    loadMedia();

    const fileInput = document.getElementById("media-upload-input");
    fileInput.onchange = async (e) => {
      if (e.target.files && e.target.files.length > 0) {
        for (const f of Array.from(e.target.files)) {
          const objUrl = URL.createObjectURL(f);
          await addProjectMedia({
            title_en: f.name,
            file_url: objUrl,
            type: f.type.startsWith("video") ? "video" : "image"
          });
        }
        Toast.success("Media files uploaded.");
        loadMedia();
      }
    };
  }

  /* --- TAB: FEEDBACK --- */
  async function renderFeedbackTab(container) {
    container.innerHTML = `
      <div class="table-toolbar">
        <h3 class="admin-topbar-title">Client Testimonials</h3>
        <button id="add-fb-btn" class="btn btn-accent">+ ADD TESTIMONIAL</button>
      </div>

      <div id="fb-form-box" class="admin-card" style="display: none; margin-bottom: 2rem;">
        <h4 class="admin-card-title">Add / Edit Testimonial</h4>
        <form id="fb-inner-form" style="margin-top: 1.5rem;">
          <input type="hidden" id="fb-id" />
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Client Name *</label>
              <input type="text" id="fb-name" class="form-input" required />
            </div>
            <div class="form-group">
              <label class="form-label">Company</label>
              <input type="text" id="fb-company" class="form-input" />
            </div>
          </div>
          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">Role</label>
            <input type="text" id="fb-role" class="form-input" placeholder="e.g. Chief Marketing Officer" />
          </div>
          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">Quote *</label>
            <textarea id="fb-quote" class="form-textarea" required></textarea>
          </div>
          <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem;">
            <button type="button" id="fb-cancel" class="btn btn-secondary">CANCEL</button>
            <button type="submit" class="btn btn-accent">SAVE</button>
          </div>
        </form>
      </div>

      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>CLIENT</th>
              <th>COMPANY</th>
              <th>QUOTE</th>
              <th style="text-align: right;">ACTIONS</th>
            </tr>
          </thead>
          <tbody id="fb-tbody">Loading...</tbody>
        </table>
      </div>
    `;

    const formBox = document.getElementById("fb-form-box");
    document.getElementById("add-fb-btn").onclick = () => {
      document.getElementById("fb-inner-form").reset();
      document.getElementById("fb-id").value = "";
      formBox.style.display = "block";
    };
    document.getElementById("fb-cancel").onclick = () => {
      formBox.style.display = "none";
    };

    document.getElementById("fb-inner-form").onsubmit = async (e) => {
      e.preventDefault();
      const id = document.getElementById("fb-id").value;
      const payload = {
        client_name: document.getElementById("fb-name").value,
        company: document.getElementById("fb-company").value,
        client_role_en: document.getElementById("fb-role").value,
        quote_en: document.getElementById("fb-quote").value,
        is_visible: true
      };
      if (id) {
        await updateFeedback(id, payload);
        Toast.success("Testimonial updated.");
      } else {
        await createFeedback(payload);
        Toast.success("Testimonial added.");
      }
      formBox.style.display = "none";
      loadFb();
    };

    const loadFb = async () => {
      feedbackCache = await getFeedback();
      const tbody = document.getElementById("fb-tbody");
      if (feedbackCache.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 2rem;">No testimonials found.</td></tr>`;
        return;
      }
      tbody.innerHTML = feedbackCache.map((f) => `
        <tr>
          <td><strong>${escapeHtml(f.client_name)}</strong></td>
          <td>${escapeHtml(f.company || '-')}</td>
          <td style="max-width: 400px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(f.quote_en || f.quote_ar || '')}</td>
          <td style="text-align: right;">
            <button class="btn-icon edit-fb" data-id="${f.id}">Edit</button>
            <button class="btn-icon danger del-fb" data-id="${f.id}">Delete</button>
          </td>
        </tr>
      `).join("");

      tbody.querySelectorAll(".edit-fb").forEach((b) => {
        b.onclick = () => {
          const item = feedbackCache.find((x) => x.id === b.getAttribute("data-id"));
          if (!item) return;
          document.getElementById("fb-id").value = item.id;
          document.getElementById("fb-name").value = item.client_name;
          document.getElementById("fb-company").value = item.company || "";
          document.getElementById("fb-role").value = item.client_role_en || "";
          document.getElementById("fb-quote").value = item.quote_en || "";
          formBox.style.display = "block";
        };
      });

      tbody.querySelectorAll(".del-fb").forEach((b) => {
        b.onclick = async () => {
          await deleteFeedback(b.getAttribute("data-id"));
          Toast.success("Testimonial deleted.");
          loadFb();
        };
      });
    };

    loadFb();
  }

  /* --- TAB: PROFILE --- */
  async function renderProfileTab(container) {
    const prof = await getProfile();
    container.innerHTML = `
      <div class="admin-card">
        <h3 class="admin-card-title">PROFILE SETTINGS</h3>
        <form id="prof-form" style="margin-top: 1.5rem;">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" id="pr-name" class="form-input" value="${escapeHtml(prof.full_name_en || '')}" required />
            </div>
            <div class="form-group">
              <label class="form-label">Professional Title</label>
              <input type="text" id="pr-title" class="form-input" value="${escapeHtml(prof.title_en || '')}" />
            </div>
          </div>
          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">Bio</label>
            <textarea id="pr-bio" class="form-textarea">${escapeHtml(prof.bio_en || '')}</textarea>
          </div>
          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">Portrait Image URL</label>
            <input type="url" id="pr-img" class="form-input" value="${escapeHtml(prof.image_url || '')}" />
          </div>
          <div class="form-grid-2" style="margin-top: 1.5rem;">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" id="pr-email" class="form-input" value="${escapeHtml(prof.email || '')}" />
            </div>
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input type="text" id="pr-phone" class="form-input" value="${escapeHtml(prof.phone || '')}" />
            </div>
          </div>
          <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
            <button type="submit" class="btn btn-accent">SAVE PROFILE</button>
          </div>
        </form>
      </div>
    `;

    document.getElementById("prof-form").onsubmit = async (e) => {
      e.preventDefault();
      await updateProfile({
        full_name_en: document.getElementById("pr-name").value,
        title_en: document.getElementById("pr-title").value,
        bio_en: document.getElementById("pr-bio").value,
        image_url: document.getElementById("pr-img").value,
        email: document.getElementById("pr-email").value,
        phone: document.getElementById("pr-phone").value
      });
      Toast.success("Profile saved.");
    };
  }

  /* --- TAB: SETTINGS --- */
  async function renderSettingsTab(container) {
    const s = await getSiteSettings();
    container.innerHTML = `
      <div class="admin-card">
        <h3 class="admin-card-title">SITE SETTINGS</h3>
        <form id="settings-form" style="margin-top: 1.5rem;">
          <div class="form-group">
            <label class="form-label">Hero Title</label>
            <input type="text" id="st-title" class="form-input" value="${escapeHtml(s.hero_title_en || 'SAMIR EL-HOSARY')}" />
          </div>
          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">Hero Description</label>
            <textarea id="st-desc" class="form-textarea">${escapeHtml(s.hero_desc_en || '')}</textarea>
          </div>
          <div class="form-grid-2" style="margin-top: 1.5rem;">
            <div class="form-group">
              <label class="form-label">Showreel Video URL</label>
              <input type="url" id="st-reel" class="form-input" value="${escapeHtml(s.showreel_video || '')}" />
            </div>
            <div class="form-group">
              <label class="form-label">Showreel Poster</label>
              <input type="url" id="st-poster" class="form-input" value="${escapeHtml(s.showreel_poster || '')}" />
            </div>
          </div>
          <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
            <button type="submit" class="btn btn-accent">SAVE SETTINGS</button>
          </div>
        </form>
      </div>
    `;

    document.getElementById("settings-form").onsubmit = async (e) => {
      e.preventDefault();
      await updateSiteSetting("hero_title_en", document.getElementById("st-title").value);
      await updateSiteSetting("hero_desc_en", document.getElementById("st-desc").value);
      await updateSiteSetting("showreel_video", document.getElementById("st-reel").value);
      await updateSiteSetting("showreel_poster", document.getElementById("st-poster").value);
      Toast.success("Settings saved.");
    };
  }

  /* ============================================================
   * 7. BOOTSTRAP INITIALIZATION
   * ============================================================ */
  function init() {
    // Check if user is already logged in
    const session = Storage.getSession();
    if (session) {
      showDashboardView();
    } else {
      showLoginView();
    }

    // Login Form Handler
    const form = document.getElementById("admin-login-form");
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email")?.value;
        const pass = document.getElementById("login-password")?.value;
        try {
          await apiLogin(email, pass);
          Toast.success("Welcome back, Samir!");
          showDashboardView();
        } catch (err) {
          Toast.error(err.message || "Login failed");
        }
      };
    }

    // Mobile sidebar toggle
    const toggle = document.getElementById("admin-sidebar-toggle");
    if (toggle) {
      toggle.onclick = () => {
        const sidebar = document.querySelector(".admin-sidebar");
        if (sidebar) sidebar.classList.toggle("open");
      };
    }

    // Hash change listener
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash) navigateTo(hash);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose global bypass helper for instant testing
  window.enterDashboardDirectly = () => {
    apiLogin("admin@samirelhosary.com", "director2026");
    showDashboardView();
  };
})();
