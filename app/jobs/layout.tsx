// app/jobs/layout.tsx
// Public layout for browsing jobs without an account. No ProtectedRoute here
// on purpose — anyone should be able to explore listings. Actions that
// actually require an account (apply, bookmark) are gated at the component
// level and redirect to /login.
'use client';

import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';

export default function PublicJobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuth();
  const dashboardHref = user?.is_employer ? '/employer/dashboard' : '/job-seeker/jobs';

  return (
    <div className="min-h-screen bg-slate-50/50">
      <nav className="border-b bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">JobDen</span>
          </Link>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <Link href={dashboardHref}>
                <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="font-medium">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
