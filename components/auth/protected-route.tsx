// components/auth/protected-route.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmployer?: boolean;
  requireJobSeeker?: boolean;
}

export function ProtectedRoute({
  children,
  requireEmployer = false,
  requireJobSeeker = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Check employer requirement
      if (requireEmployer && !user?.is_employer) {
        router.push('/dashboard');
        return;
      }

      // Check job seeker requirement
      if (requireJobSeeker && user?.is_employer) {
        router.push('/employer/dashboard');
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, requireEmployer, requireJobSeeker, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user meets requirements
  if (!isAuthenticated) {
    return null;
  }

  if (requireEmployer && !user?.is_employer) {
    return null;
  }

  if (requireJobSeeker && user?.is_employer) {
    return null;
  }

  return <>{children}</>;
}