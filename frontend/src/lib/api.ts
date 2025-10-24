import axios from 'axios';
import type { RequestType, CreateRequestTypeInput, UpdateRequestTypeInput } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const requestTypesApi = {
  // Get all request types
  getAll: async (): Promise<RequestType[]> => {
    const response = await api.get<{ data: RequestType[] }>('/request-types');
    return response.data.data;
  },

  // Get single request type by ID
  getById: async (id: string): Promise<RequestType> => {
    const response = await api.get<{ data: RequestType }>(`/request-types/${id}`);
    return response.data.data;
  },

  // Create new request type
  create: async (data: CreateRequestTypeInput): Promise<RequestType> => {
    const response = await api.post<{ data: RequestType }>('/request-types', data);
    return response.data.data;
  },

  // Update request type
  update: async (id: string, data: UpdateRequestTypeInput): Promise<RequestType> => {
    const response = await api.put<{ data: RequestType }>(`/request-types/${id}`, data);
    return response.data.data;
  },

  // Delete request type
  delete: async (id: string): Promise<void> => {
    await api.delete(`/request-types/${id}`);
  },
};

export default api;

