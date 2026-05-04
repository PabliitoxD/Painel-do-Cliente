import { fetchApi } from './client';

export interface BankAccountPayload {
  bank_code: string;
  agency: string;
  account_number: string;
  type: string;
  // add other fields
  [key: string]: any;
}

export const bankAccountsService = {
  /**
   * List user bank accounts
   */
  listBankAccounts: () => {
    return fetchApi<any>('/bank_accounts');
  },

  /**
   * Create a new bank account
   */
  createBankAccount: (payload: BankAccountPayload) => {
    return fetchApi<any>('/bank_accounts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
