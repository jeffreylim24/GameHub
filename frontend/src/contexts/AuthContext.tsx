/**
 * Authentication context for managing user sessions.
 * Provides username-based authentication without passwords.
 *
 * @module
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  currentUserId: number | null;
  username: string | null;
  isAuthenticated: boolean;

  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'gamehub_user';

/**
 * AuthProvider component that wraps the app and provides auth state.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value: AuthContextType = {
    currentUser,
    currentUserId: currentUser?.user_id ?? null,
    username: currentUser?.username ?? null,
    isAuthenticated: currentUser !== null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context.
 * Must be used within an AuthProvider.
 *
 * @throws {Error} If used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
