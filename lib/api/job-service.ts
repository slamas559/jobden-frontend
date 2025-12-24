// lib/api/job-service.ts
import { CustomQuestion } from '../types/application-questions';
import apiClient from './client';
import { AxiosError } from 'axios';

export interface Job {
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
  custom_questions?: CustomQuestion[];
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  pages: number;
}

export interface JobFilters {
  location?: string;
  job_type?: string;
  min_salary?: number;
  search?: string;
  skip?: number;
  limit?: number;
}

class JobService {
  async getJobs(filters?: JobFilters): Promise<Job[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.location) params.append('location', filters.location);
      if (filters?.job_type) params.append('job_type', filters.job_type);
      if (filters?.min_salary) params.append('min_salary', filters.min_salary.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
      if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());

      const response = await apiClient.get<Job[]>(`/jobs?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  async getJobById(id: number): Promise<Job> {
    try {
      const response = await apiClient.get<Job>(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job:', error);
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

  async bookmarkJob(jobId: number): Promise<void> {
    try {
      await apiClient.post('/bookmarks', { job_id: jobId });
    } catch (error) {
      console.error('Error bookmarking job:', error);
      throw error;
    }
  }

  async removeBookmark(jobId: number): Promise<void> {
    try {
      await apiClient.delete(`/bookmarks/${jobId}`);
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }

  // get job already applied
  async checkApplyStatus(jobId: number): Promise<boolean> {
    try {
      const response = await apiClient.get(`/applications/check/${jobId}`);
      return response.data.is_applied;
    } catch (error) {
      return false;
    }
  }
}

export const jobService = new JobService();