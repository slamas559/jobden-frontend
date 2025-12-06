// hooks/use-auth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/auth-store';
import { authService, RegisterData, LoginData } from '@/lib/api/auth-service';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setAuth, clearAuth, setLoading } = useAuthStore();

  // Get current user query
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    enabled: isAuthenticated && !!useAuthStore.getState().accessToken,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: () => {
      toast.success('Account created successfully! Please log in.');
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Registration failed. Please try again.');
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: async (response) => {
      try {
        // Get user data after successful login
        const tempUser = {
          id: 0,
          email: '',
          is_employer: false,
          is_active: true,
        };
        
        // Set tokens first
        setAuth(tempUser, response.access_token, response.refresh_token);
        
        const userData = await authService.getCurrentUser();
        
        // Set auth in store
        setAuth(userData, response.access_token, response.refresh_token);
        
        // Invalidate and refetch user query
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        
        toast.success('Welcome back!');
        
        // Redirect based on user type
        if (userData.is_employer) {
          router.push('/employer/dashboard');
        } else {
          router.push('/job-seeker/jobs');
        }
      } catch (error: any) {
        toast.error('Failed to fetch user data');
        clearAuth();
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    },
  });

  // Logout function
  const logout = () => {
    clearAuth();
    queryClient.clear();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return {
    user: currentUser || user,
    isAuthenticated,
    isLoading: isLoading || registerMutation.isPending || loginMutation.isPending,
    register: registerMutation.mutate,
    login: loginMutation.mutate,
    logout,
    registerError: registerMutation.error,
    loginError: loginMutation.error,
  };
};

// Hook to check if user is employer
export const useIsEmployer = () => {
  const { user } = useAuthStore();
  return user?.is_employer || false;
};

// Hook to require authentication
export const useRequireAuth = (redirectTo = '/login') => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  if (!isLoading && !isAuthenticated) {
    router.push(redirectTo);
  }

  return { isAuthenticated, isLoading };
};