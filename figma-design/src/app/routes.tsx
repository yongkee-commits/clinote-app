import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Onboarding } from "./components/Onboarding";
import { Login } from "./components/Login";
import { ReplyScreen } from "./components/ReplyScreen";
import { TemplateScreen } from "./components/TemplateScreen";
import { HistoryScreen } from "./components/HistoryScreen";
import { ClinicScreen } from "./components/ClinicScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { SubscriptionScreen } from "./components/SubscriptionScreen";
import { NoticeScreen } from "./components/NoticeScreen";
import { TermsScreen } from "./components/TermsScreen";
import { PrivacyScreen } from "./components/PrivacyScreen";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Onboarding },
      { path: "login", Component: Login },
      { 
        path: "reply", 
        element: (
          <ProtectedRoute>
            <ReplyScreen />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "template", 
        element: (
          <ProtectedRoute>
            <TemplateScreen />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "history", 
        element: (
          <ProtectedRoute>
            <HistoryScreen />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "clinic", 
        element: (
          <ProtectedRoute>
            <ClinicScreen />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "settings", 
        element: (
          <ProtectedRoute>
            <SettingsScreen />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "subscription", 
        element: (
          <ProtectedRoute>
            <SubscriptionScreen />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "notice", 
        element: (
          <ProtectedRoute>
            <NoticeScreen />
          </ProtectedRoute>
        ) 
      },
      { path: "terms", Component: TermsScreen },
      { path: "privacy", Component: PrivacyScreen },
    ],
  },
]);