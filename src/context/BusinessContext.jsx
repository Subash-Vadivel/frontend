import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BUSINESS_STORAGE_KEY, createBusiness as createBusinessRequest, listBusinesses } from '../api/businessApi';
import { workspacePath } from '../lib/workspace.js';
import { useAuth } from './AuthContext.jsx';

const BusinessContext = createContext(null);

export function BusinessProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState(() => localStorage.getItem(BUSINESS_STORAGE_KEY));
  const [fetching, setFetching] = useState(false);
  // Which login state the list was last loaded for. Until it matches, the list is stale (e.g. the
  // render right after a reload or login), and "no businesses" must not be treated as real.
  const [loadedFor, setLoadedFor] = useState(null);
  const ready = loadedFor === isAuthenticated;
  const loading = fetching || !ready;
  const [error, setError] = useState('');

  const refreshBusinesses = useCallback(async () => {
    if (!isAuthenticated) {
      setBusinesses([]);
      setSelectedBusinessId(null);
      localStorage.removeItem(BUSINESS_STORAGE_KEY);
      setLoadedFor(false);
      return [];
    }
    setFetching(true);
    setError('');
    try {
      const nextBusinesses = await listBusinesses();
      setBusinesses(nextBusinesses);
      const storedId = localStorage.getItem(BUSINESS_STORAGE_KEY);
      const storedStillAvailable = nextBusinesses.some((business) => business.id === storedId);
      if (storedStillAvailable) {
        setSelectedBusinessId(storedId);
      } else if (nextBusinesses.length === 1) {
        localStorage.setItem(BUSINESS_STORAGE_KEY, nextBusinesses[0].id);
        setSelectedBusinessId(nextBusinesses[0].id);
      } else {
        localStorage.removeItem(BUSINESS_STORAGE_KEY);
        setSelectedBusinessId(null);
      }
      return nextBusinesses;
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to load businesses');
      setBusinesses([]);
      setSelectedBusinessId(null);
      localStorage.removeItem(BUSINESS_STORAGE_KEY);
      return [];
    } finally {
      setFetching(false);
      setLoadedFor(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    refreshBusinesses();
  }, [authLoading, refreshBusinesses]);

  const selectBusiness = useCallback((businessId) => {
    if (!businessId) {
      localStorage.removeItem(BUSINESS_STORAGE_KEY);
      setSelectedBusinessId(null);
      return;
    }
    localStorage.setItem(BUSINESS_STORAGE_KEY, businessId);
    setSelectedBusinessId(businessId);
  }, []);

  const createBusiness = useCallback(async (payload) => {
    const business = await createBusinessRequest(payload);
    const nextBusinesses = await refreshBusinesses();
    selectBusiness(business.id);
    setBusinesses(nextBusinesses.length ? nextBusinesses : [business]);
    return business;
  }, [refreshBusinesses, selectBusiness]);

  const selectedBusiness = useMemo(
    () => businesses.find((business) => business.id === selectedBusinessId) || null,
    [businesses, selectedBusinessId],
  );
  // Builds links inside the current workspace: wsPath('/reports') -> /w/<id>/reports.
  const wsPath = useCallback((path) => workspacePath(selectedBusinessId, path), [selectedBusinessId]);
  const role = selectedBusiness?.role || null;
  const canWriteFinance = ['owner', 'admin', 'manager'].includes(role);
  const canManageUsers = ['owner', 'admin'].includes(role);
  const canManageMcp = ['owner', 'admin'].includes(role);
  const canManageSettings = ['owner', 'admin'].includes(role);
  const isOwner = role === 'owner';
  const isViewer = role === 'viewer';

  const value = useMemo(() => ({
    businesses,
    selectedBusiness,
    selectedBusinessId,
    role,
    canWriteFinance,
    canManageUsers,
    canManageMcp,
    canManageSettings,
    isOwner,
    isViewer,
    loading,
    ready,
    error,
    refreshBusinesses,
    selectBusiness,
    createBusiness,
    wsPath,
  }), [businesses, selectedBusiness, selectedBusinessId, role, canWriteFinance, canManageUsers, canManageMcp, canManageSettings, isOwner, isViewer, loading, ready, error, refreshBusinesses, selectBusiness, createBusiness, wsPath]);

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export const useBusiness = () => useContext(BusinessContext);
