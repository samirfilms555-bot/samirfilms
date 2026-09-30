/**
 * SAMIR EL-HOSARY — Case Study Project Details Controller (project.js)
 * English-only implementation of the 15-section cinematic case study.
 */

import { i18n } from "./i18n.js";
import { getProjectById, getProjectMedia, getFeedback, getPublishedProjects } from "./api.js";
import { Lightbox, initBeforeAfterSlider, escapeHtml } from "./utils.js";

const lightbox = new Lightbox();
let currentProject = null;
let allProjects = [];

document.addEventListener("DOMContentLoaded", async () => {
  i18n.applyToDOM();

  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");

  if (!projectId) {
    window.location.href = "index.html";
    return;
  }

  await loadProject(projectId);
});

async function loadProject(idOrSlug) {
  const container = document.getElementById("project-content");
  if (!container) return;

  try {
    const [project, projectsList] = await Promise.all([
      getProjectById(idOrSlug),
      getPublishedProjects()
    ]);

    if (!project) {
      container.innerHTML = `
        <div class="empty-state container" style="padding-top: 10rem;">
          <h2 class="heading-section">Project not found</h2>
          <p style="margin-top: 1rem;"><a href="index.html" class="btn btn-secondary">BACK TO WORK</a></p>
        </div>
      `;
      return;
    }

    currentProject = project;
    allProjects = projectsList;

    const [mediaItems, feedbackItems] = await Promise.all([
      getProjectMedia(project.id),
      getFeedback(project.id)
    ]);

    currentProject._media = mediaItems || [];
    currentProject._feedback = (feedbackItems && feedbackItems.length > 0) ? feedbackItems[0] : null;

    renderCaseStudy(currentProject);
  } catch (err) {
    console.error("Error loading case study:", err);
    container.innerHTML = `
      <div class="empty-state container" style="padding-top: 10rem;">
        <h2 class="heading-section">Something went wrong while loading the project.</h2>
      </div>
    `;
  }
}

