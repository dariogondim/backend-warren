export const BANK_TRANSACTIONS = {
  status: {
    Approved: 'approved',
    Pendent: 'pendent',
    Canceled: 'canceled',
    Rejected: 'rejected',
  },
  originTransaction: {
    Ted: 'ted',
    Doc: 'doc',
    Pix: 'pix',
  },
  channel: {
    InternetBanking: 'internet_banking',
    CashMachine: 'cash_machine',
    AppBank: 'app_bank',
    AgencyDirect: 'agency_direct',
  },
  typeTransaction: {
    Deposit: 'deposit',
    Withdraw: 'withdraw',
    Payment: 'payment',
    Profitability: 'profitability',
  },
};

export const BANK_TRANSACTIONS2 = {
  status: [
    BANK_TRANSACTIONS.status.Approved,
    BANK_TRANSACTIONS.status.Canceled,
    BANK_TRANSACTIONS.status.Pendent,
    BANK_TRANSACTIONS.status.Rejected,
  ],
  originTransaction: [
    BANK_TRANSACTIONS.originTransaction.Doc,
    BANK_TRANSACTIONS.originTransaction.Pix,
    BANK_TRANSACTIONS.originTransaction.Ted,
  ],
  channel: [
    BANK_TRANSACTIONS.channel.AgencyDirect,
    BANK_TRANSACTIONS.channel.AppBank,
    BANK_TRANSACTIONS.channel.CashMachine,
    BANK_TRANSACTIONS.channel.InternetBanking,
  ],
  typeTransaction: [
    BANK_TRANSACTIONS.typeTransaction.Deposit,
    BANK_TRANSACTIONS.typeTransaction.Payment,
    BANK_TRANSACTIONS.typeTransaction.Profitability,
    BANK_TRANSACTIONS.typeTransaction.Withdraw,
  ],
};
