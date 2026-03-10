import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";

// helper: lazy + preload (production-friendly)
function lazyWithPreload(factory) {
  const Component = lazy(factory);
  Component.preload = () => factory();
  return Component;
}

const HomePage = lazyWithPreload(() => import("../../pages/home/HomePage"));
const PropertiesPage = lazyWithPreload(() => import("../../pages/properties/PropertiesPage"));
const PropertyDetailPage = lazyWithPreload(() => import("../../pages/property-detail/PropertyDetailPage"));

const BookingPage = lazyWithPreload(() => import("../../pages/booking/BookingPage"));
const CompareReportPage = lazyWithPreload(() => import("../../pages/compare/CompareReportPage"));
const InboxPage = lazyWithPreload(() => import("../../pages/inbox/InboxPage"));

const NotFoundPage = lazyWithPreload(() => import("../../pages/not-found/NotFoundPage"));

const ProfilePage = lazyWithPreload(() => import("../../pages/profile/ProfilePage"));
const SavedSearchesPage = lazyWithPreload(() => import("../../pages/profile/SavedSearchesPage"));
const ViewedPropertiesPage = lazyWithPreload(() => import("../../pages/profile/ViewedPropertiesPage"));
const FavoritesPage = lazyWithPreload(() => import("../../pages/profile/FavoritesPage"));
const BookingsPage = lazyWithPreload(() => import("../../pages/profile/BookingsPage"));
const PrivacyControlsPage = lazyWithPreload(() => import("../../pages/settings/PrivacyControlsPage"));

const FinancialPrecheckPage = lazyWithPreload(() => import("../../pages/precheck/FinancialPrecheckPage"));
const ShareWithBanksPage = lazyWithPreload(() => import("../../pages/precheck/ShareWithBanksPage"));

const RoleSelectionPage = lazyWithPreload(() => import("../../pages/auth/RoleSelectionPage"));
const LoginPage = lazyWithPreload(() => import("../../pages/auth/LoginPage"));
const SignupPage = lazyWithPreload(() => import("../../pages/auth/SignupPage"));
const ForgotPasswordPage = lazyWithPreload(() => import("../../pages/auth/ForgotPasswordPage"));
const VerifyCodePage = lazyWithPreload(() => import("../../pages/auth/VerifyCodePage"));
const SetPasswordPage = lazyWithPreload(() => import("../../pages/auth/SetPasswordPage"));

// optional: idle prefetch (fast navigation without UI break)
export function prefetchCommonRoutes() {
  if (import.meta.env.VITE_PREFETCH_ROUTES === "false") return;

  const run = () => {
    PropertiesPage.preload?.();
    InboxPage.preload?.();
    ProfilePage.preload?.();
  };

  if (typeof window === "undefined") return;
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 2000 });
  } else {
    setTimeout(run, 1200);
  }
}

export const routes = [
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      //  /auth -> /auth/role (no blank screen)
      { index: true, element: <Navigate to="role" replace /> },

      { path: "role", element: <RoleSelectionPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "verify-code", element: <VerifyCodePage /> },
      { path: "set-password", element: <SetPasswordPage /> },
    ],
  },

  { path: "/", element: <HomePage /> },
  { path: "/properties", element: <PropertiesPage /> },
  { path: "/properties/:id", element: <PropertyDetailPage /> },

  { path: "/booking", element: <BookingPage /> },
  { path: "/compare", element: <CompareReportPage /> },
  { path: "/inbox", element: <InboxPage /> },

  { path: "/profile", element: <ProfilePage /> },
  { path: "/profile/saved-searches", element: <SavedSearchesPage /> },
  { path: "/profile/viewed", element: <ViewedPropertiesPage /> },
  { path: "/profile/favorites", element: <FavoritesPage /> },
  { path: "/profile/bookings", element: <BookingsPage /> },
  { path: "/settings/privacy-controls", element: <PrivacyControlsPage /> },

  { path: "/precheck", element: <FinancialPrecheckPage /> },
  { path: "/precheck/share", element: <ShareWithBanksPage /> },

  { path: "*", element: <NotFoundPage /> },
];