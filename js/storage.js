/**
 * Storage Layer: Handles localStorage preferences, tokens, and local cache.
 */

const STORAGE_KEYS = {
  LANG: "samir_portfolio_lang",
  SESSION: "samir_portfolio_session",
  LOCAL_DB_PREFIX: "samir_portfolio_db_",
  CONFIG_OVERRIDE: "samir_portfolio_config_override"
};

export const Storage = {
  // --- Language (Fixed to English) ---
  getLanguage(defaultLang = "en") {
    return "en";
  },

  setLanguage(lang) {
    // English only
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, "en");
    } catch (e) {}
  },

  // --- Auth Session ---
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
    } catch (e) {
      console.warn("Storage.setSession failed", e);
    }
  },

  removeSession() {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (e) {}
  },

  // --- Local Database Fallback (used when Supabase is not connected) ---
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
    } catch (e) {
      console.warn(`Failed saving collection ${name}`, e);
    }
  },

  // --- Runtime Config Override ---
  getConfigOverride() {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.CONFIG_OVERRIDE);
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  },

  setConfigOverride(config) {
    try {
      if (!config) {
        localStorage.removeItem(STORAGE_KEYS.CONFIG_OVERRIDE);
      } else {
        localStorage.setItem(STORAGE_KEYS.CONFIG_OVERRIDE, JSON.stringify(config));
      }
    } catch (e) {}
  }
};
