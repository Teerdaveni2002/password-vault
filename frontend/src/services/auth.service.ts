import { api } from './api';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from '../types';
import { tokenManager } from '../utils/tokenManager';

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login/', credentials);
    if (response.access && response.refresh) {
      tokenManager.setTokens(response.access, response.refresh);
    }
    return response;
  },

  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register/', data);
    if (response.access && response.refresh) {
      tokenManager.setTokens(response.access, response.refresh);
    }
    return response;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
    }
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    return await api.get<User>('/auth/me/');
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    return await api.post<{ access: string }>('/auth/refresh/', {
      refresh: refreshToken,
    });
  },

  // Verify token
  verifyToken: async (token: string): Promise<boolean> => {
    try {
      await api.post('/auth/verify/', { token });
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default authService;
