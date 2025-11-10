import { api } from './api';
import {
  Password,
  PasswordInput,
  PasswordRequest,
  PasswordRequestInput,
  PasswordRequestApproval,
  PaginatedResponse,
} from '../types';

export const passwordService = {
  // Password CRUD operations
  getPasswords: async (
    page = 1,
    search?: string
  ): Promise<PaginatedResponse<Password>> => {
    const params: Record<string, any> = { page };
    if (search) params.search = search;
    return await api.get<PaginatedResponse<Password>>('/passwords/', params);
  },

  getPasswordById: async (id: string): Promise<Password> => {
    return await api.get<Password>(`/passwords/${id}/`);
  },

  createPassword: async (data: PasswordInput): Promise<Password> => {
    return await api.post<Password>('/passwords/', data);
  },

  updatePassword: async (id: string, data: Partial<PasswordInput>): Promise<Password> => {
    return await api.patch<Password>(`/passwords/${id}/`, data);
  },

  deletePassword: async (id: string): Promise<void> => {
    return await api.delete<void>(`/passwords/${id}/`);
  },

  // Password Request operations
  requestPassword: async (data: PasswordRequestInput): Promise<PasswordRequest> => {
    return await api.post<PasswordRequest>('/password-requests/', data);
  },

  getPasswordRequests: async (
    status?: string
  ): Promise<PaginatedResponse<PasswordRequest>> => {
    const params: Record<string, any> = {};
    if (status) params.status = status;
    return await api.get<PaginatedResponse<PasswordRequest>>(
      '/password-requests/',
      params
    );
  },

  getPasswordRequestById: async (id: string): Promise<PasswordRequest> => {
    return await api.get<PasswordRequest>(`/password-requests/${id}/`);
  },

  approvePasswordRequest: async (
    data: PasswordRequestApproval
  ): Promise<PasswordRequest> => {
    return await api.post<PasswordRequest>(
      `/password-requests/${data.requestId}/approve/`,
      data
    );
  },

  rejectPasswordRequest: async (
    requestId: string,
    adminNotes?: string
  ): Promise<PasswordRequest> => {
    return await api.post<PasswordRequest>(
      `/password-requests/${requestId}/reject/`,
      { adminNotes }
    );
  },

  // View decrypted password (after approval)
  viewPassword: async (passwordId: string): Promise<{ password: string }> => {
    return await api.get<{ password: string }>(`/passwords/${passwordId}/view/`);
  },

  // Share password
  sharePassword: async (
    passwordId: string,
    userIds: string[]
  ): Promise<Password> => {
    return await api.post<Password>(`/passwords/${passwordId}/share/`, {
      userIds,
    });
  },

  // Get shared passwords
  getSharedPasswords: async (): Promise<PaginatedResponse<Password>> => {
    return await api.get<PaginatedResponse<Password>>('/passwords/shared/');
  },
};

export default passwordService;
