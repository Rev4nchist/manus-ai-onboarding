// components/providers/auth-provider.tsx
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { UserType } from '@/lib/types/user';
import { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  userType: UserType | null;
  loading: boolean;
  signIn: (email: string, userType: UserType) => Promise<any>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isCustomer: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
