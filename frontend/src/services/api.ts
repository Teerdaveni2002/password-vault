import { axiosInstance } from '../utils/axiosConfig';
import { AxiosResponse } from 'axios';

export const api = {
  // Generic GET request
  get: async <T>(url: string, params?: Record<string, any>): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.get(url, { params });
    return response.data;
  },

  // Generic POST request
  post: async <T>(url: string, data?: any): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.post(url, data);
    return response.data;
  },

  // Generic PUT request
  put: async <T>(url: string, data?: any): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.put(url, data);
    return response.data;
  },

  // Generic PATCH request
  patch: async <T>(url: string, data?: any): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.patch(url, data);
    return response.data;
  },

  // Generic DELETE request
  delete: async <T>(url: string): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.delete(url);
    return response.data;
  },
};

export default api;
