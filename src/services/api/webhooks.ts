import { fetchApi } from './client';

export interface WebhookPayload {
  url: string;
  events: string[];
}

export const webhooksService = {
  /**
   * List all webhooks
   */
  listWebhooks: async (): Promise<any> => {
    // return fetchApi<any>('/webhooks');
    return Promise.resolve({ data: [{ id: '1', url: 'https://mysite.com/webhook', events: ['charge.paid'] }] });
  },

  /**
   * Create a new webhook
   */
  createWebhook: async (payload: WebhookPayload): Promise<any> => {
    // return fetchApi<any>('/webhooks', {
    //   method: 'POST',
    //   body: JSON.stringify(payload),
    // });
    return Promise.resolve({ id: '2', ...payload });
  },
};
