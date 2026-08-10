// frontend/src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthContext initializing...');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');

    console.log('📦 LocalStorage data:', { token: !!token, userId, userName, userRole });

    if (token && userId) {
      setUser({
        id: userId,
        name: userName || 'User',
        email: userEmail || '',
        role: userRole || 'user'
      });
      console.log('✅ User restored:', { name: userName, role: userRole });
    } else {
      console.log('❌ No user found in localStorage');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('📤 Login attempt:', email);
      const res = await api.post('/auth/login', { email, password });
      console.log('📥 Response:', res.data);
      
      const { token, user } = res.data;
      const role = user.role || (user.isAdmin ? 'admin' : 'user');
      
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name || 'User');
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userRole', role);
      
      setUser({
        id: user.id,
        name: user.name || 'User',
        email: user.email,
        role
      });
      
      console.log('✅ Login successful! Role:', role);
      return { success: true, user: { ...user, role } };
      
    } catch (err) {
      console.error('❌ Login error:', err.response?.data);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    console.log('👋 Logged out');
  };

  // Profile update kora hole (jemon name/email) — state ebong localStorage duitai update hobe,
  // fole pura app-e naya info shathe shathe dekha jabe.
  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const newUser = { ...prev, ...updates };
      if (updates.name) localStorage.setItem('userName', updates.name);
      if (updates.email) localStorage.setItem('userEmail', updates.email);
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};