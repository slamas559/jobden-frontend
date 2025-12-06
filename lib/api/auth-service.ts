// lib/api/auth-service.ts
import apiClient from './client';
import { AxiosError } from 'axios';

export interface RegisterData {
  email: string;
  password: string;
  is_employer: boolean;
}

export interface LoginData {
  username: string; // Backend uses 'username' field for email
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  email: string;
  is_active: boolean;
  is_employer: boolean;
}

export interface ApiError {
  message: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

class AuthService {
  async register(data: RegisterData): Promise<UserResponse> {
    try {
      const response = await apiClient.post<UserResponse>('/auth/register', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      // Send as form data (OAuth2PasswordRequestForm)
      const formData = new URLSearchParams();
      formData.append('username', data.username);
      formData.append('password', data.password);

      const response = await apiClient.post<AuthResponse>('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<UserResponse> {
    try {
      const response = await apiClient.get<UserResponse>('/users/me');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/auth/refresh',
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): ApiError {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.detail || 
                     error.response?.data?.message || 
                     error.message || 
                     'An unexpected error occurred';
      
      return {
        message,
        detail: error.response?.data?.detail,
        errors: error.response?.data?.errors,
      };
    }
    
    return {
      message: 'An unexpected error occurred',
    };
  }
}

export const authService = new AuthService();