function renderCaseStudy(project) {
  const container = document.getElementById("project-content");
  if (!container) return;

  const title = escapeHtml(i18n.getLocalized(project, "title") || "Untitled Project");
  const role = escapeHtml(i18n.getLocalized(project, "role") || "Director");
  const client = escapeHtml(project.client_name || "");
  const year = escapeHtml(project.year || "");
  const category = escapeHtml(project.category || "");
  const description = escapeHtml(i18n.getLocalized(project, "description"));
  const concept = escapeHtml(i18n.getLocalized(project, "concept"));
  const challenge = escapeHtml(i18n.getLocalized(project, "challenge"));
  const approach = escapeHtml(i18n.getLocalized(project, "approach"));
  const execution = escapeHtml(i18n.getLocalized(project, "execution"));
  const productionNotes = escapeHtml(i18n.getLocalized(project, "production_notes"));

  document.title = `${title} — Samir El-Hosary | Director`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", description || title);

  const media = project._media || [];
  const stills = media.filter((m) => m.category === "stills" || m.category === "gallery");
  const bts = media.filter((m) => m.category === "bts");
  const rawList = media.filter((m) => m.category === "raw");
  const beforeList = media.filter((m) => m.category === "before");
  const afterList = media.filter((m) => m.category === "after");

  const heroMediaUrl = project.hero_media || project.cover_image;
  const isHeroVideo = project.hero_media_type === "video";

  let html = `
    <!-- 1. PROJECT HERO -->
    <header class="case-study-hero">
      <div class="hero-background">
        ${isHeroVideo 
          ? `<video class="case-study-hero-bg" src="${escapeHtml(heroMediaUrl)}" autoplay muted loop playsinline></video>`
          : `<img class="case-study-hero-bg" src="${escapeHtml(heroMediaUrl)}" alt="${title}" />`
        }
        <div class="hero-gradient-overlay"></div>
      </div>
      <div class="container case-study-hero-content">
        <span class="hero-subtitle-top">${escapeHtml(getCategoryLabel(category))} • ${role}</span>
        <h1 class="heading-display">${title}</h1>
      </div>
    </header>

    <!-- 2. PROJECT METADATA BAR -->
    <div class="container">
      <div class="case-study-meta-bar">
        <div class="meta-item">
          <div class="meta-item-label">CLIENT</div>
          <div class="meta-item-value">${client}</div>
        </div>
        <div class="meta-item">
          <div class="meta-item-label">YEAR</div>
          <div class="meta-item-value">${year}</div>
        </div>
        <div class="meta-item">
          <div class="meta-item-label">CATEGORY</div>
          <div class="meta-item-value">${escapeHtml(getCategoryLabel(category))}</div>
        </div>
        <div class="meta-item">
          <div class="meta-item-label">ROLE</div>
          <div class="meta-item-value">${role}</div>
        </div>
      </div>
    </div>
  `;

  // 3. OVERVIEW
  if (description) {
    html += `
      <section class="case-study-section">
        <div class="container case-study-grid">
          <div class="case-study-label">PROJECT OVERVIEW</div>
          <div class="case-study-body"><p>${description}</p></div>
        </div>
      </section>
      <hr class="section-separator" />
    `;
  }

  // 4. THE IDEA
  if (concept) {
    html += `
      <section class="case-study-section">
        <div class="container case-study-grid">
          <div class="case-study-label">THE IDEA</div>
          <div class="case-study-body"><p>${concept}</p></div>
        </div>
      </section>
      <hr class="section-separator" />
    `;
  }

  // 5. THE CHALLENGE
  if (challenge) {
    html += `
      <section class="case-study-section">
        <div class="container case-study-grid">
          <div class="case-study-label">THE CHALLENGE</div>
          <div class="case-study-body"><p>${challenge}</p></div>
        </div>
      </section>
      <hr class="section-separator" />
    `;
  }

  // 6. THE CREATIVE APPROACH
  if (approach) {
    html += `
      <section class="case-study-section">
        <div class="container case-study-grid">
          <div class="case-study-label">THE APPROACH</div>
          <div class="case-study-body"><p>${approach}</p></div>
        </div>
      </section>
      <hr class="section-separator" />
    `;
  }

  // 7. EXECUTION
  if (execution) {
    html += `
      <section class="case-study-section">
        <div class="container case-study-grid">
          <div class="case-study-label">EXECUTION</div>
          <div class="case-study-body"><p>${execution}</p></div>
        </div>
      </section>
      <hr class="section-separator" />
    `;
  }

  // 8. FINAL FILM
  if (project.final_film_url) {
    html += `
      <section class="case-study-section">
        <div class="container">
          <div class="case-study-label" style="margin-bottom: 2rem;">FINAL FILM</div>
          <div class="showreel-player-wrapper" style="border: var(--border-subtle);">
            <video class="showreel-video" src="${escapeHtml(project.final_film_url)}" poster="${escapeHtml(project.final_film_poster || project.cover_image)}" controls playsinline></video>
          </div>
        </div>
      </section>
      <hr class="section-separator" />
    `;
  }

  // 9. FINAL STILLS
  if (stills.length > 0) {
    html += `
      <section class="case-study-section">
        <div class="container">
          <div class="case-study-label">FINAL STILLS</div>
          <div class="stills-gallery-grid" id="stills-gallery">
            ${stills.map((s, idx) => `
              <div class="still-item" data-index="${idx}">
                <img src="${escapeHtml(s.file_url)}" alt="${escapeHtml(i18n.getLocalized(s, "title"))}" loading="lazy" />
                <div class="still-item-overlay">
                  <div class="still-caption">${escapeHtml(i18n.getLocalized(s, "title") || i18n.getLocalized(s, "caption"))}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </section>
      <hr class="section-separator" />
    `;
  }

  // 10. BEHIND THE SCENES
  if (bts.length > 0) {
    html += `
      <section class="case-study-section">
        <div class="container">
          <div class="case-study-label">BEHIND THE SCENES</div>
          <div class="bts-masonry">
            ${bts.map((b) => {
              const bTitle = escapeHtml(i18n.getLocalized(b, "title"));
              const bNotes = escapeHtml(b.metadata_json?.notes || i18n.getLocalized(b, "caption"));
              return `
                <div class="bts-item">
                  <div class="bts-item-media">
                    ${b.type === "video" 
                      ? `<video src="${escapeHtml(b.file_url)}" controls playsinline></video>`
                      : `<img src="${escapeHtml(b.file_url)}" alt="${bTitle}" loading="lazy" />`
                    }
                  </div>
                  ${(bTitle || bNotes) ? `
                    <div class="bts-item-info">
                      ${bTitle ? `<div class="bts-item-title">${bTitle}</div>` : ""}
                      ${bNotes ? `<div class="bts-item-notes">${bNotes}</div>` : ""}
                    </div>
                  ` : ""}
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </section>
      <hr class="section-separator" />
    `;
  }

  // 11. RAW / PRODUCTION MATERIAL
  if (productionNotes || rawList.length > 0) {
    html += `
      <section class="case-study-section">
        <div class="container case-study-grid">
          <div class="case-study-label">RAW / PRODUCTION MATERIAL</div>
          <div class="case-study-body">
            ${productionNotes ? `<p>${productionNotes}</p>` : ""}
            ${rawList.length > 0 ? `
              <div class="stills-gallery-grid" style="margin-top: 2rem;">
                ${rawList.map((r) => `
                  <div class="bts-item">
                    <div class="bts-item-media">
                      <img src="${escapeHtml(r.file_url)}" alt="Raw Asset" loading="lazy" />
                    </div>
                    <div class="bts-item-info">
                      <div class="bts-item-title">${escapeHtml(i18n.getLocalized(r, "title"))}</div>
                      ${r.metadata_json?.camera ? `<div class="bts-item-notes"><strong>CAMERA:</strong> ${escapeHtml(r.metadata_json.camera)}</div>` : ""}
                      ${r.metadata_json?.lens ? `<div class="bts-item-notes"><strong>LENSES:</strong> ${escapeHtml(r.metadata_json.lens)}</div>` : ""}
                    </div>
                  </div>
                `).join("")}
              </div>
            ` : ""}
          </div>
        </div>
      </section>
      <hr class="section-separator" />
    `;
  }

  // 12. BEFORE / AFTER COMPARISON
  if (beforeList.length > 0 && afterList.length > 0) {
    const beforeImg = beforeList[0].file_url;
    const afterImg = afterList[0].file_url;

    html += `
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
              <div class="ba-slider-circle">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="8 16 4 12 8 8"/>
                  <polyline points="16 8 20 12 16 16"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr class="section-separator" />
    `;
  }

  // 13. CLIENT FEEDBACK
  const fb = project._feedback;
  if (fb && (fb.quote_en || fb.quote_ar || fb.quote)) {
    const quote = escapeHtml(i18n.getLocalized(fb, "quote"));
    const clientName = escapeHtml(fb.client_name || "");
    const clientRole = escapeHtml(i18n.getLocalized(fb, "client_role"));
    const company = escapeHtml(fb.company || "");

    html += `
      <section class="case-study-section">
        <div class="container">
          <div class="case-study-label">CLIENT FEEDBACK</div>
          <div class="client-feedback-box">
            <blockquote class="feedback-quote">“${quote}”</blockquote>
            <div class="feedback-author">
              <div>
                <div class="feedback-author-name">${clientName}</div>
                <div class="feedback-author-role">${clientRole}${company ? ` • ${company}` : ""}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr class="section-separator" />
    `;
  }

  // 14. CREDITS
  const credits = project.credits;
  if (credits && typeof credits === "object" && Object.keys(credits).length > 0) {
    html += `
      <section class="case-study-section">
        <div class="container case-study-grid">
          <div class="case-study-label">CREDITS</div>
          <div class="credits-grid">
            ${credits.director ? `<div class="credit-item"><div class="credit-item-role">Director</div><div class="credit-item-name">${escapeHtml(credits.director)}</div></div>` : ""}
            ${credits.cinematographer ? `<div class="credit-item"><div class="credit-item-role">Cinematography (DOP)</div><div class="credit-item-name">${escapeHtml(credits.cinematographer)}</div></div>` : ""}
            ${credits.editor ? `<div class="credit-item"><div class="credit-item-role">Editor</div><div class="credit-item-name">${escapeHtml(credits.editor)}</div></div>` : ""}
            ${credits.colorist ? `<div class="credit-item"><div class="credit-item-role">Colorist</div><div class="credit-item-name">${escapeHtml(credits.colorist)}</div></div>` : ""}
            ${credits.producer ? `<div class="credit-item"><div class="credit-item-role">Producer</div><div class="credit-item-name">${escapeHtml(credits.producer)}</div></div>` : ""}
            ${credits.agency ? `<div class="credit-item"><div class="credit-item-role">Creative Agency</div><div class="credit-item-name">${escapeHtml(credits.agency)}</div></div>` : ""}
          </div>
        </div>
      </section>
      <hr class="section-separator" />
    `;
  }

  // 15. PREVIOUS / NEXT PROJECT NAVIGATION
  const currentIdx = allProjects.findIndex((p) => p.id === project.id || p.slug === project.slug);
  const prevProject = currentIdx > 0 ? allProjects[currentIdx - 1] : allProjects[allProjects.length - 1];
  const nextProject = currentIdx < allProjects.length - 1 ? allProjects[currentIdx + 1] : allProjects[0];

  html += `
    <div class="container">
      <nav class="project-pagination-bar" aria-label="Project Navigation">
        ${prevProject ? `
          <a href="project.html?id=${encodeURIComponent(prevProject.slug || prevProject.id)}" class="pagination-item pagination-prev">
            <span class="pagination-label">← PREVIOUS PROJECT</span>
            <span class="pagination-title">${escapeHtml(i18n.getLocalized(prevProject, "title"))}</span>
          </a>
        ` : `<div></div>`}

        <a href="index.html" class="btn btn-secondary">BACK TO WORK</a>

        ${nextProject ? `
          <a href="project.html?id=${encodeURIComponent(nextProject.slug || nextProject.id)}" class="pagination-item pagination-next" style="text-align: right;">
            <span class="pagination-label">NEXT PROJECT →</span>
            <span class="pagination-title">${escapeHtml(i18n.getLocalized(nextProject, "title"))}</span>
          </a>
        ` : `<div></div>`}
      </nav>
    </div>
  `;

  container.innerHTML = html;

  if (stills.length > 0) {
    const lightboxItems = stills.map((s) => ({
      src: s.file_url,
      title: i18n.getLocalized(s, "title"),
      caption: i18n.getLocalized(s, "caption")
    }));
    lightbox.setItems(lightboxItems);

    container.querySelectorAll("#stills-gallery .still-item").forEach((el) => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.getAttribute("data-index"), 10) || 0;
        lightbox.open(idx);
      });
    });
  }

  const baSlider = document.getElementById("ba-slider");
  if (baSlider) {
    initBeforeAfterSlider(baSlider);
  }
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
