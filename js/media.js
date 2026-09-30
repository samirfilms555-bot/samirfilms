/**
 * SAMIR EL-HOSARY — Media Manager Controller (media.js)
 * English-only implementation of media library and Supabase Storage uploads.
 */

import { getAllMedia, uploadMediaFile, deleteProjectMedia, addProjectMedia, getProjects } from "./api.js";
import { Toast, confirmDialog, formatBytes, escapeHtml } from "./utils.js";
import { i18n } from "./i18n.js";

let allMediaList = [];
let currentFilter = "all";

export async function initMediaManager(container) {
  if (!container) return;

  renderMediaLayout(container);
  await loadMediaItems();
}

function renderMediaLayout(container) {
  container.innerHTML = `
    <div class="admin-card-header" style="border: none; padding-bottom: 0;">
      <div>
        <h2 class="admin-topbar-title">Media Library</h2>
        <p class="text-muted" style="font-size: 0.85rem; margin-top: 0.25rem;">
          Manage cinematic image and video assets stored in Supabase Storage.
        </p>
      </div>
      <div>
        <label class="btn btn-accent" style="cursor: pointer; margin: 0;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          UPLOAD MEDIA
          <input type="file" id="media-file-input" multiple accept="image/*,video/*" style="display: none;" />
        </label>
      </div>
    </div>

    <!-- Upload Progress Area -->
    <div id="upload-progress-area" style="margin: 1.5rem 0; display: none;"></div>

    <!-- Filters & Search Toolbar -->
    <div class="table-toolbar" style="margin-top: 2rem;">
      <div class="table-filters">
        <button class="btn btn-secondary media-filter-btn active" data-filter="all">ALL</button>
        <button class="btn btn-secondary media-filter-btn" data-filter="image">IMAGES</button>
        <button class="btn btn-secondary media-filter-btn" data-filter="video">VIDEOS</button>
      </div>
    </div>

    <!-- Media Grid -->
    <div id="media-grid-container" class="media-items-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem;">
      <div class="skeleton" style="height: 180px;"></div>
      <div class="skeleton" style="height: 180px;"></div>
      <div class="skeleton" style="height: 180px;"></div>
    </div>
  `;

  const fileInput = container.querySelector("#media-file-input");
  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesUpload(Array.from(e.target.files));
    }
  });

  container.querySelectorAll(".media-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".media-filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter") || "all";
      renderMediaItems();
    });
  });
}

async function loadMediaItems() {
  try {
    allMediaList = await getAllMedia();
    renderMediaItems();
  } catch (err) {
    console.error("Failed to load media:", err);
    Toast.error("Failed to load media assets.");
  }
}

function renderMediaItems() {
  const container = document.getElementById("media-grid-container");
  if (!container) return;

  const filtered = currentFilter === "all"
    ? allMediaList
    : allMediaList.filter((m) => m.type === currentFilter);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <p class="empty-state-text">No media assets found.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((m) => {
    const isVideo = m.type === "video";
    const title = escapeHtml(i18n.getLocalized(m, "title") || m.caption_en || m.category || "Media Asset");
    return `
      <div class="media-item-card" data-id="${m.id}">
        <div style="position: relative; aspect-ratio: 16/10; overflow: hidden; background-color: var(--dark-2);">
          ${isVideo 
            ? `<video src="${escapeHtml(m.file_url)}" style="width: 100%; height: 100%; object-fit: cover;" muted></video>`
            : `<img src="${escapeHtml(m.file_url)}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />`
          }
          <span class="badge" style="position: absolute; top: 0.5rem; left: 0.5rem; background: rgba(9,9,9,0.75);">
            ${isVideo ? "VIDEO" : "IMAGE"}
          </span>
        </div>
        <div class="media-item-info">
          <div class="media-item-name" title="${title}">${title}</div>
          <div style="font-size: 0.7rem; color: var(--gray); margin-top: 0.25rem;">
            ${escapeHtml(m.category || "portfolio")}
          </div>
          <div class="media-item-actions">
            <button class="btn-icon copy-url-btn" data-url="${escapeHtml(m.file_url)}" title="Copy Public URL">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
            <a href="${escapeHtml(m.file_url)}" target="_blank" rel="noopener" class="btn-icon" title="Open Media">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
            <button class="btn-icon danger delete-media-btn" data-id="${m.id}" title="Delete File">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".copy-url-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const url = btn.getAttribute("data-url");
      navigator.clipboard.writeText(url).then(() => {
        Toast.success("URL copied to clipboard.");
      });
    });
  });

  container.querySelectorAll(".delete-media-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const confirmed = await confirmDialog("Are you sure you want to delete this media file?");
      if (confirmed) {
        try {
          await deleteProjectMedia(id);
          Toast.success("Media file deleted.");
          await loadMediaItems();
        } catch (err) {
          Toast.error("Failed to delete file.");
        }
      }
    });
  });
}

async function handleFilesUpload(files) {
  const progressArea = document.getElementById("upload-progress-area");
  if (!progressArea) return;

  progressArea.style.display = "block";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    progressArea.innerHTML = `
      <div class="admin-stat-card" style="padding: 1rem 1.5rem;">
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem;">
          <span>Uploading: <strong>${escapeHtml(file.name)}</strong> (${i + 1}/${files.length})</span>
          <span id="upload-pct">25%</span>
        </div>
        <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.1);">
          <div id="upload-bar" style="width: 25%; height: 100%; background: var(--orange); transition: width 0.2s;"></div>
        </div>
      </div>
    `;

    try {
      const uploadRes = await uploadMediaFile(file, "library", (state) => {
        const pctEl = document.getElementById("upload-pct");
        const barEl = document.getElementById("upload-bar");
        if (pctEl && barEl) {
          pctEl.textContent = `${state.progress}%`;
          barEl.style.width = `${state.progress}%`;
        }
      });

      await addProjectMedia({
        project_id: null,
        file_url: uploadRes.file_url,
        type: uploadRes.type,
        category: "gallery",
        title_en: file.name,
        is_public: true
      });

      Toast.success(`${file.name}: Upload complete.`);
    } catch (err) {
      console.error("Upload error", err);
      Toast.error(`${file.name}: Upload failed.`);
    }
  }

  progressArea.style.display = "none";
  await loadMediaItems();
}
