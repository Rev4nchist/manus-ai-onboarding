// lib/hooks/use-auth.ts
import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { signIn, signOut, getUserType, onAuthStateChange } from '../firebase/auth';
import { UserType } from '../types/user';

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser);
      setUserType(getUserType());
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle sign in
  const handleSignIn = async (email: string, userType: UserType) => {
    try {
      setLoading(true);
      const result = await signIn(email, userType);
      
      // Redirect based on user type
      if (result.userType === 'customer') {
        router.push('/customer/dashboard');
      } else {
        router.push('/staff/projects');
      }
      
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    userType,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    isAuthenticated: !!user,
    isCustomer: userType === 'customer',
    isStaff: userType === 'staff',
  };
}
