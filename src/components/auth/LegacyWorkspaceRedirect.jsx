import { Navigate, useLocation } from 'react-router-dom';
import { useBusiness } from '../../context/BusinessContext.jsx';
import { workspacePath } from '../../lib/workspace.js';

// Old links (/dashboard, /reports/123, ...) and post-login "/dashboard" go to the selected workspace.
export default function LegacyWorkspaceRedirect() {
  const { selectedBusinessId } = useBusiness();
  const location = useLocation();
  if (!selectedBusinessId) return <Navigate to="/businesses/select" replace />;
  return <Navigate to={workspacePath(selectedBusinessId, `${location.pathname}${location.search}`)} replace />;
}
