import { fetchApi } from './client';
import { isMockSession } from './mockData';

export const usersService = {
  /**
   * Get current authenticated user information
   */
  me: async () => {
    try {
      return await fetchApi<any>('/users/me');
    } catch (error) {
      if (isMockSession()) {
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('tronnus_user') : null;
        return { user: storedUser ? JSON.parse(storedUser) : null };
      }
      throw error;
    }
  },
};


