import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, login as loginRequest } from '../api/authApi';

const AuthContext = createContext(null);
const TOKEN_KEY = 'farm_accounts_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    let ignore = false;
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const currentUser = await getCurrentUser();
        if (!ignore) setUser(currentUser);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        if (!ignore) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    loadUser();
    return () => {
      ignore = true;
    };
  }, [token]);

  const login = async (credentials) => {
    const response = await loginRequest(credentials);
    localStorage.setItem(TOKEN_KEY, response.access_token);
    setToken(response.access_token);
    setLoading(true);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, isAuthenticated: Boolean(token), login, logout }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
