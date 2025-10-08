import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('corphaus_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        const userData = {
          id: response.user._id,
          ...response.user,
        };
        setUser(userData);
        localStorage.setItem('corphaus_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const signup = async (email, password, role, businessName = '') => {
    try {
      const name = businessName || email.split('@')[0];
      const response = await authAPI.signup(email, password, name, role, businessName);
      
      if (response.success) {
        const userData = {
          id: response.user._id,
          ...response.user,
        };
        setUser(userData);
        localStorage.setItem('corphaus_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: error.message || 'Signup failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('corphaus_user');
  };

  const upgradeToPaid = async () => {
    if (user) {
      try {
        const response = await authAPI.upgrade(user.id || user._id);
        
        if (response.success) {
          const updatedUser = {
            ...user,
            isPaid: true,
            subscriptionPlan: 'pro',
          };
          setUser(updatedUser);
          localStorage.setItem('corphaus_user', JSON.stringify(updatedUser));
          return { success: true };
        }
        
        return { success: false, message: response.message };
      } catch (error) {
        console.error('Upgrade error:', error);
        return { success: false, message: error.message };
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    upgradeToPaid,
    isAuthenticated: !!user,
    isLandlord: user?.role === 'landlord',
    isBusiness: user?.role === 'business',
    isPaid: user?.isPaid || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

