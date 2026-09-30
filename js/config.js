/**
 * SAMIR EL-HOSARY — Director & Filmmaker
 * Application & Supabase Configuration (English Only)
 */

export const CONFIG = {
  // Supabase REST & Auth API base URL (e.g., "https://xyzcompany.supabase.co")
  SUPABASE_URL: "YOUR_SUPABASE_URL",

  // Supabase anon / public API key
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",

  // Storage bucket name for images & videos
  STORAGE_BUCKET: "portfolio-media",

  // Contact form submission mailto address
  CONTACT_EMAIL: "contact@samirelhosary.com",
  CONTACT_PHONE: "+20 100 000 0000",

  // Social Links
  SOCIAL: {
    instagram: "https://instagram.com/samirelhosary",
    behance: "https://behance.net/samirelhosary",
    linkedin: "https://linkedin.com/in/samirelhosary",
    youtube: "https://youtube.com/@samirelhosary"
  },

  // App default language
  DEFAULT_LANG: "en",

  IS_CONFIGURED() {
    return this.SUPABASE_URL && 
           this.SUPABASE_URL !== "YOUR_SUPABASE_URL" && 
           this.SUPABASE_ANON_KEY && 
           this.SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";
  }
};
