// src/services/api/auth.js
import { apiPost } from "./client";
import { ENDPOINTS } from "./endpoints";

/**
 * authApi: project-consistent (fetch client) + backend-friendly
 * Returns JSON directly (your apiPost already parses and throws good errors)
 */
export const authApi = {
  login(payload) {
    return apiPost(ENDPOINTS.authLogin, payload); // -> { token, user }
  },

  register(payload) {
    return apiPost(ENDPOINTS.authRegister, payload); // -> { token, user } or { challengeId } etc.
  },

  // optional future flows
  forgotPassword(payload) {
    return apiPost(ENDPOINTS.authForgotPassword, payload);
  },

  resendCode(payload) {
    return apiPost(ENDPOINTS.authResendCode, payload);
  },

  verifyCode(payload) {
    return apiPost(ENDPOINTS.authVerifyCode, payload);
  },

  setPassword(payload) {
    return apiPost(ENDPOINTS.authSetPassword, payload);
  },
};