// lib/firebase/auth.ts
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './config';

// Simple sign in function for MVP
export const signIn = async (email: string, userType: 'customer' | 'staff') => {
  // For MVP, we'll use a simple authentication approach
  // In a real app, we would validate passwords properly
  const password = 'password123'; // Default password for MVP demo
  
  try {
    // Try to sign in with the provided email
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Store user type in localStorage for routing
    localStorage.setItem('userType', userType);
    
    return {
      user: userCredential.user,
      userType
    };
  } catch (error) {
    // If user doesn't exist, create a new account
    if ((error as any).code === 'auth/user-not-found') {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Store user type in localStorage for routing
      localStorage.setItem('userType', userType);
      
      return {
        user: userCredential.user,
        userType
      };
    }
    throw error;
  }
};

// Sign out function
export const signOut = async () => {
  localStorage.removeItem('userType');
  return firebaseSignOut(auth);
};

// Get current user type from localStorage
export const getUserType = (): 'customer' | 'staff' | null => {
  if (typeof window === 'undefined') return null;
  
  const userType = localStorage.getItem('userType') as 'customer' | 'staff' | null;
  return userType;
};

// Custom hook for auth state
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
