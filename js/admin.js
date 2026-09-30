/**
 * SAMIR EL-HOSARY — Admin CMS Controller (admin.js)
 * English-only implementation of private CMS, project management, and editor.
 */

import { Auth } from "./auth.js";
import { i18n } from "./i18n.js";
import { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject, 
  duplicateProject, 
  getFeedback, 
  createFeedback, 
  updateFeedback, 
  deleteFeedback
} from "./api.js";
import { renderOverview, renderProfileSettings, renderSiteSettings } from "./dashboard.js";
import { initMediaManager } from "./media.js";
import { Toast, confirmDialog, escapeHtml } from "./utils.js";
import { CONFIG } from "./config.js";

// State
let currentTab = "overview";
let editingProjectId = null;
let hasUnsavedChanges = false;
let projectsCache = [];
let feedbackCache = [];

document.addEventListener("DOMContentLoaded", async () => {
  i18n.applyToDOM();

  // Setup Auth Guard
  await Auth.requireAuth(
    (session) => onLoggedIn(session),
    () => showLoginView()
  );

  // Setup Login Form submission
  const loginForm = document.getElementById("admin-login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email")?.value;
      const pass = document.getElementById("login-password")?.value;
      const btn = loginForm.querySelector("button[type='submit']");
      const origText = btn.textContent;

      try {
        btn.textContent = "Verifying Session...";
        btn.disabled = true;
        const session = await Auth.login(email, pass);
        onLoggedIn(session);
        Toast.success("Authentication successful");
      } catch (err) {
        Toast.error(err.message || "Login failed");
      } finally {
        btn.textContent = origText;
        btn.disabled = false;
      }
    });
  }

  // Setup Sidebar Logout
  const logoutBtn = document.getElementById("sidebar-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await Auth.logout();
      showLoginView();
      Toast.info("Logged out successfully");
    });
  }

  // Mobile sidebar toggle
  const sidebarToggle = document.getElementById("admin-sidebar-toggle");
  const sidebar = document.querySelector(".admin-sidebar");
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // Unsaved changes browser guard
  window.addEventListener("beforeunload", (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
    }
  });

  // Hash change routing
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash.startsWith("edit-project-")) {
      const id = hash.replace("edit-project-", "");
      openProjectEditor(id);
    } else if (hash) {
      navigateTo(hash);
    }
  });
});

function showLoginView() {
  const loginView = document.getElementById("admin-login-view");
  const dashView = document.getElementById("admin-dashboard-view");
  if (loginView && dashView) {
    loginView.style.display = "flex";
    dashView.style.display = "none";
  }
}

function onLoggedIn(session) {
  const loginView = document.getElementById("admin-login-view");
  const dashView = document.getElementById("admin-dashboard-view");
  if (loginView && dashView) {
    loginView.style.display = "none";
    dashView.style.display = "flex";
  }

  const dot = document.querySelector(".connection-dot");
  const text = document.querySelector(".connection-text");
  if (dot && text) {
    if (CONFIG.IS_CONFIGURED()) {
      dot.className = "connection-dot";
      text.textContent = "Supabase Live";
    } else {
      dot.className = "connection-dot demo";
      text.textContent = "Demo Local Mode";
    }
  }

  setupSidebarLinks();

  const initialHash = window.location.hash.replace(/^#/, "");
  if (initialHash.startsWith("edit-project-")) {
    openProjectEditor(initialHash.replace("edit-project-", ""));
  } else {
    navigateTo(initialHash || "overview");
  }
}

function setupSidebarLinks() {
  document.querySelectorAll(".sidebar-link[data-tab]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetTab = link.getAttribute("data-tab");
      window.location.hash = `#${targetTab}`;
    });
  });
}

