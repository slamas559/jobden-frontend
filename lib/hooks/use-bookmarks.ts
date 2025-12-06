// hooks/use-bookmarks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookmarkService } from '@/lib/api/bookmark-service';

export const useBookmarks = () => {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => bookmarkService.getMyBookmarks(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: number) => bookmarkService.createBookmark(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['bookmark-status'] });
      toast.success('Job bookmarked successfully');
    },
    onError: () => {
      toast.error('Failed to bookmark job');
    },
  });
};

export const useDeleteBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: number) => bookmarkService.deleteBookmark(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['bookmark-status'] });
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
    queryFn: () => bookmarkService.checkBookmarkStatus(jobId),
    enabled: !!jobId,
  });
};