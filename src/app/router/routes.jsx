import { lazy } from "react";
import AuthLayout from "../layout/AuthLayout";

const HomePage = lazy(() => import("../../pages/home/HomePage"));
const PropertiesPage = lazy(() => import("../../pages/properties/PropertiesPage"));
const PropertyDetailPage = lazy(() => import("../../pages/property-detail/PropertyDetailPage"));

const BookingPage = lazy(() => import("../../pages/booking/BookingPage"));
const CompareReportPage = lazy(() => import("../../pages/compare/CompareReportPage"));
const InboxPage = lazy(() => import("../../pages/inbox/InboxPage"));

const NotFoundPage = lazy(() => import("../../pages/not-found/NotFoundPage"));
const ProfilePage = lazy(() => import("../../pages/profile/ProfilePage"));
const SavedSearchesPage = lazy(() => import("../../pages/profile/SavedSearchesPage"));
const ViewedPropertiesPage = lazy(() => import("../../pages/profile/ViewedPropertiesPage"));
const FavoritesPage = lazy(() => import("../../pages/profile/FavoritesPage"));
const BookingsPage = lazy(() => import("../../pages/profile/BookingsPage"));
const PrivacyControlsPage = lazy(() => import("../../pages/settings/PrivacyControlsPage"));
const FinancialPrecheckPage = lazy(() => import("../../pages/precheck/FinancialPrecheckPage"));
const ShareWithBanksPage = lazy(() => import("../../pages/precheck/ShareWithBanksPage"));

const RoleSelectionPage = lazy(() => import("../../pages/auth/RoleSelectionPage"));
const LoginPage = lazy(() => import("../../pages/auth/LoginPage"));
const SignupPage = lazy(() => import("../../pages/auth/SignupPage"));
const ForgotPasswordPage = lazy(() => import("../../pages/auth/ForgotPasswordPage"));
const VerifyCodePage = lazy(() => import("../../pages/auth/VerifyCodePage"));
const SetPasswordPage = lazy(() => import("../../pages/auth/SetPasswordPage"));

export const routes = [
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
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