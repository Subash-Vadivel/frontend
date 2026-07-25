import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useBusiness } from '../../context/BusinessContext.jsx';

const businessOnboardingPaths = new Set(['/businesses/select', '/businesses/new']);

export default function ProtectedRoute() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { selectedBusiness, loading: businessLoading } = useBusiness();
  const location = useLocation();

  if (authLoading || (isAuthenticated && businessLoading)) return <div className="page-loader">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!selectedBusiness && !businessOnboardingPaths.has(location.pathname)) {
    return <Navigate to="/businesses/select" replace />;
  }
  return <Outlet />;
}
