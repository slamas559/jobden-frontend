// lib/api/application-service.ts
import { QuestionAnswer } from '../types/application-questions';
import apiClient from './client';
import { AxiosError } from 'axios';

export interface Application {
  id: number;
  user_id: number;
  job_id: number;
  cover_letter: string | null;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'withdrawn';
  applied_at: string;
  updated_at: string;
  job: {
    id: number;
    title: string;
    description: string;
    location: string | null;
    salary: number | null;
    job_type: string | null;
    company_name?: string;
  };
  documents: ApplicationDocument[];
}

export interface ApplicationDocument {
  id: number;
  application_id: number;
  document_type: string;
  document_url: string;
  file_name: string;
  uploaded_at: string;
}

export interface CreateApplicationData {
  job_id: number;
  cover_letter?: string;
  question_answers?: QuestionAnswer[]
}

export interface UpdateApplicationData {
  cover_letter?: string;
}

class ApplicationService {
  async getMyApplications(status?: string, skip = 0, limit = 100): Promise<Application[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('skip', skip.toString());
      params.append('limit', limit.toString());

      const response = await apiClient.get<Application[]>(`/applications?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  async getApplicationById(id: number): Promise<Application> {
    try {
      const response = await apiClient.get<Application>(`/applications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  }

  async createApplication(data: CreateApplicationData): Promise<Application> {
    try {
      const response = await apiClient.post<Application>('/applications', data);
      return response.data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  async updateApplication(id: number, data: UpdateApplicationData): Promise<Application> {
    try {
      const response = await apiClient.put<Application>(`/applications/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  }

  async withdrawApplication(id: number): Promise<Application> {
    try {
      const response = await apiClient.post<Application>(`/applications/${id}/withdraw`);
      return response.data;
    } catch (error) {
      console.error('Error withdrawing application:', error);
      throw error;
    }
  }

  async deleteApplication(id: number): Promise<void> {
    try {
      await apiClient.delete(`/applications/${id}`);
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }

  async uploadDocument(
    applicationId: number,
    documentType: string,
    file: File
  ): Promise<ApplicationDocument> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documentType);

      const response = await apiClient.post<ApplicationDocument>(
        `/applications/${applicationId}/documents?document_type=${documentType}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async getApplicationDocuments(applicationId: number): Promise<ApplicationDocument[]> {
    try {
      const response = await apiClient.get<ApplicationDocument[]>(
        `/applications/${applicationId}/documents`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  async deleteDocument(applicationId: number, documentId: number): Promise<void> {
    try {
      await apiClient.delete(`/applications/${applicationId}/documents/${documentId}`);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}

export const applicationService = new ApplicationService();