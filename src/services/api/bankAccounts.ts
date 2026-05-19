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
  listBankAccounts: async (): Promise<any> => {
    // return fetchApi<any>('/bank_accounts');
    return Promise.resolve({
      data: [
        { id: '1', bank_code: '341', agency: '1234', account_number: '12345-6', type: 'CHECKING' }
      ]
    });
  },

  /**
   * Create a new bank account
   */
  createBankAccount: async (payload: BankAccountPayload): Promise<any> => {
    // return fetchApi<any>('/bank_accounts', {
    //   method: 'POST',
    //   body: JSON.stringify(payload),
    // });
    return Promise.resolve({ id: '2', ...payload });
  },
};
