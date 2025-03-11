'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/providers/auth-provider';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isStaff, loading } = useAuthContext();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect if not authenticated or not a staff member
    if (!loading && (!isAuthenticated || !isStaff)) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, isStaff, loading, router]);
  
  // Show loading state or nothing while checking authentication
  if (loading || !isAuthenticated || !isStaff) {
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
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">MANIS_A.I.</h1>
          <p className="text-sm text-gray-400">Staff Dashboard</p>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <a href="/staff/projects" className="block px-4 py-2 hover:bg-gray-700">Projects</a>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 bg-gray-100">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Staff Dashboard</h2>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
