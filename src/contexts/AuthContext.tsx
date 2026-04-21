import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types';
import { authApi, getToken, setToken, clearToken } from '../services/api';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    const token = getToken();
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (_) {}
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // debugging
    console.log('LOGIN FUNCTION CALLED');
    setIsLoading(true);
    try {
      const response = await authApi.signIn({
        userName: email,
        userPassword: password,
        
      });


      console.log('LOGIN RESPONSE:', response);
   

      // HANDLES API ERRORS FIRST
      if (response?.error) {
        throw new Error(response.errorMessage || 'Login failed');
      }

      // console.log('LOGIN RESPONSE:', response);

      // const token =
      //   response.token ||
      //   response.accessToken ||
      //   response.access_token ||
      //   (typeof response === 'string' ? response : null);

      const extractToken = (res: any) =>
        res?.token ||
        res?.accessToken ||
        res?.access_token ||
        res?.generatedToken || // adjusted
        res?.data?.token ||
        res?.data?.accessToken ||
        res?.data?.access_token;

      const token = extractToken(response);

// Commented out because the backend doesn't sent roles (token for the roles)

      // if (token) {
      //   setToken(token);
      //   const userObj: User = {
      //     id: response.id || response.userId || email,
      //     email: email,
      //     firstName: response.firstName || response.first_name || '',
      //     lastName: response.lastName || response.last_name || '',
      //     role: (response.role === 'ADMIN' || response.roles?.includes?.('ADMIN')) ? 'ADMIN' : 'USER',
      //     status: 'active',
      //     createdAt: new Date().toISOString(),
      //     updatedAt: new Date().toISOString(),
      //   };

      if (token) {
        setToken(token);

        const isAdmin = email === 'itsdevelelopernic22@gmail.com';

        const userObj: User = {
          id: email,
          email: email,
          firstName: response.firstName || '',
          lastName: response.lastName || '',
          role: isAdmin ? 'ADMIN' : 'USER',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(userObj);
        localStorage.setItem('auth_user', JSON.stringify(userObj));
        setIsLoading(false);
        return true;
      }
      console.log('LOGIN RESPONSE:', response);
      console.log('LOGIN RESPONSE FULL:', response);

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };


  const logout = () => {
    setUser(null);
    clearToken();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
