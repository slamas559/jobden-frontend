// lib/api/notification-service.ts
import apiClient from './client';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationCreate {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface NotificationFilters {
  skip?: number;
  limit?: number;
  unread_only?: boolean;
}

export interface UnreadCount {
  unread_count: number;
}

class NotificationService {
  async getNotifications(filters?: NotificationFilters): Promise<Notification[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.skip) params.append('skip', filters.skip.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.unread_only) params.append('unread_only', 'true');

      const response = await apiClient.get<Notification[]>(
        `/notifications/?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async getUnreadCount(): Promise<UnreadCount> {
    try {
      const response = await apiClient.get<UnreadCount>('/notifications/unread-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: number): Promise<Notification> {
    try {
      const response = await apiClient.put<Notification>(
        `/notifications/${notificationId}/read`
      );
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<{ message: string; count: number }> {
    try {
      const response = await apiClient.put<{ message: string; count: number }>(
        '/notifications/mark-all-read'
      );
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: number): Promise<void> {
    try {
      await apiClient.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  async createNotification(data: NotificationCreate): Promise<Notification> {
    try {
      const response = await apiClient.post<Notification>('/notifications/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();