# SAMIR EL-HOSARY — DIRECTOR & FILMMAKER
### Premium Cinematic Portfolio & Private Admin Dashboard (CMS)

A production-ready, editorial digital portfolio and private management dashboard designed for **Samir El-Hosary** (Commercial Director, Filmmaker & Visual Storyteller).

Built strictly with **Pure Vanilla JavaScript (ES Modules), HTML5, and CSS3**, communicating directly with the **Supabase REST, Auth, and Storage APIs** using native `fetch()` without any frontend frameworks or SDKs.

---

## 1. Project Architecture & File Structure

```text
samir/
│
├── index.html               # Public Homepage (Hero, Showreel, Selected Work, Filters)
├── project.html             # Full 15-Section Case Study Details Page
├── about.html               # Director Philosophy, Bio, Editorial Expertise & Stats
├── contact.html             # Inquiry Form (Mailto & extensible API) & Direct Contacts
├── admin.html               # Private CMS Dashboard & Multi-Section Bilingual Editor
│
├── css/
│   ├── style.css            # Global Design System, Color Palette, Typography, Lightbox
│   ├── responsive.css       # 320px to 1920px Breakpoints & RTL/LTR Layout Rules
│   └── dashboard.css        # Dark Creative CMS Interface Styles & Form Elements
│
├── js/
│   ├── config.js            # Supabase API Credentials & App Settings
│   ├── storage.js           # LocalStorage, Session Caching, Offline Mock Store
│   ├── i18n.js              # Full Arabic (RTL) & English (LTR) Translation Engine
│   ├── api.js               # Data Access Layer (PostgREST, Auth REST, Storage REST)
│   ├── auth.js              # Supabase Session Management & Route Protection
│   ├── utils.js             # Toast Notifications, Lightbox, Before/After Slider, Modals
│   ├── main.js              # Homepage, Filters, Showreel Player, Contact Controller
│   ├── project.js           # Case Study 15-Section Renderer & SEO Controller
│   ├── dashboard.js         # Overview Counters, Profile & Site Settings Controller
│   ├── admin.js             # CMS Routing, Bilingual Project Editor & Feedback Manager
│   └── media.js             # Storage Bucket Media Manager & Upload Handler
│
├── assets/
│   ├── images/              # Cinematic Assets & Offline Fallback Graphic
│   ├── videos/              # Video Clips & Reels
│   └── icons/               # SVG Marks & UI Icons
│
├── supabase/
│   └── schema.sql           # Complete Database Schema, Indexes, RLS Policies & Seeds
│
└── README.md                # Documentation & Setup Guide
```

---

## 2. Visual Style & Design Philosophy

- **Color Palette**:
  - `--black: #090909;` (Deep Cinematic Black)
  - `--dark: #101010;` (Primary Dark Surface)
  - `--dark-2: #161616;` (Elevated Cards & Containers)
  - `--white: #F4F4F1;` (Soft Editorial White)
  - `--light: #E9E9E5;` (Secondary Text)
  - `--gray: #8F8F8F;` (Metadata & Labels)
  - `--orange: #D55C03;` (Careful Accent / Film Amber)
  - `--orange-light: #F06A0A;` (Accent Hover)
- **Typography**: Modern bilingual sans-serif pairing `Plus Jakarta Sans` for English and `IBM Plex Sans Arabic` for Arabic.
- **Visual Focus**: The director's cinematography and visual storytelling take center stage with high-contrast framing, 2.39:1 widescreen ratios, fine 1px borders, and disciplined spacing.

---

## 3. How to Configure Supabase

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In your Project Settings, navigate to **API**.
3. Copy your **Project URL** (e.g. `https://yourprojectref.supabase.co`) and **anon / public key**.

### Step 2: Update `js/config.js`
Open `js/config.js` and paste your project details:

```javascript
export const CONFIG = {
  SUPABASE_URL: "https://yourprojectref.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOi...",
  STORAGE_BUCKET: "portfolio-media",
  CONTACT_EMAIL: "contact@samirelhosary.com",
  ...
};
```

> **Security Note:** NEVER place your `service_role` key in frontend code. The application uses only the `anon` public key paired with PostgreSQL Row Level Security (RLS).

---

## 4. How to Create Database Tables & Row Level Security

1. In your Supabase Dashboard, open the **SQL Editor**.
2. Open the file `supabase/schema.sql` located in this project repository.
3. Paste the complete SQL code into the Supabase SQL editor and click **Run**.

This script sets up:
- `profiles` table (Director bio, contacts, social media)
- `projects` table (Bilingual title, description, concept, challenge, approach, execution, credits)
- `project_media` table (Stills, BTS, Raw, Before/After assets)
- `project_feedback` table (Client testimonials)
- `site_settings` table (Showreel, stats, hero configuration)
- **Row Level Security (RLS)** policies ensuring public visitors can only read published projects and approved feedback, while authenticated admins have full CRUD permissions.
- Pre-populated seed data with 4 demo commercial campaigns.

