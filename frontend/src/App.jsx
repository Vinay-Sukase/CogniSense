import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import CognitiveTestPage from "./pages/CognitiveTestPage";
import ResultsDashboardPage from "./pages/ResultsDashboardPage";
import PerformanceHistoryPage from "./pages/PerformanceHistoryPage";
import SuggestionsPage from "./pages/SuggestionsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUserManagementPage from "./pages/AdminUserManagementPage";

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tests"
        element={
          <ProtectedRoute>
            <CognitiveTestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results/:sessionId"
        element={
          <ProtectedRoute>
            <ResultsDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <PerformanceHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/suggestions/:sessionId"
        element={
          <ProtectedRoute>
            <SuggestionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUserManagementPage />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Layout>
);

export default App;
