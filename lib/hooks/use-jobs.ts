// hooks/use-jobs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { jobService, JobFilters } from '@/lib/api/job-service';

export const useJobs = (filters?: JobFilters) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobService.getJobs(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useJob = (id: number) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJobById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBookmarkJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: number) => jobService.bookmarkJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Job bookmarked successfully');
    },
    onError: () => {
      toast.error('Failed to bookmark job');
    },
  });
};

export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: number) => jobService.removeBookmark(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Bookmark removed');
    },
    onError: () => {
      toast.error('Failed to remove bookmark');
    },
  });
};

export const useCheckBookmark = (jobId: number) => {
  return useQuery({
    queryKey: ['bookmark-status', jobId],
    queryFn: () => jobService.checkBookmarkStatus(jobId),
    enabled: !!jobId,
  });
};

export const useCheckApply = (jobId: number) => {
  return useQuery({
    queryKey: ['apply-status', jobId],
    queryFn: () => jobService.checkApplyStatus(jobId),
    enabled: !!jobId,
  });
};