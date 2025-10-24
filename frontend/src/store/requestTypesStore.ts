import { create } from 'zustand';
import type { RequestType } from '../types';
import { requestTypesApi } from '../lib/api';

interface RequestTypesState {
  requestTypes: RequestType[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  sortBy: 'newest' | 'oldest' | 'name-asc' | 'name-desc';
  
  // Actions
  fetchRequestTypes: () => Promise<void>;
  addRequestType: (requestType: RequestType) => void;
  updateRequestType: (requestType: RequestType) => void;
  deleteRequestType: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: 'newest' | 'oldest' | 'name-asc' | 'name-desc') => void;
  
  // Computed
  getFilteredRequestTypes: () => RequestType[];
}

export const useRequestTypesStore = create<RequestTypesState>((set, get) => ({
  requestTypes: [],
  loading: false,
  error: null,
  searchQuery: '',
  sortBy: 'newest',

  fetchRequestTypes: async () => {
    set({ loading: true, error: null });
    try {
      const data = await requestTypesApi.getAll();
      set({ requestTypes: data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch request types', loading: false });
    }
  },

  addRequestType: (requestType: RequestType) => {
    set((state) => ({
      requestTypes: [requestType, ...state.requestTypes],
    }));
  },

  updateRequestType: (requestType: RequestType) => {
    set((state) => ({
      requestTypes: state.requestTypes.map((rt) =>
        rt.id === requestType.id ? requestType : rt
      ),
    }));
  },

  deleteRequestType: async (id: string) => {
    try {
      await requestTypesApi.delete(id);
      set((state) => ({
        requestTypes: state.requestTypes.filter((rt) => rt.id !== id),
      }));
    } catch (error) {
      set({ error: 'Failed to delete request type' });
      throw error;
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setSortBy: (sortBy) => {
    set({ sortBy });
  },

  getFilteredRequestTypes: () => {
    const { requestTypes, searchQuery, sortBy } = get();
    
    // Filter by search query
    let filtered = requestTypes.filter((rt) => {
      const query = searchQuery.toLowerCase();
      return (
        rt.requestType.toLowerCase().includes(query) ||
        rt.owner.toLowerCase().includes(query) ||
        rt.purpose.toLowerCase().includes(query)
      );
    });

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name-asc':
          return a.requestType.localeCompare(b.requestType);
        case 'name-desc':
          return b.requestType.localeCompare(a.requestType);
        default:
          return 0;
      }
    });

    return filtered;
  },
}));

