import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (user: any, token: string, userType: 'admin' | 'voter') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('AuthProvider rendering...');
  
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userType: null,
    token: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    console.log('AuthProvider useEffect - checking stored auth...');
    // Check for stored auth data on app start
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    const userType = localStorage.getItem('auth_user_type');

    console.log('Stored auth data:', { 
      hasToken: !!token, 
      hasUser: !!user, 
      userType 
    });

    if (token && user && userType) {
      console.log('Restoring auth state...');
      setAuthState({
        user: JSON.parse(user),
        userType: userType as 'admin' | 'voter',
        token,
        isAuthenticated: true,
      });
    } else {
      console.log('No stored auth data found');
    }
  }, []);

  const login = (user: any, token: string, userType: 'admin' | 'voter') => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('auth_user_type', userType);

    setAuthState({
      user,
      userType,
      token,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_user_type');

    setAuthState({
      user: null,
      userType: null,
      token: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};