function navigateTo(tabName) {
  currentTab = tabName;
  editingProjectId = null;

  const sidebar = document.querySelector(".admin-sidebar");
  if (sidebar) sidebar.classList.remove("open");

  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("data-tab") === tabName);
  });

  const titleEl = document.getElementById("admin-page-title");
  const workspace = document.getElementById("admin-workspace");
  if (!workspace) return;

  switch (tabName) {
    case "overview":
      if (titleEl) titleEl.textContent = "Dashboard";
      renderOverview(workspace, (target) => navigateTo(target));
      break;
    case "projects":
      if (titleEl) titleEl.textContent = "Projects";
      renderProjectsList(workspace);
      break;
    case "add-project":
      if (titleEl) titleEl.textContent = "Add Project";
      renderProjectEditor(workspace, null);
      break;
    case "media":
      if (titleEl) titleEl.textContent = "Media";
      initMediaManager(workspace);
      break;
    case "feedback":
      if (titleEl) titleEl.textContent = "Feedback";
      renderFeedbackManager(workspace);
      break;
    case "profile":
      if (titleEl) titleEl.textContent = "Profile Settings";
      renderProfileSettings(workspace);
      break;
    case "settings":
      if (titleEl) titleEl.textContent = "Site Settings";
      renderSiteSettings(workspace);
      break;
    default:
      if (titleEl) titleEl.textContent = "Dashboard";
      renderOverview(workspace, (target) => navigateTo(target));
      break;
  }
}

/* ============================================================
 * PROJECT LIST & MANAGEMENT TAB
 * ============================================================ */
