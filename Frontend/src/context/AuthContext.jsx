import { createContext, useContext, useState, useEffect } from 'react';
import apiFetch from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('token', data.token);
      setUser(data);
      return true;
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const firstName = name.split(' ')[0];
      const lastName = name.split(' ').slice(1).join(' ') || '';
      
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, password })
      });
      localStorage.setItem('token', data.token);
      setUser(data);
      return true;
    } catch (error) {
      console.error('Signup error:', error.message);
      throw error;
    }
  };

  const googleLogin = async (credential) => {
    try {
      const data = await apiFetch('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential })
      });
      localStorage.setItem('token', data.token);
      setUser(data);
      return true;
    } catch (error) {
      console.error('Google login error:', error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      const updatedUser = await apiFetch('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      // Merge token so we don't lose it in local state
      setUser(prev => ({ ...prev, ...updatedUser, token: prev?.token || localStorage.getItem('token') }));
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, login, signup, googleLogin, logout, updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
