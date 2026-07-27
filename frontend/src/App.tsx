import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import AnalyticsPage from "./pages/AnalyticsPage/AnalyticsPage";
import ChatLogsPage from "./pages/ChatLogsPage/ChatLogsPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage/KnowledgeBasePage";
import WidgetCustomizerPage from "./pages/WidgetCustomizerPage/WidgetCustomizerPage";
import BillingPage from "./pages/BillingPage/BillingPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import OnboardingPage from "./pages/OnboardingPage/OnboardingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import PrototypePage from "./pages/PrototypePage/PrototypePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/prototype" element={<PrototypePage />} />

      {/* Protected Routes (Fallback to landing page / if token is missing or invalid) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat-logs"
        element={
          <ProtectedRoute>
            <ChatLogsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/knowledge-base"
        element={
          <ProtectedRoute>
            <KnowledgeBasePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/widget-customization"
        element={
          <ProtectedRoute>
            <WidgetCustomizerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <BillingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
