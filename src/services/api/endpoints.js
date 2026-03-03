// src/services/api/endpoints.js
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export const ENDPOINTS = {
  home: `${API_BASE_URL}/api/home`,
  properties: `${API_BASE_URL}/api/properties`,

  // ✅ auth
  authLogin: `${API_BASE_URL}/api/auth/login`,
  authRegister: `${API_BASE_URL}/api/auth/register`,
  authForgotPassword: `${API_BASE_URL}/api/auth/forgot-password`,
  authResendCode: `${API_BASE_URL}/api/auth/resend-code`,
  authVerifyCode: `${API_BASE_URL}/api/auth/verify-code`,
  authSetPassword: `${API_BASE_URL}/api/auth/set-password`,

  // ✅ profile
  profile: `${API_BASE_URL}/api/profile`,
  profileSettings: `${API_BASE_URL}/api/profile/settings`,
  profileSavedSearches: `${API_BASE_URL}/api/profile/saved-searches`,
  profileViewed: `${API_BASE_URL}/api/profile/viewed`,
  profileFavorites: `${API_BASE_URL}/api/profile/favorites`,
  profileBookings: `${API_BASE_URL}/api/profile/bookings`,

  // ✅ notifications
  notifications: `${API_BASE_URL}/api/notifications`,

  // ✅ financial precheck
  precheckRecent: `${API_BASE_URL}/api/precheck/recent`,
  precheckSearch: `${API_BASE_URL}/api/precheck/search`,
  precheckCalculate: `${API_BASE_URL}/api/precheck/calculate`,
  precheckShare: `${API_BASE_URL}/api/precheck/share`,
};