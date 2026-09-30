/**
 * SAMIR EL-HOSARY — Admin Dashboard Overview & Settings Controller (dashboard.js)
 * English-only implementation of overview counters, profile settings, and site settings.
 */

import { 
  getProjects, 
  getAllMedia, 
  getFeedback, 
  getProfile, 
  updateProfile, 
  getSiteSettings, 
  updateSiteSetting 
} from "./api.js";
import { Toast, escapeHtml } from "./utils.js";
import { i18n } from "./i18n.js";

/**
 * Render the Overview Tab (Stats, Recent projects table, Quick actions)
 */
export async function renderOverview(container, navigateToTab) {
  if (!container) return;

  container.innerHTML = `
    <!-- 1. Stats Counter Cards -->
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

    <!-- 2. Quick Actions -->
    <div class="admin-card">
      <div class="admin-card-header">
        <h3 class="admin-card-title">QUICK ACTIONS</h3>
      </div>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <button id="qa-add-project" class="btn btn-primary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ADD PROJECT
        </button>
        <button id="qa-manage-projects" class="btn btn-secondary">
          MANAGE PROJECTS
        </button>
        <a href="index.html" target="_blank" class="btn btn-secondary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          VIEW WEBSITE
        </a>
      </div>
    </div>

    <!-- 3. Recent Projects -->
    <div class="admin-card">
      <div class="admin-card-header">
        <h3 class="admin-card-title">RECENT PROJECTS</h3>
        <button id="view-all-projects-btn" class="link-arrow" style="font-size: 0.8rem;">
          VIEW ALL PROJECTS →
        </button>
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
            </tr>
          </thead>
          <tbody id="recent-projects-tbody">
            <tr><td colspan="6" style="text-align: center; padding: 2rem;">Loading...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.querySelector("#qa-add-project").addEventListener("click", () => navigateToTab("add-project"));
  container.querySelector("#qa-manage-projects").addEventListener("click", () => navigateToTab("projects"));
  container.querySelector("#view-all-projects-btn").addEventListener("click", () => navigateToTab("projects"));

  try {
    const [projects, media, feedback] = await Promise.all([
      getProjects(),
      getAllMedia(),
      getFeedback()
    ]);

    document.getElementById("stat-total").textContent = projects.length;
    document.getElementById("stat-published").textContent = projects.filter((p) => p.status === "published").length;
    document.getElementById("stat-drafts").textContent = projects.filter((p) => p.status === "draft").length;
    document.getElementById("stat-feedback").textContent = feedback.length;
    document.getElementById("stat-media").textContent = media.length;

    const tbody = document.getElementById("recent-projects-tbody");
    const recent = projects.slice(0, 5);

    if (recent.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem;">No projects created yet. Start by adding your first project!</td></tr>`;
      return;
    }

    tbody.innerHTML = recent.map((p) => {
      const title = escapeHtml(i18n.getLocalized(p, "title") || "Untitled Project");
      const client = escapeHtml(p.client_name || "");
      const cat = escapeHtml(p.category || "");
      const year = escapeHtml(p.year || "");
      const cover = p.cover_image || "assets/images/placeholder.jpg";
      const statusBadge = p.status === "published"
        ? `<span class="badge badge-published">PUBLISHED</span>`
        : `<span class="badge badge-draft">DRAFT</span>`;

      return `
        <tr style="cursor: pointer;" onclick="window.location.hash = '#edit-project-${p.id}'">
          <td><img src="${escapeHtml(cover)}" class="tbl-thumbnail" alt="" /></td>
          <td><strong>${title}</strong></td>
          <td>${client}</td>
          <td style="text-transform: uppercase;">${cat}</td>
          <td>${year}</td>
          <td>${statusBadge}</td>
        </tr>
      `;
    }).join("");
  } catch (err) {
    console.error("Failed to load dashboard overview data", err);
  }
}

/**
 * Render the Profile Settings Tab (English only)
 */
