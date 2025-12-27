// lib/hooks/use-employer.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  employerService,
  CreateEmployerProfileData,
  UpdateEmployerProfileData,
  CreateJobData,
  UpdateJobData,
} from '@/lib/api/employer-service';
import { id } from 'date-fns/locale';

// Profile Hooks
export const useEmployerProfile = () => {
  return useQuery({
    queryKey: ['employer-profile'],
    queryFn: () => employerService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// employer profile by id
export const useEmployerProfileById = (userId: number) => {
  return useQuery({
    queryKey: ['employer-profile', userId],
    queryFn: () => employerService.getProfileById(userId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useEmployerProfileWithStats = () => {
  return useQuery({
    queryKey: ['employer-profile', 'with-stats'],
    queryFn: () => employerService.getProfileWithStats(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateEmployerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployerProfileData) =>
      employerService.createProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-profile'] });
      toast.success('Company profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create profile');
    },
  });
};

export const useUpdateEmployerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEmployerProfileData) =>
      employerService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-profile'] });
      toast.success('Company profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

export const useEmployerDashboard = () => {
  return useQuery({
    queryKey: ['employer-dashboard'],
    queryFn: () => employerService.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Job Management Hooks
export const useEmployerJobs = (params?: {
  active_only?: boolean;
  skip?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['employer-jobs', params],
    queryFn: () => employerService.getMyJobs(params),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobData) => employerService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employer-dashboard'] });
      toast.success('Job posted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to post job');
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: number; data: UpdateJobData }) =>
      employerService.updateJob(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job'] });
      toast.success('Job updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update job');
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: number) => employerService.deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employer-dashboard'] });
      toast.success('Job deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete job');
    },
  });
};

// Applicants Management Hooks
export const useJobApplicants = (
  jobId: number,
  params?: { skip?: number; limit?: number }
) => {
  return useQuery({
    queryKey: ['job-applicants', jobId, params],
    queryFn: () => employerService.getJobApplicants(jobId, params),
    enabled: !!jobId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: number;
      status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    }) => employerService.updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-applicants'] });
      queryClient.invalidateQueries({ queryKey: ['employer-dashboard'] });
      toast.success('Application status updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update status');
    },
  });
};