import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import LegacyWorkspaceRedirect from './components/auth/LegacyWorkspaceRedirect.jsx';
import AccountLayout from './components/layout/AccountLayout.jsx';
import WorkspaceRoute from './components/auth/WorkspaceRoute.jsx';
import BusinessCreatePage from './pages/BusinessCreatePage.jsx';
import BusinessSelectPage from './pages/BusinessSelectPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ExpensePage from './pages/ExpensePage.jsx';
import IncomePage from './pages/IncomePage.jsx';
import InvitationAcceptPage from './pages/InvitationAcceptPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import McpPage from './pages/McpPage.jsx';
import ReportDetailPage from './pages/ReportDetailPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';

const LEGACY_WORKSPACE_PATHS = ['/dashboard', '/reports', '/reports/:reportId', '/income', '/expenses', '/categories', '/users', '/settings'];

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
        <Route path="/w/:businessId" element={<WorkspaceRoute />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="reports/:reportId" element={<ReportDetailPage />} />
          <Route path="income" element={<IncomePage />} />
          <Route path="expenses" element={<ExpensePage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="mcp" element={<Navigate to="/account/mcp" replace />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="/account" element={<AccountLayout />}>
          <Route path="mcp" element={<McpPage />} />
        </Route>
        <Route path="/mcp" element={<Navigate to="/account/mcp" replace />} />
        {LEGACY_WORKSPACE_PATHS.map((path) => <Route key={path} path={path} element={<LegacyWorkspaceRedirect />} />)}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
