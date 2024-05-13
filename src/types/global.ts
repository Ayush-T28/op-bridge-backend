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


export type Deposit = {
  id: string;
  account: string;
  createdAt: Date;
  lastUpdatedAt: Date
  type: string;
  amount: number;
  currencySymbol: string;
  transaction: string; // its a transaction hash
  status: number;
  statusText: string;
};


export type DepositQuery = {
  id: string;
  account: string;
  created_at: Date;
  last_updated_at: Date
  type: string;
  amount: number;
  currency_symbol: string;
  transaction: string; // its a transaction hash
  status: number;
  status_text: string;
};
