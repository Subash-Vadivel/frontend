import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import BusinessCreatePage from './pages/BusinessCreatePage.jsx';
import BusinessSelectPage from './pages/BusinessSelectPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ExpensePage from './pages/ExpensePage.jsx';
import IncomePage from './pages/IncomePage.jsx';
import InvitationAcceptPage from './pages/InvitationAcceptPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import McpPage from './pages/McpPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LandingPage initialAuthMode="login" />} />
      <Route path="/signup" element={<LandingPage initialAuthMode="signup" />} />
      <Route path="/invitations/:token" element={<InvitationAcceptPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/businesses/select" element={<BusinessSelectPage />} />
        <Route path="/businesses/new" element={<BusinessCreatePage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/expenses" element={<ExpensePage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/mcp" element={<McpPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
