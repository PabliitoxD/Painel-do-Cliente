export * from './client';
export * from './auth';
export * from './transactions';
export * from './backoffice';
export * from './users';
export * from './withdrawals';
export * from './bankAccounts';
export * from './webhooks';
export * from './reports';
export * from './receivableSchedules';
export * from './charges';

import { authService } from './auth';
import { transactionsService } from './transactions';
import { backofficeService } from './backoffice';
import { usersService } from './users';
import { withdrawalsService } from './withdrawals';
import { bankAccountsService } from './bankAccounts';
import { webhooksService } from './webhooks';
import { reportsService } from './reports';
import { receivableSchedulesService } from './receivableSchedules';
import { chargesService, plansService, subscriptionsService, invoicesService } from './charges';

export const api = {
  auth: authService,
  transactions: transactionsService,
  backoffice: backofficeService,
  users: usersService,
  withdrawals: withdrawalsService,
  bankAccounts: bankAccountsService,
  webhooks: webhooksService,
  reports: reportsService,
  receivableSchedules: receivableSchedulesService,
  charges: chargesService,
  plans: plansService,
  subscriptions: subscriptionsService,
  invoices: invoicesService,
};

export default api;