async function renderProjectsList(container) {
  container.innerHTML = `
    <div class="table-toolbar">
      <div class="table-filters">
        <input type="text" id="project-search-input" class="admin-search-input" placeholder="Search projects..." />
        <select id="project-status-filter" class="form-select" style="width: auto; padding: 0.6rem 1rem; font-size: 0.85rem;">
          <option value="all">ALL STATUSES</option>
          <option value="published">PUBLISHED</option>
          <option value="draft">DRAFT</option>
          <option value="archived">ARCHIVED</option>
          <option value="featured">FEATURED ONLY</option>
        </select>
      </div>
      <div>
        <button id="add-proj-btn" class="btn btn-accent">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ADD PROJECT
        </button>
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
        <tbody id="projects-table-body">
          <tr><td colspan="8" style="text-align: center; padding: 3rem;">Loading projects...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  container.querySelector("#add-proj-btn").addEventListener("click", () => navigateTo("add-project"));

  const searchInput = container.querySelector("#project-search-input");
  const statusFilter = container.querySelector("#project-status-filter");

  const filterAndRender = () => {
    const q = searchInput.value.toLowerCase().trim();
    const st = statusFilter.value;

    let filtered = projectsCache.filter((p) => {
      const matchSearch = (p.title_en || "").toLowerCase().includes(q) ||
                          (p.title_ar || "").toLowerCase().includes(q) ||
                          (p.client_name || "").toLowerCase().includes(q);
      let matchStatus = true;
      if (st === "featured") {
        matchStatus = Boolean(p.featured);
      } else if (st !== "all") {
        matchStatus = p.status === st;
      }
      return matchSearch && matchStatus;
    });

    renderTableRows(filtered);
  };

  searchInput.addEventListener("input", filterAndRender);
  statusFilter.addEventListener("change", filterAndRender);

  try {
    projectsCache = await getProjects();
    filterAndRender();
  } catch (err) {
    Toast.error("Failed to load projects.");
  }
}

function renderTableRows(projects) {
  const tbody = document.getElementById("projects-table-body");
  if (!tbody) return;

  if (projects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 3rem;">No projects found.</td></tr>`;
    return;
  }

  tbody.innerHTML = projects.map((p) => {
    const title = escapeHtml(i18n.getLocalized(p, "title") || "Untitled Project");
    const client = escapeHtml(p.client_name || "");
    const cat = escapeHtml(p.category || "");
    const year = escapeHtml(p.year || "");
    const cover = p.cover_image || "assets/images/placeholder.jpg";
    
    let statusBadge = `<span class="badge badge-draft">DRAFT</span>`;
    if (p.status === "published") statusBadge = `<span class="badge badge-published">PUBLISHED</span>`;
    if (p.status === "archived") statusBadge = `<span class="badge badge-archived">ARCHIVED</span>`;

    const featuredBadge = p.featured 
      ? `<span class="badge badge-published">★</span>` 
      : `<span style="color: var(--gray);">-</span>`;

    return `
      <tr data-id="${p.id}">
        <td><img src="${escapeHtml(cover)}" class="tbl-thumbnail" alt="" /></td>
        <td>
          <strong>${title}</strong>
          <div style="font-size: 0.75rem; color: var(--gray);">${escapeHtml(p.slug || '')}</div>
        </td>
        <td>${client}</td>
        <td style="text-transform: uppercase;">${cat}</td>
        <td>${year}</td>
        <td>${statusBadge}</td>
        <td>${featuredBadge}</td>
        <td style="text-align: right;">
          <div class="table-actions" style="justify-content: flex-end;">
            <button class="btn-icon edit-btn" data-id="${p.id}" title="Edit Project">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
            <a href="project.html?id=${encodeURIComponent(p.slug || p.id)}" target="_blank" class="btn-icon" title="View Public Page">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </a>
            <button class="btn-icon dup-btn" data-id="${p.id}" title="Duplicate Project">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
            <button class="btn-icon danger del-btn" data-id="${p.id}" title="Delete Project">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  tbody.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      openProjectEditor(btn.getAttribute("data-id"));
    });
  });

  tbody.querySelectorAll(".dup-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      try {
        await duplicateProject(id);
        Toast.success("Project duplicated successfully.");
        projectsCache = await getProjects();
        renderTableRows(projectsCache);
      } catch (err) {
        Toast.error("Failed to duplicate project.");
      }
    });
  });

  tbody.querySelectorAll(".del-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const confirmed = await confirmDialog("Are you sure you want to permanently delete this project? This cannot be undone.");
      if (confirmed) {
        try {
          await deleteProject(id);
          Toast.success("Project deleted.");
          projectsCache = await getProjects();
          renderTableRows(projectsCache);
        } catch (err) {
          Toast.error("Failed to delete project.");
        }
      }
    });
  });
}

function openProjectEditor(id) {
  editingProjectId = id;
  const workspace = document.getElementById("admin-workspace");
  const titleEl = document.getElementById("admin-page-title");
  if (titleEl) titleEl.textContent = "Edit Project";
  renderProjectEditor(workspace, id);
}

/* ============================================================
 * MULTI-SECTION PROJECT EDITOR (Clean English-Only Inputs)
 * ============================================================ */
async function renderProjectEditor(container, projectId) {
  let project = {
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
    final_film_poster: "",
    status: "draft",
    featured: false,
    sort_order: 1,
    credits: {
      director: "Samir El-Hosary",
      cinematographer: "",
      editor: "",
      colorist: "",
      producer: "",
      agency: ""
    }
  };

  if (projectId) {
    container.innerHTML = `<div class="skeleton" style="height: 500px;"></div>`;
    const fetched = await getProjectById(projectId);
    if (fetched) {
      project = fetched;
    }
  }

  hasUnsavedChanges = false;

  container.innerHTML = `
    <form id="project-editor-form">
      <div class="editor-header">
        <div>
          <h2 style="font-size: 1.35rem; font-weight: 700;">
            ${projectId ? "EDIT PROJECT" : "ADD NEW PROJECT"}
          </h2>
          <span style="font-size: 0.8rem; color: var(--gray);">
            ${projectId ? `ID: ${projectId}` : "New Project Draft"}
          </span>
        </div>
        <div style="display: flex; gap: 1rem;">
          <button type="button" id="editor-cancel-btn" class="btn btn-secondary">CANCEL</button>
          <button type="button" id="editor-save-draft-btn" class="btn btn-secondary">SAVE DRAFT</button>
          <button type="submit" id="editor-publish-btn" class="btn btn-accent">PUBLISH PROJECT</button>
        </div>
      </div>

      <!-- Navigation tabs for sections -->
      <div class="editor-sections-nav">
        <a class="editor-nav-item active" href="#sec-basic">Basic Info</a>
        <a class="editor-nav-item" href="#sec-desc">Description</a>
        <a class="editor-nav-item" href="#sec-story">Story & Creative</a>
        <a class="editor-nav-item" href="#sec-media">Media & Video</a>
        <a class="editor-nav-item" href="#sec-credits">Credits & Crew</a>
        <a class="editor-nav-item" href="#sec-settings">Settings</a>
      </div>

      <!-- 1. BASIC INFORMATION -->
      <div class="editor-section" id="sec-basic">
        <h3 class="editor-section-title">BASIC INFORMATION</h3>
        
        <div class="form-group">
          <label class="form-label">Project Title *</label>
          <input type="text" class="form-input" id="proj-title" value="${escapeHtml(project.title_en || project.title_ar || '')}" placeholder="e.g. Urban Architecture Campaign" required />
        </div>

        <div class="form-grid-3" style="margin-top: 1.5rem;">
          <div class="form-group">
            <label class="form-label">Client / Brand *</label>
            <input type="text" class="form-input" id="proj-client" value="${escapeHtml(project.client_name || '')}" placeholder="e.g. Nike, Red Bull, Metropolis" required />
          </div>
          <div class="form-group">
            <label class="form-label">Year</label>
            <input type="text" class="form-input" id="proj-year" value="${escapeHtml(project.year || '2026')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Category</label>
            <select class="form-select" id="proj-category">
              <option value="commercial" ${project.category === 'commercial' ? 'selected' : ''}>Commercial</option>
              <option value="branded" ${project.category === 'branded' ? 'selected' : ''}>Branded Content</option>
              <option value="reels" ${project.category === 'reels' ? 'selected' : ''}>Reels</option>
              <option value="social" ${project.category === 'social' ? 'selected' : ''}>Social</option>
              <option value="other" ${project.category === 'other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
        </div>

        <div class="form-group" style="margin-top: 1.5rem;">
          <label class="form-label">Directing Role</label>
          <input type="text" class="form-input" id="proj-role" value="${escapeHtml(project.role_en || project.role_ar || 'Director')}" placeholder="e.g. Director / Cinematographer" />
        </div>
      </div>

      <!-- 2. DESCRIPTION & OVERVIEW -->
      <div class="editor-section" id="sec-desc">
        <h3 class="editor-section-title">DESCRIPTION &amp; OVERVIEW</h3>
        <div class="form-group">
          <label class="form-label">Overview &amp; Short Description</label>
          <textarea class="form-textarea" id="proj-desc" placeholder="A brief editorial overview of the commercial campaign...">${escapeHtml(project.description_en || project.description_ar || '')}</textarea>
        </div>
      </div>

      <!-- 3. STORY & CREATIVE SECTIONS -->
      <div class="editor-section" id="sec-story">
        <h3 class="editor-section-title">STORY &amp; CREATIVE DEVELOPMENT</h3>

        <div class="form-group">
          <label class="form-label">The Idea (Creative Concept)</label>
          <textarea class="form-textarea" id="proj-concept" placeholder="Explain the creative thinking behind the film...">${escapeHtml(project.concept_en || project.concept_ar || '')}</textarea>
        </div>

        <div class="form-group" style="margin-top: 1.5rem;">
          <label class="form-label">The Challenge</label>
          <textarea class="form-textarea" id="proj-challenge" placeholder="Client objectives and visual challenges...">${escapeHtml(project.challenge_en || project.challenge_ar || '')}</textarea>
        </div>

        <div class="form-group" style="margin-top: 1.5rem;">
          <label class="form-label">The Creative Approach</label>
          <textarea class="form-textarea" id="proj-approach" placeholder="Visual direction, camera decisions, pacing, and lighting treatment...">${escapeHtml(project.approach_en || project.approach_ar || '')}</textarea>
        </div>

        <div class="form-group" style="margin-top: 1.5rem;">
          <label class="form-label">Execution</label>
          <textarea class="form-textarea" id="proj-execution" placeholder="Shooting days, location details, cinematography, and post-production...">${escapeHtml(project.execution_en || project.execution_ar || '')}</textarea>
        </div>

        <div class="form-group" style="margin-top: 1.5rem;">
          <label class="form-label">Production &amp; Technical Notes</label>
          <textarea class="form-textarea" id="proj-notes" placeholder="Camera packages, lenses, color grading pipeline, and technical specs...">${escapeHtml(project.production_notes_en || project.production_notes_ar || '')}</textarea>
        </div>
      </div>

      <!-- 4. MEDIA ASSETS -->
      <div class="editor-section" id="sec-media">
        <h3 class="editor-section-title">MEDIA &amp; VIDEO ASSETS</h3>
        
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Cover Image URL *</label>
            <input type="url" class="form-input" id="proj-cover" value="${escapeHtml(project.cover_image || '')}" placeholder="https://.../cover.jpg" required />
          </div>
          <div class="form-group">
            <label class="form-label">Hero Media URL (Image or Video)</label>
            <input type="url" class="form-input" id="proj-hero" value="${escapeHtml(project.hero_media || '')}" placeholder="https://.../hero.jpg or hero.mp4" />
          </div>
        </div>

        <div class="form-grid-2" style="margin-top: 1.5rem;">
          <div class="form-group">
            <label class="form-label">Final Film Video URL (MP4 / WebM)</label>
            <input type="url" class="form-input" id="proj-final-film" value="${escapeHtml(project.final_film_url || '')}" placeholder="https://.../video.mp4" />
          </div>
          <div class="form-group">
            <label class="form-label">Hero Media Type</label>
            <select class="form-select" id="proj-hero-type">
              <option value="image" ${project.hero_media_type === 'image' ? 'selected' : ''}>Image</option>
              <option value="video" ${project.hero_media_type === 'video' ? 'selected' : ''}>Video</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 5. CREDITS & CREW -->
      <div class="editor-section" id="sec-credits">
        <h3 class="editor-section-title">CREDITS &amp; CREW</h3>
        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">Director</label>
            <input type="text" class="form-input" id="credit-director" value="${escapeHtml(project.credits?.director || 'Samir El-Hosary')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Cinematography (DOP)</label>
            <input type="text" class="form-input" id="credit-dop" value="${escapeHtml(project.credits?.cinematographer || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Editor</label>
            <input type="text" class="form-input" id="credit-editor" value="${escapeHtml(project.credits?.editor || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Colorist</label>
            <input type="text" class="form-input" id="credit-colorist" value="${escapeHtml(project.credits?.colorist || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Producer</label>
            <input type="text" class="form-input" id="credit-producer" value="${escapeHtml(project.credits?.producer || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Creative Agency</label>
            <input type="text" class="form-input" id="credit-agency" value="${escapeHtml(project.credits?.agency || '')}" />
          </div>
        </div>
      </div>

      <!-- 6. PUBLISHING SETTINGS -->
      <div class="editor-section" id="sec-settings">
        <h3 class="editor-section-title">PROJECT SETTINGS</h3>
        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">Project Status</label>
            <select class="form-select" id="proj-status">
              <option value="draft" ${project.status === 'draft' ? 'selected' : ''}>DRAFT</option>
              <option value="published" ${project.status === 'published' ? 'selected' : ''}>PUBLISHED</option>
              <option value="archived" ${project.status === 'archived' ? 'selected' : ''}>ARCHIVED</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Sort Order</label>
            <input type="number" class="form-input" id="proj-sort-order" value="${project.sort_order || 1}" min="0" />
          </div>
          <div class="form-group" style="display: flex; align-items: center; gap: 0.75rem; margin-top: 1.8rem;">
            <input type="checkbox" id="proj-featured" ${project.featured ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: var(--orange);" />
            <label for="proj-featured" class="form-label" style="margin: 0; cursor: pointer;">Feature on Homepage</label>
          </div>
        </div>
      </div>
    </form>
  `;

  container.querySelectorAll("input, textarea, select").forEach((el) => {
    el.addEventListener("input", () => { hasUnsavedChanges = true; });
  });

  container.querySelector("#editor-cancel-btn").addEventListener("click", () => {
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        hasUnsavedChanges = false;
        navigateTo("projects");
      }
    } else {
      navigateTo("projects");
    }
  });

  const saveProjectData = async (targetStatus) => {
    const title = container.querySelector("#proj-title")?.value.trim();
    const client = container.querySelector("#proj-client")?.value.trim();
    const cover = container.querySelector("#proj-cover")?.value.trim();

    if (!title) {
      Toast.error("Project title is required.");
      return;
    }
    if (!client) {
      Toast.error("Client name is required.");
      return;
    }
    if (!cover) {
      Toast.error("Cover image URL is required.");
      return;
    }

    const payload = {
      title_en: title,
      title_ar: title,
      client_name: client,
      year: container.querySelector("#proj-year")?.value || "2026",
      category: container.querySelector("#proj-category")?.value || "commercial",
      role_en: container.querySelector("#proj-role")?.value || "Director",
      role_ar: container.querySelector("#proj-role")?.value || "Director",
      description_en: container.querySelector("#proj-desc")?.value || "",
      description_ar: container.querySelector("#proj-desc")?.value || "",
      concept_en: container.querySelector("#proj-concept")?.value || "",
      concept_ar: container.querySelector("#proj-concept")?.value || "",
      challenge_en: container.querySelector("#proj-challenge")?.value || "",
      challenge_ar: container.querySelector("#proj-challenge")?.value || "",
      approach_en: container.querySelector("#proj-approach")?.value || "",
      approach_ar: container.querySelector("#proj-approach")?.value || "",
      execution_en: container.querySelector("#proj-execution")?.value || "",
      execution_ar: container.querySelector("#proj-execution")?.value || "",
      production_notes_en: container.querySelector("#proj-notes")?.value || "",
      production_notes_ar: container.querySelector("#proj-notes")?.value || "",
      cover_image: cover,
      hero_media: container.querySelector("#proj-hero")?.value || cover,
      hero_media_type: container.querySelector("#proj-hero-type")?.value || "image",
      final_film_url: container.querySelector("#proj-final-film")?.value || "",
      featured: container.querySelector("#proj-featured")?.checked || false,
      status: targetStatus || container.querySelector("#proj-status")?.value || "draft",
      sort_order: parseInt(container.querySelector("#proj-sort-order")?.value, 10) || 1,
      credits: {
        director: container.querySelector("#credit-director")?.value || "",
        cinematographer: container.querySelector("#credit-dop")?.value || "",
        editor: container.querySelector("#credit-editor")?.value || "",
        colorist: container.querySelector("#credit-colorist")?.value || "",
        producer: container.querySelector("#credit-producer")?.value || "",
        agency: container.querySelector("#credit-agency")?.value || ""
      }
    };

    try {
      if (projectId) {
        await updateProject(projectId, payload);
        Toast.success("Project saved successfully.");
      } else {
        await createProject(payload);
        Toast.success(targetStatus === "published" ? "Project published successfully." : "Project saved successfully.");
      }
      hasUnsavedChanges = false;
      navigateTo("projects");
    } catch (err) {
      console.error(err);
      Toast.error("Unable to save changes.");
    }
  };

  container.querySelector("#project-editor-form").addEventListener("submit", (e) => {
    e.preventDefault();
    saveProjectData("published");
  });

  container.querySelector("#editor-save-draft-btn").addEventListener("click", () => {
    saveProjectData("draft");
  });
}

/* ============================================================
 * CLIENT FEEDBACK MANAGEMENT TAB
 * ============================================================ */
async function renderFeedbackManager(container) {
  container.innerHTML = `
    <div class="table-toolbar">
      <div>
        <h3 class="admin-topbar-title">Client Feedback</h3>
      </div>
      <div>
        <button id="add-fb-btn" class="btn btn-accent">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ADD TESTIMONIAL
        </button>
      </div>
    </div>

    <!-- New Feedback Form Box -->
    <div id="new-fb-box" class="admin-card" style="display: none; margin-bottom: 2rem;">
      <h4 class="admin-card-title" id="fb-form-title">Add Testimonial</h4>
      <form id="feedback-form" style="margin-top: 1.5rem;">
        <input type="hidden" id="fb-edit-id" value="" />
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Client Full Name *</label>
            <input type="text" class="form-input" id="fb-name" required placeholder="e.g. John Doe" />
          </div>
          <div class="form-group">
            <label class="form-label">Company / Brand</label>
            <input type="text" class="form-input" id="fb-company" placeholder="e.g. Metropolis Media" />
          </div>
        </div>
        <div class="form-group" style="margin-top: 1.5rem;">
          <label class="form-label">Client Role / Title</label>
          <input type="text" class="form-input" id="fb-role" placeholder="e.g. Chief Marketing Officer" />
        </div>
        <div class="form-group" style="margin-top: 1.5rem;">
          <label class="form-label">Testimonial Quote *</label>
          <textarea class="form-textarea" id="fb-quote" required placeholder="Working with Samir was seamless from concept to delivery..."></textarea>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem;">
          <button type="button" id="cancel-fb-btn" class="btn btn-secondary">CANCEL</button>
          <button type="submit" class="btn btn-accent">SAVE TESTIMONIAL</button>
        </div>
      </form>
    </div>

    <!-- Feedback List -->
    <div class="table-responsive">
      <table class="admin-table">
        <thead>
          <tr>
            <th>CLIENT NAME</th>
            <th>COMPANY</th>
            <th>QUOTE</th>
            <th style="text-align: right;">ACTIONS</th>
          </tr>
        </thead>
        <tbody id="feedback-tbody">
          <tr><td colspan="4" style="text-align: center; padding: 2rem;">Loading testimonials...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  const newFbBox = container.querySelector("#new-fb-box");
  const addFbBtn = container.querySelector("#add-fb-btn");
  const cancelFbBtn = container.querySelector("#cancel-fb-btn");
  const fbForm = container.querySelector("#feedback-form");

  addFbBtn.addEventListener("click", () => {
    fbForm.reset();
    container.querySelector("#fb-edit-id").value = "";
    newFbBox.style.display = "block";
    newFbBox.scrollIntoView({ behavior: "smooth" });
  });

  cancelFbBtn.addEventListener("click", () => {
    newFbBox.style.display = "none";
  });

  fbForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = container.querySelector("#fb-edit-id").value;
    const quote = container.querySelector("#fb-quote").value;
    const role = container.querySelector("#fb-role").value;
    const payload = {
      client_name: container.querySelector("#fb-name").value,
      company: container.querySelector("#fb-company").value,
      client_role_en: role,
      client_role_ar: role,
      quote_en: quote,
      quote_ar: quote,
      is_visible: true
    };

    try {
      if (id) {
        await updateFeedback(id, payload);
        Toast.success("Testimonial updated.");
      } else {
        await createFeedback(payload);
        Toast.success("Testimonial added.");
      }
      newFbBox.style.display = "none";
      await loadAndRenderFeedback();
    } catch (err) {
      Toast.error("Unable to save feedback.");
    }
  });

  const loadAndRenderFeedback = async () => {
    const tbody = container.querySelector("#feedback-tbody");
    try {
      feedbackCache = await getFeedback();
      if (feedbackCache.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 2rem;">No testimonials found.</td></tr>`;
        return;
      }

      tbody.innerHTML = feedbackCache.map((f) => {
        const quote = escapeHtml(i18n.getLocalized(f, "quote"));
        return `
          <tr data-id="${f.id}">
            <td><strong>${escapeHtml(f.client_name)}</strong></td>
            <td>${escapeHtml(f.company || '-')}</td>
            <td style="max-width: 450px;"><div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${quote}</div></td>
            <td style="text-align: right;">
              <div class="table-actions" style="justify-content: flex-end;">
                <button class="btn-icon edit-fb-btn" data-id="${f.id}" title="Edit">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button class="btn-icon danger del-fb-btn" data-id="${f.id}" title="Delete">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");

      tbody.querySelectorAll(".edit-fb-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const item = feedbackCache.find((x) => x.id === btn.getAttribute("data-id"));
          if (!item) return;
          container.querySelector("#fb-edit-id").value = item.id;
          container.querySelector("#fb-name").value = item.client_name || "";
          container.querySelector("#fb-company").value = item.company || "";
          container.querySelector("#fb-role").value = item.client_role_en || item.client_role_ar || "";
          container.querySelector("#fb-quote").value = item.quote_en || item.quote_ar || "";
          newFbBox.style.display = "block";
          newFbBox.scrollIntoView({ behavior: "smooth" });
        });
      });

      tbody.querySelectorAll(".del-fb-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const id = btn.getAttribute("data-id");
          const confirmed = await confirmDialog("Are you sure you want to delete this testimonial?");
          if (confirmed) {
            await deleteFeedback(id);
            Toast.success("Testimonial deleted.");
            await loadAndRenderFeedback();
          }
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  await loadAndRenderFeedback();
}
