import { fetchApi } from './client';

export const usersService = {
  /**
   * Get current authenticated user information
   */
  me: () => {
    return fetchApi<any>('/users/me');
  },
};
