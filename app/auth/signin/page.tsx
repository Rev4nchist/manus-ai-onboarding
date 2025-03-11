'use client';

import { SignInForm } from '@/components/auth/signin-form';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">MANIS_A.I.</h1>
          <p className="text-gray-600">Customer Onboarding Portal</p>
        </div>
        
        <SignInForm />
      </div>
    </div>
  );
}
