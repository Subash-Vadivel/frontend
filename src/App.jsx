import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ExpensePage from './pages/ExpensePage.jsx';
import IncomePage from './pages/IncomePage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import McpPage from './pages/McpPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LandingPage initialAuthMode="login" />} />
      <Route path="/signup" element={<LandingPage initialAuthMode="signup" />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/expenses" element={<ExpensePage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/mcp" element={<McpPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
