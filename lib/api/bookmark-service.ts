// lib/api/bookmark-service.ts
import apiClient from './client';

export interface Bookmark {
  id: number;
  user_id: number;
  job_id: number;
  created_at: string;
  job: {
    id: number;
    title: string;
    description: string;
    location: string | null;
    salary: number | null;
    job_type: string | null;
    requirements: string | null;
    is_active: boolean;
    created_at: string;
    employer_id: number;
  };
}

class BookmarkService {
  async getMyBookmarks(skip = 0, limit = 100): Promise<Bookmark[]> {
    try {
      const params = new URLSearchParams();
      params.append('skip', skip.toString());
      params.append('limit', limit.toString());

      const response = await apiClient.get<Bookmark[]>(`/bookmarks?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    }
  }

  async createBookmark(jobId: number): Promise<Bookmark> {
    try {
      const response = await apiClient.post<Bookmark>('/bookmarks', { job_id: jobId });
      return response.data;
    } catch (error) {
      console.error('Error creating bookmark:', error);
      throw error;
    }
  }

  async deleteBookmark(jobId: number): Promise<void> {
    try {
      await apiClient.delete(`/bookmarks/${jobId}`);
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      throw error;
    }
  }

  async checkBookmarkStatus(jobId: number): Promise<boolean> {
    try {
      const response = await apiClient.get(`/bookmarks/check/${jobId}`);
      return response.data.is_bookmarked;
    } catch (error) {
      return false;
    }
  }
}

export const bookmarkService = new BookmarkService();