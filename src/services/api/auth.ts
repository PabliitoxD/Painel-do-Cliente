import { fetchApi } from './client';

export interface LoginOneIdPayload {
  token: string;
  company_token: string;
}

export interface AuthResponse {
  access_token?: string;
  authToken?: string;
  user?: any;
  [key: string]: any;
}

export interface LoginEmailPayload {
  email: string;
  password?: string;
}

export const authService = {
  /**
   * Login using standard Email and Password
   */
  loginEmail: async (payload: LoginEmailPayload) => {
    // Assuming standard /login or /authentication endpoint for email/password
    // Adapt path if necessary when the backend is finalized
    // return fetchApi<AuthResponse>('/authentication', {
    //   method: 'POST',
    //   body: JSON.stringify(payload),
    // });
    return Promise.resolve({
      access_token: 'mock_access_token_123',
      authToken: 'mock_access_token_123',
      user: { id: 'mock_id', name: 'Mock User', email: payload.email },
    });
  },

  /**
   * Login using OneID authentication
   */
  loginOneId: (payload: LoginOneIdPayload) => {
    return fetchApi<AuthResponse>('/authentication', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
