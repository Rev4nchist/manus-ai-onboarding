'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthContext } from '@/components/providers/auth-provider';
import { UserType } from '@/lib/types/user';

// Form validation schema
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  userType: z.enum(['customer', 'staff'] as const)
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuthContext();
  
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      userType: 'customer'
    }
  });
  
  const onSubmit = async (data: SignInFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn(data.email, data.userType);
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border rounded-md"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">User Type</label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="customer"
                type="radio"
                value="customer"
                {...register('userType')}
                className="mr-2"
                disabled={isLoading}
              />
              <label htmlFor="customer">Customer</label>
            </div>
            <div className="flex items-center">
              <input
                id="staff"
                type="radio"
                value="staff"
                {...register('userType')}
                className="mr-2"
                disabled={isLoading}
              />
              <label htmlFor="staff">Staff</label>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
