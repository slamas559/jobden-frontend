// lib/api/profile-service.ts
import apiClient from './client';

export interface JobSeekerProfile {
  id: number;
  user_id: number;
  full_name: string;
  bio: string | null;
  resume_url: string | null;
  education: string | null;
  experience: string | null;
  skills: string | null;
  profile_picture_url: string | null;
}

export interface ProfileStats {
  total_applications: number;
  total_bookmarks: number;
}

export interface UpdateProfileData {
  full_name?: string;
  bio?: string;
  education?: string;
  experience?: string;
  skills?: string;
}

class ProfileService {
  async getProfile(): Promise<JobSeekerProfile> {
    try {
      const response = await apiClient.get<JobSeekerProfile>('/job-seeker/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  async getProfileWithStats(): Promise<JobSeekerProfile & ProfileStats> {
    try {
      const response = await apiClient.get<JobSeekerProfile & ProfileStats>(
        '/job-seeker/profile/stats'
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching profile with stats:', error);
      throw error;
    }
  }

  async createProfile(data: UpdateProfileData): Promise<JobSeekerProfile> {
    try {
      const response = await apiClient.post<JobSeekerProfile>('/job-seeker/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  async updateProfile(data: UpdateProfileData): Promise<JobSeekerProfile> {
    try {
      const response = await apiClient.put<JobSeekerProfile>('/job-seeker/profile', data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async uploadResume(file: File): Promise<{ message: string; resume_url: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<{ message: string; resume_url: string }>(
        '/job-seeker/profile/upload-resume',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  }

  async uploadProfilePicture(file: File): Promise<{ message: string; profile_picture_url: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<{ message: string; profile_picture_url: string }>(
        '/job-seeker/profile/upload-picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();