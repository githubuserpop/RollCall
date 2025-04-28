import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { currentUser } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<void> => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setUser(currentUser);
    }, 1000);
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    // In a real app, this would be an API call
    setTimeout(() => {
      const newUser = {
        ...currentUser,
        username,
        email,
      };
      setUser(newUser);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    // In a real app, this would be an API call
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};