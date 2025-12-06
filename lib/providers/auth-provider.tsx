// lib/providers/auth-provider.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { authService } from '@/lib/api/auth-service';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, accessToken, setUser, clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated && accessToken) {
        try {
          // Verify token and get current user
          const user = await authService.getCurrentUser();
          setUser(user);
        } catch (error) {
          // Token is invalid, clear auth
          clearAuth();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, [isAuthenticated, accessToken, setUser, clearAuth, setLoading]);

  return <>{children}</>;
}