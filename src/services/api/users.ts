import { fetchApi } from './client';

export const usersService = {
  /**
   * Get current authenticated user information
   */
  me: async () => {
    // return fetchApi<any>('/users/me');
    return Promise.resolve({ id: 'user_1', name: 'Mock Admin', email: 'admin@mock.com', role: 'admin' });
  },
};
