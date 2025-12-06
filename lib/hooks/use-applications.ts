// hooks/use-applications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { applicationService, CreateApplicationData, UpdateApplicationData } from '@/lib/api/application-service';

export const useApplications = (status?: string) => {
  return useQuery({
    queryKey: ['applications', status],
    queryFn: () => applicationService.getMyApplications(status),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useApplication = (id: number) => {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationService.getApplicationById(id),
    enabled: !!id,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApplicationData) => applicationService.createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit application');
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateApplicationData }) =>
      applicationService.updateApplication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application updated successfully');
    },
    onError: () => {
      toast.error('Failed to update application');
    },
  });
};

export const useWithdrawApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => applicationService.withdrawApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application withdrawn');
    },
    onError: () => {
      toast.error('Failed to withdraw application');
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => applicationService.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application deleted');
    },
    onError: () => {
      toast.error('Failed to delete application');
    },
  });
};