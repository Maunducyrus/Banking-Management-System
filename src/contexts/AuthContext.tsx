// import React, { createContext, useContext, useState, useEffect } from 'react';
// import type { ReactNode } from 'react';
// import type { User, AuthContextType } from '../types';
// import { authApi, getToken, setToken, clearToken } from '../services/api';


// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('auth_user');
//     const token = getToken();
//     if (storedUser && token) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (_) {}
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     // debugging
//     console.log('LOGIN FUNCTION CALLED');
//     setIsLoading(true);
//     try {
//       const response = await authApi.signIn({
//         userName: email,
//         userPassword: password,
        
//       });


//       console.log('LOGIN RESPONSE:', response);
   

//       // HANDLES API ERRORS FIRST
//       if (response?.error) {
//         throw new Error(response.errorMessage || 'Login failed');
//       }

//       // console.log('LOGIN RESPONSE:', response);

//       // const token =
//       //   response.token ||
//       //   response.accessToken ||
//       //   response.access_token ||
//       //   (typeof response === 'string' ? response : null);

//       const extractToken = (res: any) =>
//         res?.token ||
//         res?.accessToken ||
//         res?.access_token ||
//         res?.generatedToken || // adjusted
//         res?.data?.token ||
//         res?.data?.accessToken ||
//         res?.data?.access_token;

//       const token = extractToken(response);

// // Commented out because the backend doesn't sent roles (token for the roles)

//       // if (token) {
//       //   setToken(token);
//       //   const userObj: User = {
//       //     id: response.id || response.userId || email,
//       //     email: email,
//       //     firstName: response.firstName || response.first_name || '',
//       //     lastName: response.lastName || response.last_name || '',
//       //     role: (response.role === 'ADMIN' || response.roles?.includes?.('ADMIN')) ? 'ADMIN' : 'USER',
//       //     status: 'active',
//       //     createdAt: new Date().toISOString(),
//       //     updatedAt: new Date().toISOString(),
//       //   };

//       if (token) {
//         setToken(token);

//         const isAdmin = email === 'itsdevelelopernic22@gmail.com';

//         const userObj: User = {
//           id: email,
//           email: email,
//           firstName: response.firstName || '',
//           lastName: response.lastName || '',
//           role: isAdmin ? 'ADMIN' : 'USER',
//           status: 'active',
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         };
//         setUser(userObj);
//         localStorage.setItem('auth_user', JSON.stringify(userObj));
//         setIsLoading(false);
//         return true;
//       }
//       console.log('LOGIN RESPONSE:', response);
//       console.log('LOGIN RESPONSE FULL:', response);

//       setIsLoading(false);
//       return false;
//     } catch (error) {
//       console.error('Login error:', error);
//       setIsLoading(false);
//       return false;
//     }
//   };


//   const logout = () => {
//     setUser(null);
//     clearToken();
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };



import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types';
import { authApi, getToken, setToken, clearToken } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user,      setUser]      = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    clearToken();
  }, []);

  // ── Listen for token expiry events fired by api.ts ──────────────────────────
  // When apiFetch receives a 401 it dispatches 'auth:token-expired'.
  // We catch it here and log the user out with a toast notification.
  useEffect(() => {
    const handleTokenExpired = () => {
      console.warn('[AuthContext] Token expired event received — logging out');
      logout();
      toast.error('Your session has expired. Please sign in again.', {
        duration: 5000,
        id: 'session-expired', // prevent duplicate toasts
      });
    };

    window.addEventListener('auth:token-expired', handleTokenExpired);
    return () => window.removeEventListener('auth:token-expired', handleTokenExpired);
  }, [logout]);

  // ── Restore session on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    const token      = getToken();

    if (storedUser && token) {
      try {
        // Also check if JWT is already expired client-side before even making a request
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp && payload.exp * 1000 < Date.now();

        if (isExpired) {
          console.warn('[AuthContext] Stored token is already expired on mount — clearing');
          clearToken();
        } else {
          setUser(JSON.parse(storedUser));
        }
      } catch (_) {
        // Malformed token or user object — clear both
        clearToken();
      }
    }

    setIsLoading(false);
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('LOGIN FUNCTION CALLED');
    setIsLoading(true);
    try {
      const response = await authApi.signIn({
        userName:     email,
        userPassword: password,
      });

      console.log('LOGIN RESPONSE:', response);

      if (response?.error) {
        throw new Error(response.errorMessage || 'Login failed');
      }

      // Extract token — try every possible field name
      const token =
        response?.token           ||
        response?.accessToken     ||
        response?.access_token    ||
        response?.generatedToken  ||
        response?.data?.token     ||
        response?.data?.accessToken ||
        response?.data?.access_token;

      if (token) {
        setToken(token);

        // Decode JWT to check expiry immediately (optional sanity check)
        try {
          const payload  = JSON.parse(atob(token.split('.')[1]));
          const expiresAt = new Date((payload.exp ?? 0) * 1000).toLocaleTimeString();
          console.log(`[AuthContext] Token expires at: ${expiresAt}`);
        } catch (_) {}

        const isAdmin = email === 'itsdevelopernic22@gmail.com';

        const userObj: User = {
          id:        email,
          email:     email,
          firstName: response.firstName || '',
          lastName:  response.lastName  || '',
          role:      isAdmin ? 'ADMIN' : 'USER',
          status:    'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUser(userObj);
        localStorage.setItem('auth_user', JSON.stringify(userObj));
        setIsLoading(false);
        return true;
      }

      console.warn('[AuthContext] No token in response:', response);
      setIsLoading(false);
      return false;

    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      setIsLoading(false);
      return false;
    }
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
