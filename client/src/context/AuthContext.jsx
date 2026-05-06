import { createContext, useContext, useEffect, useState } from 'react';

import api, { TOKEN_STORAGE_KEY } from '../services/api';

const AuthContext = createContext(null);

function persistSession(token, user, setToken, setUser) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  setToken(token);
  setUser(user);
}

function clearSession(setToken, setUser) {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  setToken(null);
  setUser(null);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY));
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async (activeToken = token) => {
    if (!activeToken) {
      setUser(null);
      return null;
    }

    try {
      const { data } = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });

      setUser(data.user);
      return data.user;
    } catch (error) {
      if (error?.response?.status === 401) {
        clearSession(setToken, setUser);
      }

      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!storedToken) {
        setLoading(false);
        return;
      }

      setToken(storedToken);

      try {
        await fetchCurrentUser(storedToken);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    persistSession(data.token, data.user, setToken, setUser);
    return data;
  };

  const register = async (details) => {
    const { data } = await api.post('/auth/register', details);
    persistSession(data.token, data.user, setToken, setUser);
    return data;
  };

  const logout = () => {
    clearSession(setToken, setUser);
  };

  const refreshUser = async () => {
    const refreshedUser = await fetchCurrentUser(token);
    return refreshedUser;
  };

  const updateUser = (updates) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      return {
        ...currentUser,
        ...updates,
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        login,
        register,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
