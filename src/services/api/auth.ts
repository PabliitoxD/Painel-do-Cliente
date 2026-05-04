import { fetchApi } from './client';

export interface LoginOneIdPayload {
  token: string;
  company_token: string;
  account_token?: number;
}

export interface AuthResponse {
  access_token: string;
  user: any; // Type to be refined
}

export const authService = {
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
