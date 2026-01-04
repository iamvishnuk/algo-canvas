'use client';

import useAuth from '@/hooks/useAuth';
import { IUser } from '@/types/interface';
import { createContext, useContext } from 'react';

type AuthContextType = {
  user?: IUser;
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, error, isLoading, isFetching, refetch } = useAuth();

  const user = data?.data;

  return (
    <AuthContext.Provider
      value={{ user, error, isLoading, isFetching, refetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
};
