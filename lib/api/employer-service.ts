// lib/api/employer-service.ts
import { CustomQuestion } from '../types/application-questions';
import apiClient from './client';

// Add this file to your project: lib/api/employer-service.ts

export interface EmployerProfile {
  id: number;
  user_id: number;
  company_name: string;
  company_website: string | null;
  company_description: string | null;
}

export interface EmployerProfileWithStats extends EmployerProfile {
  total_jobs: number;
  active_jobs: number;
  total_applications: number;
}

export interface CreateEmployerProfileData {
  company_name: string;
  company_website?: string;
  company_description?: string;
}

export interface UpdateEmployerProfileData {
  company_name?: string;
  company_website?: string;
  company_description?: string;
}

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
}

export interface CreateJobData {
  title: string;
  description: string;
  location?: string;
  salary?: number;
  job_type?: string;
  requirements?: string;
  is_active?: boolean;
  custom_questions?: CustomQuestion[];
}

export interface UpdateJobData {
  title?: string;
  description?: string;
  location?: string;
  salary?: number;
  job_type?: string;
  requirements?: string;
  is_active?: boolean;
}

export interface JobApplicant {
  application_id: number;
  applied_at: string;
  cover_letter: string | null;
  status: string;
  applicant: {
    user_id: number;
    email: string;
    full_name?: string;
    bio?: string;
    resume_url?: string;
    skills?: string;
    experience?: string;
    education?: string;
    profile_picture_url?: string;
  };
}

export interface JobApplicantsResponse {
  job_id: number;
  total_applicants: number;
  applicants: JobApplicant[];
}

class EmployerService {
  // Profile Management
  async getProfile(): Promise<EmployerProfile> {
    try {
      const response = await apiClient.get<EmployerProfile>('/employer/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching employer profile:', error);
      throw error;
    }
  }

  async getProfileById(userId: number): Promise<EmployerProfile> {
    try {
      const response = await apiClient.get<EmployerProfile>(`/employer/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employer profile by ID:', error);
      throw error;
    }
  }

  async getProfileWithStats(): Promise<EmployerProfileWithStats> {
    try {
      const response = await apiClient.get<EmployerProfileWithStats>(
        '/employer/profile/stats'
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching employer profile with stats:', error);
      throw error;
    }
  }

  async createProfile(data: CreateEmployerProfileData): Promise<EmployerProfile> {
    try {
      const response = await apiClient.post<EmployerProfile>('/employer/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error creating employer profile:', error);
      throw error;
    }
  }

  async updateProfile(data: UpdateEmployerProfileData): Promise<EmployerProfile> {
    try {
      const response = await apiClient.put<EmployerProfile>('/employer/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error updating employer profile:', error);
      throw error;
    }
  }

  async getDashboardStats(): Promise<{
    total_jobs: number;
    active_jobs: number;
    total_applications: number;
    pending_applications?: number;
  }> {
    try {
      const response = await apiClient.get('/employer/dashboard/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Job Management
  async getMyJobs(params?: {
    active_only?: boolean;
    skip?: number;
    limit?: number;
  }): Promise<Job[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.active_only !== undefined)
        queryParams.append('active_only', params.active_only.toString());
      if (params?.skip !== undefined)
        queryParams.append('skip', params.skip.toString());
      if (params?.limit !== undefined)
        queryParams.append('limit', params.limit.toString());

      const response = await apiClient.get<Job[]>(
        `/employer/jobs?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching employer jobs:', error);
      throw error;
    }
  }

  async createJob(data: CreateJobData): Promise<Job> {
    try {
      const response = await apiClient.post<Job>('/jobs', data);
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  async updateJob(jobId: number, data: UpdateJobData): Promise<Job> {
    try {
      const response = await apiClient.put<Job>(`/jobs/${jobId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  async deleteJob(jobId: number): Promise<void> {
    try {
      await apiClient.delete(`/jobs/${jobId}`);
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  // Applicants Management
  async getJobApplicants(
    jobId: number,
    params?: { skip?: number; limit?: number }
  ): Promise<JobApplicantsResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.skip !== undefined)
        queryParams.append('skip', params.skip.toString());
      if (params?.limit !== undefined)
        queryParams.append('limit', params.limit.toString());

      const response = await apiClient.get<JobApplicantsResponse>(
        `/employer/jobs/${jobId}/applicants?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching job applicants:', error);
      throw error;
    }
  }

  async updateApplicationStatus(
    applicationId: number,
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  ): Promise<{ message: string; application_id: number; new_status: string }> {
    try {
      const response = await apiClient.put(
        `/employer/applications/${applicationId}/status?status=${status}`
      );
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }
}

export const employerService = new EmployerService();