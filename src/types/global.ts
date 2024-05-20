/* eslint-disable camelcase */
export type Errors = {
    [key in string]: {
        status: number;
        message: string;
    }
}

declare global {
    namespace Express {
      interface Request {
        user?: {
          email: string;
          iat: number;
          exp: number;
          id: string;
          domain: string;
        };
      }
    }
}

export const TransactionTypeMapping = {
    Deposit: 'deposit',
    Withdrawal: 'withdrawal',
};

export const TransactionSubtypeMapping = {
    Initiate: 'initiate',
    Prove: 'prove',
    Finalize: 'finalize',
};

export const TransactionStatusMapping = {
    Pending: 'pending',
    Completed: 'completed',
    Failed: 'failed',
};


export type WithdrawalSubtype = 'initiate' | 'prove' | 'finalize';
export type TransactionStatus = 'pending' | 'completed' | 'failed';


export type Deposit = {
  id: string;
  account: string;
  type: 'deposit';
  amount: string;
  currencySymbol: string;
  createdAt: Date;
};


export type DepositQuery = {
  id: string;
  account: string;
  type: 'deposit';
  amount: string;
  currency_symbol: string;
  created_at: Date;
};


export type Withdrawal = {
  id: string;
  account: string;
  type: 'withdrawal';
  amount: string;
  currencySymbol: string;
  createdAt: Date;
};


export type WithdrawalQuery = {
  id: string;
  account: string;
  type: 'withdrawal';
  amount: string;
  currency_symbol: string;
  created_at: Date;
};


export type Activity = {
  id: string;
  transactionId: string;
  subtype: WithdrawalSubtype;
  transactionHash: string;
  createdAt: Date;
  status: TransactionStatus;
}

export type ActivityQuery = {
  id: string;
  transaction_id: string;
  subtype: string;
  transaction_hash: string;
  created_at: Date;
  status: TransactionStatus;
};