---

## 5. How to Create the Storage Bucket

1. In Supabase, navigate to **Storage**.
2. Click **Create new bucket**.
3. Set Bucket Name: `portfolio-media`.
4. Check **Public bucket** (so public portfolio visitors can stream stills and video previews).
5. The storage RLS policies in `supabase/schema.sql` allow public read access while restricting uploads and deletions to authenticated administrators.

---

## 6. How to Create the Admin User

1. In Supabase, navigate to **Authentication** -> **Users**.
2. Click **Add user** -> **Create user**.
3. Enter your email (e.g. `admin@samirelhosary.com`) and choose a strong password.
4. Toggle **Auto Confirm User** to ON.
5. You can now log into `admin.html` with this account!

> **Offline Demo Mode:** If Supabase keys are left as `YOUR_SUPABASE_URL`, the application automatically operates in local demo mode, allowing offline testing of all CMS features, uploads, edits, and deletions without cloud connectivity.

---

## 7. How to Run Locally

You can serve the files with any static HTTP server:

### Option A: Python 3
```powershell
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000)

### Option B: Node.js (npx serve)
```powershell
npx serve .
```

### Option C: VS Code Live Server
Right-click `index.html` and choose **Open with Live Server**.

---

## 8. How to Deploy

Because this is a pure HTML5/CSS3/Vanilla JS ES Modules application with zero build steps, you can deploy it instantly to any static hosting platform:

- **Vercel**: Run `vercel` or connect your GitHub repository.
- **Netlify**: Drag and drop the folder into Netlify Drop or link Git.
- **Cloudflare Pages**: Connect repo, set build command to empty, output folder to `.`.
- **GitHub Pages**: Push to repository and enable GitHub Pages in settings.

---

## 9. Admin Dashboard Features

Navigate to `admin.html` to access the private CMS:

1. **Dashboard Overview**: Live counter stats (Total, Published, Drafts, Feedback, Media), recent projects table, and quick actions.
2. **Projects Management**:
   - Filter by All, Published, Draft, Archived, Featured.
   - Search by title or client.
   - Edit, Preview, Duplicate, or Delete projects with confirmation.
3. **Multi-Section Bilingual Project Editor**:
   - `[ العربية ] [ ENGLISH ]` tabs for title, short description, concept (The Idea), challenge, approach, execution, and production notes.
   - Cover image and Hero media configuration.
   - Final Film responsive player URL.
   - Film credits and crew assignments.
   - Save Draft or Publish toggle with unsaved-changes protection.
4. **Media Manager**:
   - Upload images and videos directly to Supabase Storage.
   - Real progress bar and error reporting.
   - One-click public URL copying and file deletion.
5. **Client Feedback Management**: Add, edit, or delete client testimonials.
6. **Profile & Site Settings**: Edit director bio, social channels, showreel video, and statistics directly from the browser.

---

## 10. Clean English Editorial System

- **Clean Minimal Layout**: Standard LTR typography and layout engineered with Plus Jakarta Sans.
- **Pure Editorial Experience**: Minimal navigation without distracting language toggles, keeping 100% focus on cinematography and visual media.
- **Universal Accessibility**: Semantic headings, accessible ARIA attributes, and keyboard navigation.

---

## 11. Complete Case Study Structure (`project.html`)

Every project is rendered as an in-depth creative case study:
1. **Project Hero**: Cinematic full-bleed video or still with title, client, year, category, and role.
2. **Project Metadata**: Client, production year, category, directing role.
3. **Overview**: Concise brief summary.
4. **The Idea**: Creative narrative and conceptual thinking.
5. **The Challenge**: Client objective and technical obstacles.
6. **The Approach**: Cinematic treatment, visual references, lighting direction.
7. **Execution**: Production timeline, shooting days, camera rigs, post-production.
8. **Final Film**: Native HTML5 high-definition video player with poster fallback.
9. **Final Stills**: Gallery with custom Vanilla JS fullscreen Lightbox (keyboard arrows, ESC key).
10. **Behind the Scenes**: Masonry grid of BTS stills and equipment rigs.
11. **Raw / Production Material**: Camera test notes and lens specifications.
12. **From Raw to Final**: Interactive before/after split comparison slider (Log vs Graded).
13. **Client Feedback**: Authentic client quote with author name, role, and company.
14. **Credits**: Director, DOP, Editor, Colorist, Producer, Agency.
15. **Project Navigation**: Seamless previous and next project pagination.

---

© 2026 Samir El-Hosary. Director & Filmmaker. All Rights Reserved.