export async function renderProfileSettings(container) {
  if (!container) return;

  container.innerHTML = `<div class="skeleton" style="height: 400px;"></div>`;

  try {
    const profile = await getProfile();

    container.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header">
          <h3 class="admin-card-title">PROFILE SETTINGS</h3>
        </div>
        <form id="profile-form">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" class="form-input" id="prof-name" value="${escapeHtml(profile.full_name_en || profile.full_name_ar || 'Samir El-Hosary')}" required />
            </div>
            <div class="form-group">
              <label class="form-label">Professional Title</label>
              <input type="text" class="form-input" id="prof-title" value="${escapeHtml(profile.title_en || profile.title_ar || 'Director & Filmmaker')}" />
            </div>
          </div>

          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">Secondary Title</label>
            <input type="text" class="form-input" id="prof-sectitle" value="${escapeHtml(profile.secondary_title_en || profile.secondary_title_ar || 'Commercial Director / Videographer')}" />
          </div>

          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">Bio &amp; Philosophy</label>
            <textarea class="form-textarea" id="prof-bio" style="min-height: 120px;">${escapeHtml(profile.bio_en || profile.bio_ar || '')}</textarea>
          </div>

          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">Profile Portrait Image URL</label>
            <input type="url" class="form-input" id="prof-image" value="${escapeHtml(profile.image_url || '')}" />
          </div>

          <div class="form-grid-2" style="margin-top: 1.5rem;">
            <div class="form-group">
              <label class="form-label">Direct Email</label>
              <input type="email" class="form-input" id="prof-email" value="${escapeHtml(profile.email || '')}" />
            </div>
            <div class="form-group">
              <label class="form-label">Phone / WhatsApp</label>
              <input type="text" class="form-input" id="prof-phone" value="${escapeHtml(profile.phone || '')}" />
            </div>
          </div>

          <div class="form-grid-2" style="margin-top: 1.5rem;">
            <div class="form-group">
              <label class="form-label">Instagram URL</label>
              <input type="url" class="form-input" id="prof-instagram" value="${escapeHtml(profile.instagram || '')}" />
            </div>
            <div class="form-group">
              <label class="form-label">Behance URL</label>
              <input type="url" class="form-input" id="prof-behance" value="${escapeHtml(profile.behance || '')}" />
            </div>
          </div>

          <div class="form-grid-2" style="margin-top: 1.5rem;">
            <div class="form-group">
              <label class="form-label">LinkedIn URL</label>
              <input type="url" class="form-input" id="prof-linkedin" value="${escapeHtml(profile.linkedin || '')}" />
            </div>
            <div class="form-group">
              <label class="form-label">YouTube URL</label>
              <input type="url" class="form-input" id="prof-youtube" value="${escapeHtml(profile.youtube || '')}" />
            </div>
          </div>

          <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
            <button type="submit" class="btn btn-accent">SAVE PROFILE</button>
          </div>
        </form>
      </div>
    `;

    container.querySelector("#profile-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = container.querySelector("#prof-name").value;
      const title = container.querySelector("#prof-title").value;
      const secTitle = container.querySelector("#prof-sectitle").value;
      const bio = container.querySelector("#prof-bio").value;

      const updates = {
        full_name_en: name,
        full_name_ar: name,
        title_en: title,
        title_ar: title,
        secondary_title_en: secTitle,
        secondary_title_ar: secTitle,
        bio_en: bio,
        bio_ar: bio,
        image_url: container.querySelector("#prof-image").value,
        email: container.querySelector("#prof-email").value,
        phone: container.querySelector("#prof-phone").value,
        instagram: container.querySelector("#prof-instagram").value,
        behance: container.querySelector("#prof-behance").value,
        linkedin: container.querySelector("#prof-linkedin").value,
        youtube: container.querySelector("#prof-youtube").value
      };

      try {
        await updateProfile(updates);
        Toast.success("Profile updated successfully.");
      } catch (err) {
        Toast.error("Unable to save profile changes.");
      }
    });
  } catch (err) {
    console.error("Error loading profile", err);
    Toast.error("Failed to load profile.");
  }
}

/**
 * Render the Site Settings Tab (English only)
 */
export async function renderSiteSettings(container) {
  if (!container) return;

  container.innerHTML = `<div class="skeleton" style="height: 400px;"></div>`;

  try {
    const settings = await getSiteSettings();

    container.innerHTML = `
      <div class="admin-card">
        <div class="admin-card-header">
          <h3 class="admin-card-title">SITE SETTINGS</h3>
        </div>
        <form id="settings-form">
          <div class="form-group">
            <label class="form-label">Hero Main Title</label>
            <input type="text" class="form-input" id="set-hero-title" value="${escapeHtml(settings.hero_title_en || 'SAMIR EL-HOSARY')}" />
          </div>

          <div class="form-group" style="margin-top: 1.5rem;">
            <label class="form-label">Hero Headline Description</label>
            <textarea class="form-textarea" id="set-hero-desc">${escapeHtml(settings.hero_desc_en || 'I create visual stories, commercials and branded films that turn ideas into images people remember.')}</textarea>
          </div>

          <div class="form-grid-2" style="margin-top: 1.5rem;">
            <div class="form-group">
              <label class="form-label">Showreel Video URL (MP4)</label>
              <input type="url" class="form-input" id="set-showreel-video" value="${escapeHtml(settings.showreel_video || '')}" />
            </div>
            <div class="form-group">
              <label class="form-label">Showreel Poster Image URL</label>
              <input type="url" class="form-input" id="set-showreel-poster" value="${escapeHtml(settings.showreel_poster || '')}" />
            </div>
          </div>

          <div class="form-grid-2" style="margin-top: 1.5rem;">
            <div class="form-group">
              <label class="form-label">Years of Experience Stat</label>
              <input type="text" class="form-input" id="set-stat-years" value="${escapeHtml(settings.stat_years || '8+')}" />
            </div>
            <div class="form-group">
              <label class="form-label">Commercial Projects Stat</label>
              <input type="text" class="form-input" id="set-stat-projects" value="${escapeHtml(settings.stat_projects || '65+')}" />
            </div>
          </div>

          <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
            <button type="submit" class="btn btn-accent">SAVE SETTINGS</button>
          </div>
        </form>
      </div>
    `;

    container.querySelector("#settings-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const title = container.querySelector("#set-hero-title").value;
        const desc = container.querySelector("#set-hero-desc").value;
        await updateSiteSetting("hero_title_en", title);
        await updateSiteSetting("hero_title_ar", title);
        await updateSiteSetting("hero_desc_en", desc);
        await updateSiteSetting("hero_desc_ar", desc);
        await updateSiteSetting("showreel_video", container.querySelector("#set-showreel-video").value);
        await updateSiteSetting("showreel_poster", container.querySelector("#set-showreel-poster").value);
        await updateSiteSetting("stat_years", container.querySelector("#set-stat-years").value);
        await updateSiteSetting("stat_projects", container.querySelector("#set-stat-projects").value);
        Toast.success("Site settings saved successfully.");
      } catch (err) {
        Toast.error("Unable to save settings.");
      }
    });
  } catch (err) {
    console.error("Error loading settings", err);
    Toast.error("Failed to load settings.");
  }
}
