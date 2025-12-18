import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api, { fetchCsrfToken } from '../utils/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch authenticated user on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch CSRF token first
        await fetchCsrfToken();
        
        const response = await api.get('/user');
        setUser(response.data.user);
        // Store user info in sessionStorage for persistence
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
      } catch (error) {
        // User is not authenticated
        setUser(null);
        // Clear user info from sessionStorage
        sessionStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Ensure we have a fresh CSRF token
      await fetchCsrfToken();
      
      const response = await api.post('/login', { email, password });
      setUser(response.data.user);
      // Store user info in sessionStorage for persistence
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      // Even if the request fails, clear the user state
    } finally {
      setUser(null);
      // Clear user info from sessionStorage
      sessionStorage.removeItem('user');
    }
  };

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    try {
      // Ensure we have a fresh CSRF token
      await fetchCsrfToken();
      
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      setUser(response.data.user);
      // Store user info in sessionStorage for persistence
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};