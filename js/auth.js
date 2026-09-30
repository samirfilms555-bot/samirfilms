/**
 * SAMIR EL-HOSARY — Authentication Layer (auth.js)
 * Manages Supabase Auth REST sessions, route protection, and token validation.
 */

import { login as apiLogin, logout as apiLogout, getCurrentSession } from "./api.js";
import { Storage } from "./storage.js";

export const Auth = {
  /**
   * Check if an active session exists
   */
  async checkSession() {
    const session = Storage.getSession();
    if (!session || !session.access_token) {
      return null;
    }

    // Check expiration if expires_at or expires_in is available
    if (session.expires_at) {
      const now = Math.floor(Date.now() / 1000);
      if (now >= session.expires_at) {
        console.warn("Session expired. Logging out.");
        await this.logout();
        return null;
      }
    }

    try {
      const validSession = await getCurrentSession();
      return validSession;
    } catch (e) {
      console.warn("Session validation error:", e);
      Storage.removeSession();
      return null;
    }
  },

  /**
   * Perform login using Supabase Auth REST
   */
  async login(email, password) {
    if (!email || !password) {
      throw new Error("Please enter both email and password");
    }
    const session = await apiLogin(email.trim(), password);
    return session;
  },

  /**
   * Terminate session and redirect if requested
   */
  async logout(redirectUrl = null) {
    await apiLogout();
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  },

  /**
   * Guard an admin page: if not authenticated, reveal login view
   * @param {function} onAuthenticated - callback when user is logged in
   * @param {function} onUnauthenticated - callback when user is not logged in
   */
  async requireAuth(onAuthenticated, onUnauthenticated) {
    const session = await this.checkSession();
    if (session) {
      if (typeof onAuthenticated === "function") onAuthenticated(session);
      return session;
    } else {
      if (typeof onUnauthenticated === "function") onUnauthenticated();
      return null;
    }
  }
};
