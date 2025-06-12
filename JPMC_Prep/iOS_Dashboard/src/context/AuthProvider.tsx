import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  checkLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  checkLogin: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLogin = () => {
    const loggedIn = document.cookie.split(';').some(cookie => cookie.trim().startsWith('is_logged_in='));
    console.log('Checking login status:', loggedIn);
    setIsLoggedIn(loggedIn);
    console.log('Login status updated:', loggedIn);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, checkLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);