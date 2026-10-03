import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useBusiness } from '../../context/BusinessContext.jsx';
import AppLayout from '../layout/AppLayout.jsx';
import { Loader } from '../ui/loader.jsx';

// The workspace in the URL is the source of truth: select it (which also sets the X-Business-Id
// header) before rendering any page, so every request goes to the right workspace.
export default function WorkspaceRoute() {
  const { businessId } = useParams();
  const { businesses, selectedBusinessId, selectBusiness } = useBusiness();
  const exists = businesses.some((business) => business.id === businessId);

  useEffect(() => {
    if (exists && selectedBusinessId !== businessId) selectBusiness(businessId);
  }, [exists, businessId, selectedBusinessId, selectBusiness]);

  if (!exists) return <Navigate to="/businesses/select" replace />;
  if (selectedBusinessId !== businessId) return <Loader fullScreen />;
  return <AppLayout />;
}
