/**
 * SAMIR EL-HOSARY — Case Study Details (project-bundle.js)
 * Standalone Vanilla JavaScript bundle for 15-section case study.
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
      }
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
      }
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
      }
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
      }
    }
  ];

  const DEMO_MEDIA = [
    {
      project_id: "a1111111-1111-1111-1111-111111111111",
      type: "image",
      category: "stills",
      file_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
      title_en: "Geometric Lines Framing",
      caption_en: "Wide composition capturing dawn light reflection"
    },
    {
      project_id: "a1111111-1111-1111-1111-111111111111",
      type: "image",
      category: "stills",
      file_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
      title_en: "Skyward Reflection",
      caption_en: "Low-angle perspective accentuating glass monumentality"
    },
    {
      project_id: "a1111111-1111-1111-1111-111111111111",
      type: "image",
      category: "stills",
      file_url: "https://images.unsplash.com/photo-1470723710355-95304d8aece4?auto=format&fit=crop&w=1600&q=80",
      title_en: "Chiaroscuro & Geometry",
      caption_en: "Shadow interplay over textured architectural concrete"
    },
    {
      project_id: "a1111111-1111-1111-1111-111111111111",
      type: "image",
      category: "bts",
      file_url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80",
      title_en: "Director on Set",
      caption_en: "Samir directing Steadicam movement on location"
    },
    {
      project_id: "a1111111-1111-1111-1111-111111111111",
      type: "image",
      category: "before",
      file_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=60&sat=-100"
    },
    {
      project_id: "a1111111-1111-1111-1111-111111111111",
      type: "image",
      category: "after",
      file_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80"
    }
  ];

  const DEMO_FEEDBACK = [
    {
      project_id: "a1111111-1111-1111-1111-111111111111",
      quote_en: "Working with Samir was seamless from the first concept to the final delivery. He understood our vision intuitively and translated it into a commanding cinematic piece that made a massive market impression.",
      client_name: "Tarek El-Minshawi",
      client_role_en: "Chief Marketing Officer",
      company: "Metropolis Development"
    }
  ];

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getProjects() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_DB_PREFIX + "projects");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return DEMO_PROJECTS;
  }

  function getMedia(projId) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_DB_PREFIX + "project_media");
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.filter((m) => m.project_id === projId);
      }
    } catch (e) {}
    return DEMO_MEDIA.filter((m) => m.project_id === projId);
  }

  function getFeedback(projId) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_DB_PREFIX + "project_feedback");
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.find((f) => f.project_id === projId) || null;
      }
    } catch (e) {}
    return DEMO_FEEDBACK.find((f) => f.project_id === projId) || null;
  }

  /* --- LIGHTBOX --- */
  class Lightbox {
    constructor() {
      this.overlay = document.createElement("div");
      this.overlay.className = "lightbox-overlay";
      this.overlay.innerHTML = `
        <div class="lightbox-toolbar">
          <span class="lightbox-counter"></span>
          <button class="lightbox-close">&times;</button>
        </div>
        <button class="lightbox-prev">‹</button>
        <div class="lightbox-stage">
          <img class="lightbox-image" src="" alt="" />
          <div class="lightbox-caption"></div>
        </div>
        <button class="lightbox-next">›</button>
      `;
      document.body.appendChild(this.overlay);

      this.img = this.overlay.querySelector(".lightbox-image");
      this.caption = this.overlay.querySelector(".lightbox-caption");
      this.counter = this.overlay.querySelector(".lightbox-counter");
      this.items = [];
      this.idx = 0;

      this.overlay.querySelector(".lightbox-close").onclick = () => this.close();
      this.overlay.querySelector(".lightbox-prev").onclick = () => this.prev();
      this.overlay.querySelector(".lightbox-next").onclick = () => this.next();
      this.overlay.onclick = (e) => {
        if (e.target === this.overlay || e.target.classList.contains("lightbox-stage")) this.close();
      };
      window.addEventListener("keydown", (e) => {
        if (!this.overlay.classList.contains("active")) return;
        if (e.key === "Escape") this.close();
        if (e.key === "ArrowLeft") this.prev();
        if (e.key === "ArrowRight") this.next();
      });
    }

    open(items, index = 0) {
      this.items = items;
      this.idx = index;
      this.show();
      this.overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    close() {
      this.overlay.classList.remove("active");
      document.body.style.overflow = "";
    }

    prev() {
      if (this.items.length <= 1) return;
      this.idx = (this.idx - 1 + this.items.length) % this.items.length;
      this.show();
    }

    next() {
      if (this.items.length <= 1) return;
      this.idx = (this.idx + 1) % this.items.length;
      this.show();
    }

    show() {
      const item = this.items[this.idx];
      if (!item) return;
      this.img.src = item.src;
      this.caption.textContent = item.caption || item.title || "";
      this.counter.textContent = `${this.idx + 1} / ${this.items.length}`;
    }
  }

  function initBeforeAfter(container) {
    if (!container) return;
    const handle = container.querySelector(".ba-slider-handle");
    const wrapper = container.querySelector(".ba-before-wrapper");
    if (!handle || !wrapper) return;

    const setPos = (pct) => {
      const clamped = Math.max(0, Math.min(100, pct));
      handle.style.left = `${clamped}%`;
      wrapper.style.clipPath = `polygon(0 0, ${clamped}% 0, ${clamped}% 100%, 0 100%)`;
    };

    let dragging = false;
    const move = (clientX) => {
      const rect = container.getBoundingClientRect();
      setPos(((clientX - rect.left) / rect.width) * 100);
    };

    handle.onmousedown = () => { dragging = true; };
    window.onmouseup = () => { dragging = false; };
    window.onmousemove = (e) => { if (dragging) move(e.clientX); };
    handle.ontouchstart = () => { dragging = true; };
    window.ontouchend = () => { dragging = false; };
    window.ontouchmove = (e) => { if (dragging && e.touches[0]) move(e.touches[0].clientX); };
    container.onclick = (e) => move(e.clientX);
    setPos(50);
  }

  function renderProject() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const all = getProjects();
    const p = all.find((x) => x.id === id || x.slug === id) || all[0];
    const container = document.getElementById("project-content");
    if (!container || !p) return;

    const title = escapeHtml(p.title_en || p.title_ar || "Untitled");
    const client = escapeHtml(p.client_name || "");
    const year = escapeHtml(p.year || "2026");
    const role = escapeHtml(p.role_en || "Director");
    const category = escapeHtml((p.category || "commercial").toUpperCase());
    const heroMedia = escapeHtml(p.hero_media || p.cover_image || "");
    const media = getMedia(p.id);
    const fb = getFeedback(p.id);

    const stills = media.filter((m) => m.category === "stills");
    const bts = media.filter((m) => m.category === "bts");
    const beforeImg = media.find((m) => m.category === "before")?.file_url;
    const afterImg = media.find((m) => m.category === "after")?.file_url;

    const currIdx = all.findIndex((x) => x.id === p.id);
    const prevP = currIdx > 0 ? all[currIdx - 1] : all[all.length - 1];
    const nextP = currIdx < all.length - 1 ? all[currIdx + 1] : all[0];

    container.innerHTML = `
      <!-- 1. HERO -->
      <header class="case-study-hero">
        <div class="hero-background">
          <img class="case-study-hero-bg" src="${heroMedia}" alt="${title}" />
          <div class="hero-gradient-overlay"></div>
        </div>
        <div class="container case-study-hero-content">
          <span class="hero-subtitle-top">${category} • ${role}</span>
          <h1 class="heading-display">${title}</h1>
        </div>
      </header>

      <!-- 2. METADATA -->
      <div class="container">
        <div class="case-study-meta-bar">
          <div class="meta-item"><div class="meta-item-label">CLIENT</div><div class="meta-item-value">${client}</div></div>
          <div class="meta-item"><div class="meta-item-label">YEAR</div><div class="meta-item-value">${year}</div></div>
          <div class="meta-item"><div class="meta-item-label">CATEGORY</div><div class="meta-item-value">${category}</div></div>
          <div class="meta-item"><div class="meta-item-label">ROLE</div><div class="meta-item-value">${role}</div></div>
        </div>
      </div>

      <!-- 3. OVERVIEW -->
      ${p.description_en ? `
        <section class="case-study-section">
          <div class="container case-study-grid">
            <div class="case-study-label">PROJECT OVERVIEW</div>
            <div class="case-study-body"><p>${escapeHtml(p.description_en)}</p></div>
          </div>
        </section>
        <hr class="section-separator" />
      ` : ''}

      <!-- 4. THE IDEA -->
      ${p.concept_en ? `
        <section class="case-study-section">
          <div class="container case-study-grid">
            <div class="case-study-label">THE IDEA</div>
            <div class="case-study-body"><p>${escapeHtml(p.concept_en)}</p></div>
          </div>
        </section>
        <hr class="section-separator" />
      ` : ''}

      <!-- 5. THE CHALLENGE -->
      ${p.challenge_en ? `
        <section class="case-study-section">
          <div class="container case-study-grid">
            <div class="case-study-label">THE CHALLENGE</div>
            <div class="case-study-body"><p>${escapeHtml(p.challenge_en)}</p></div>
          </div>
        </section>
        <hr class="section-separator" />
      ` : ''}

      <!-- 6. THE APPROACH -->
      ${p.approach_en ? `
        <section class="case-study-section">
          <div class="container case-study-grid">
            <div class="case-study-label">THE APPROACH</div>
            <div class="case-study-body"><p>${escapeHtml(p.approach_en)}</p></div>
          </div>
        </section>
        <hr class="section-separator" />
      ` : ''}

      <!-- 7. EXECUTION -->
      ${p.execution_en ? `
        <section class="case-study-section">
          <div class="container case-study-grid">
            <div class="case-study-label">EXECUTION</div>
            <div class="case-study-body"><p>${escapeHtml(p.execution_en)}</p></div>
          </div>
        </section>
        <hr class="section-separator" />
      ` : ''}

      <!-- 8. FINAL FILM -->
      ${p.final_film_url ? `
        <section class="case-study-section">
          <div class="container">
            <div class="case-study-label" style="margin-bottom: 2rem;">FINAL FILM</div>
            <div class="showreel-player-wrapper" style="border: var(--border-subtle);">
              <video class="showreel-video" src="${escapeHtml(p.final_film_url)}" controls playsinline></video>
            </div>
          </div>
        </section>
        <hr class="section-separator" />
      ` : ''}

      <!-- 9. FINAL STILLS -->
      ${stills.length > 0 ? `
        <section class="case-study-section">
          <div class="container">
            <div class="case-study-label">FINAL STILLS</div>
            <div class="stills-gallery-grid" id="stills-box">
              ${stills.map((s, idx) => `
                <div class="still-item" data-idx="${idx}">
                  <img src="${escapeHtml(s.file_url)}" alt="" loading="lazy" />
                  <div class="still-item-overlay">
                    <div class="still-caption">${escapeHtml(s.title_en || s.caption_en || '')}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </section>
        <hr class="section-separator" />
      ` : ''}

      <!-- 10. BEHIND THE SCENES -->
      ${bts.length > 0 ? `
        <section class="case-study-section">
          <div class="container">
            <div class="case-study-label">BEHIND THE SCENES</div>
            <div class="bts-masonry">
              ${bts.map((b) => `
                <div class="bts-item">
                  <div class="bts-item-media"><img src="${escapeHtml(b.file_url)}" alt="" loading="lazy" /></div>
                  <div class="bts-item-info">
                    <div class="bts-item-title">${escapeHtml(b.title_en || '')}</div>
                    <div class="bts-item-notes">${escapeHtml(b.caption_en || '')}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </section>
        <hr class="section-separator" />
      ` : ''}

      <!-- 11. RAW / PRODUCTION MATERIAL -->
      ${p.production_notes_en ? `
        <section class="case-study-section">
          <div class="container case-study-grid">
            <div class="case-study-label">RAW / PRODUCTION MATERIAL</div>
            <div class="case-study-body"><p>${escapeHtml(p.production_notes_en)}</p></div>
          </div>
        </section>
        <hr class="section-separator" />
      ` : ''}

      <!-- 12. BEFORE / AFTER -->
      ${beforeImg && afterImg ? `
        <section class="case-study-section">
          <div class="container">
            <div class="case-study-label">FROM RAW TO FINAL</div>
            <div class="ba-slider-container" id="ba-slider">
              <div class="ba-layer ba-after-layer">
                <img src="${escapeHtml(afterImg)}" alt="Final Graded" />
                <span class="ba-badge ba-badge-after">FINAL GRADED</span>
              </div>
              <div class="ba-before-wrapper">
                <div class="ba-layer">
                  <img src="${escapeHtml(beforeImg)}" alt="Raw Log" />
                  <span class="ba-badge ba-badge-before">RAW FOOTAGE</span>
                </div>
              </div>
              <div class="ba-slider-handle">
                <div class="ba-slider-circle">‹›</div>
              </div>
            </div>
          </div>
        </section>
        <hr class="section-separator" />
      ` : ''}

      <!-- 13. CLIENT FEEDBACK -->
      ${fb ? `
        <section class="case-study-section">
          <div class="container">
            <div class="case-study-label">CLIENT FEEDBACK</div>
            <div class="client-feedback-box">
              <blockquote class="feedback-quote">“${escapeHtml(fb.quote_en || fb.quote_ar || '')}”</blockquote>
              <div class="feedback-author">
                <div>
                  <div class="feedback-author-name">${escapeHtml(fb.client_name)}</div>
                  <div class="feedback-author-role">${escapeHtml(fb.client_role_en || '')} • ${escapeHtml(fb.company || '')}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <hr class="section-separator" />
      ` : ''}

      <!-- 14. CREDITS -->
      ${p.credits ? `
        <section class="case-study-section">
          <div class="container case-study-grid">
            <div class="case-study-label">CREDITS</div>
            <div class="credits-grid">
              ${p.credits.director ? `<div class="credit-item"><div class="credit-item-role">Director</div><div class="credit-item-name">${escapeHtml(p.credits.director)}</div></div>` : ''}
              ${p.credits.cinematographer ? `<div class="credit-item"><div class="credit-item-role">Cinematography</div><div class="credit-item-name">${escapeHtml(p.credits.cinematographer)}</div></div>` : ''}
              ${p.credits.editor ? `<div class="credit-item"><div class="credit-item-role">Editor</div><div class="credit-item-name">${escapeHtml(p.credits.editor)}</div></div>` : ''}
              ${p.credits.colorist ? `<div class="credit-item"><div class="credit-item-role">Colorist</div><div class="credit-item-name">${escapeHtml(p.credits.colorist)}</div></div>` : ''}
            </div>
          </div>
        </section>
        <hr class="section-separator" />
      ` : ''}

      <!-- 15. NAVIGATION -->
      <div class="container">
        <nav class="project-pagination-bar">
          ${prevP ? `
            <a href="project.html?id=${encodeURIComponent(prevP.slug || prevP.id)}" class="pagination-item">
              <span class="pagination-label">← PREVIOUS PROJECT</span>
              <span class="pagination-title">${escapeHtml(prevP.title_en || '')}</span>
            </a>
          ` : '<div></div>'}
          <a href="index.html#work" class="btn btn-secondary">BACK TO WORK</a>
          ${nextP ? `
            <a href="project.html?id=${encodeURIComponent(nextP.slug || nextP.id)}" class="pagination-item" style="text-align: right;">
              <span class="pagination-label">NEXT PROJECT →</span>
              <span class="pagination-title">${escapeHtml(nextP.title_en || '')}</span>
            </a>
          ` : '<div></div>'}
        </nav>
      </div>
    `;

    const lb = new Lightbox();
    const stillsItems = stills.map((s) => ({ src: s.file_url, caption: s.caption_en, title: s.title_en }));
    container.querySelectorAll("#stills-box .still-item").forEach((el) => {
      el.onclick = () => {
        const i = parseInt(el.getAttribute("data-idx"), 10) || 0;
        lb.open(stillsItems, i);
      };
    });

    const ba = document.getElementById("ba-slider");
    if (ba) initBeforeAfter(ba);
  }

  function init() {
    renderProject();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
