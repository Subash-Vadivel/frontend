import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useBusiness } from '../../context/BusinessContext.jsx';
import { Loader } from '../ui/loader.jsx';

export default function ProtectedRoute() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  // Block only until the first list is loaded; later refreshes keep the current page mounted.
  const { ready: businessesReady } = useBusiness();
  const location = useLocation();

  if (authLoading || (isAuthenticated && !businessesReady)) return <Loader fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}
