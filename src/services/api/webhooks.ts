import { fetchApi } from './client';

export interface WebhookPayload {
  url: string;
  events: string[];
}

export const webhooksService = {
  /**
   * List all webhooks
   */
  listWebhooks: () => {
    return fetchApi<any>('/webhooks');
  },

  /**
   * Create a new webhook
   */
  createWebhook: (payload: WebhookPayload) => {
    return fetchApi<any>('/webhooks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
