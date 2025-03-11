'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/providers/auth-provider';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isCustomer, loading } = useAuthContext();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect if not authenticated or not a customer
    if (!loading && (!isAuthenticated || !isCustomer)) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, isCustomer, loading, router]);
  
  // Show loading state or nothing while checking authentication
  if (loading || !isAuthenticated || !isCustomer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar will go here */}
      <div className="w-64 bg-gray-100 border-r">
        <div className="p-4">
          <h1 className="text-xl font-bold text-blue-600">MANIS_A.I.</h1>
          <p className="text-sm text-gray-600">Customer Portal</p>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <a href="/customer/dashboard" className="block px-4 py-2 hover:bg-gray-200">Dashboard</a>
            </li>
            <li>
              <a href="/customer/documents" className="block px-4 py-2 hover:bg-gray-200">Documents</a>
            </li>
            <li>
              <a href="/customer/forms" className="block px-4 py-2 hover:bg-gray-200">Forms</a>
            </li>
            <li>
              <a href="/customer/schedule" className="block px-4 py-2 hover:bg-gray-200">Schedule Call</a>
            </li>
            <li>
              <a href="/customer/progress" className="block px-4 py-2 hover:bg-gray-200">Progress</a>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}
