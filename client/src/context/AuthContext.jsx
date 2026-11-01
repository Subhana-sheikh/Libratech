import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

export const DEMO_ACCOUNTS = {
  ADMIN: {
    _id: 'demo-admin-01',
    name: 'Subhana Sheikh (Admin)',
    email: 'admin@libratech.edu',
    role: 'ADMIN',
    department: 'Chief Library Administration',
    isActive: true
  },
  TEACHER: {
    _id: 'demo-teacher-01',
    name: 'Prof. Rajesh Verma (Faculty)',
    email: 'teacher@libratech.edu',
    role: 'LIBRARIAN',
    department: 'Computer Science & AI Faculty',
    isActive: true
  },
  STUDENT: {
    _id: 'demo-student-01',
    name: 'Aarav Sharma (Student)',
    email: 'student@libratech.edu',
    role: 'STUDENT',
    studentId: 'STU-2024-001',
    department: 'Computer Science',
    isActive: true
  },
  GUEST: {
    _id: 'demo-guest-01',
    name: 'Guest Scholar',
    email: 'guest@libratech.edu',
    role: 'STUDENT',
    studentId: 'GUEST-MEMBER',
    department: 'Open Academic Member',
    isActive: true
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchCurrentUser = async () => {
    // Check local demo persistence first
    const savedDemoUser = localStorage.getItem('libratech_demo_user');
    if (savedDemoUser) {
      try {
        let parsed = JSON.parse(savedDemoUser);
        if (parsed.role === 'ADMIN' || parsed.email === 'admin@libratech.edu' || parsed.name?.includes('Evelyn')) {
          parsed.name = 'Subhana Sheikh (Admin)';
          parsed.department = 'Chief Library Administration';
          localStorage.setItem('libratech_demo_user', JSON.stringify(parsed));
        }
        setUser(parsed);
        setLoading(false);
        return;
      } catch (e) {}
    }

    const token = api.getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        api.setToken(null);
        setUser(null);
      }
    } catch (err) {
      api.setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const quickDemoLogin = (roleType = 'ADMIN') => {
    const key = roleType.toUpperCase();
    const demoUser = DEMO_ACCOUNTS[key] || DEMO_ACCOUNTS.STUDENT;
    api.setToken('demo-token-' + key.toLowerCase());
    localStorage.setItem('libratech_demo_user', JSON.stringify(demoUser));
    setUser(demoUser);
    setAuthError(null);
    return { success: true, user: demoUser };
  };

  const login = async (email, password) => {
    setAuthError(null);
    const normalized = email.toLowerCase().trim();

    // Direct check for demo accounts for instant access
    if (normalized === 'admin@libratech.edu') {
      return quickDemoLogin('ADMIN');
    }
    if (normalized === 'teacher@libratech.edu' || normalized === 'librarian@libratech.edu') {
      return quickDemoLogin('TEACHER');
    }
    if (normalized === 'student@libratech.edu' || normalized === 'guest@libratech.edu') {
      return quickDemoLogin(normalized.includes('guest') ? 'GUEST' : 'STUDENT');
    }

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data?.token) {
        api.setToken(res.data.token);
        localStorage.removeItem('libratech_demo_user');
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      // If server is unreachable or offline, fallback to smart demo session
      if (err.status === 0 || err.message?.includes('Could not reach Libratech backend')) {
        const role = normalized.includes('admin') ? 'ADMIN' : normalized.includes('teach') ? 'TEACHER' : 'STUDENT';
        const fallbackUser = {
          _id: 'user-' + Date.now(),
          name: email.split('@')[0],
          email,
          role: role === 'TEACHER' ? 'LIBRARIAN' : role,
          department: 'Academic Campus'
        };
        api.setToken('fallback-token');
        localStorage.setItem('libratech_demo_user', JSON.stringify(fallbackUser));
        setUser(fallbackUser);
        return { success: true, user: fallbackUser };
      }
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  const register = async (formData) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/register', formData);
      if (res.success && res.data?.token) {
        api.setToken(res.data.token);
        localStorage.removeItem('libratech_demo_user');
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
      throw new Error(res.message || 'Registration failed');
    } catch (err) {
      // Fallback local session if server is offline
      if (err.status === 0 || err.message?.includes('Could not reach Libratech backend')) {
        const assignedRole = formData.role === 'ADMIN' ? 'ADMIN' : formData.role === 'TEACHER' ? 'LIBRARIAN' : 'STUDENT';
        const newUser = {
          _id: 'local-user-' + Date.now(),
          name: formData.name,
          email: formData.email,
          role: assignedRole,
          studentId: formData.studentId,
          department: formData.department || 'Academic Department'
        };
        api.setToken('fallback-token');
        localStorage.setItem('libratech_demo_user', JSON.stringify(newUser));
        setUser(newUser);
        return { success: true, user: newUser };
      }
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Continue client cleanup
    } finally {
      api.setToken(null);
      localStorage.removeItem('libratech_demo_user');
      setUser(null);
    }
  };

  const isStudent = user?.role === 'STUDENT';
  const isLibrarian = user?.role === 'LIBRARIAN';
  const isAdmin = user?.role === 'ADMIN';
  const isStaff = isLibrarian || isAdmin;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      authError,
      login,
      quickDemoLogin,
      register,
      logout,
      refreshUser: fetchCurrentUser,
      isStudent,
      isLibrarian,
      isAdmin,
      isStaff
    }}>
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
