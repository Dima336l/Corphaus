import { createContext, useContext, useState, useEffect } from 'react';

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

  const login = (email, password, role) => {
    // Mock login - in production this would call your backend API
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      role, // 'landlord' or 'business'
      name: email.split('@')[0],
      isPaid: false, // Free user by default
      createdAt: new Date().toISOString(),
    };
    
    setUser(mockUser);
    localStorage.setItem('corphaus_user', JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  };

  const signup = (email, password, role, businessName = '') => {
    // Mock signup - in production this would call your backend API
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      role, // 'landlord' or 'business'
      name: businessName || email.split('@')[0],
      isPaid: false, // Free user by default
      createdAt: new Date().toISOString(),
    };
    
    setUser(mockUser);
    localStorage.setItem('corphaus_user', JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('corphaus_user');
  };

  const upgradeToPaid = () => {
    if (user) {
      const updatedUser = { ...user, isPaid: true };
      setUser(updatedUser);
      localStorage.setItem('corphaus_user', JSON.stringify(updatedUser));
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

