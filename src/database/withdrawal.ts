/* eslint-disable camelcase */
import { QueryResultRow } from '@zeeve-platform/postgres-interaction-sdk';
import format from 'pg-format';
import databaseService from '../utils/database';
import { getLogger } from '../utils/logger';
import {
    ActivityQuery, Deposit, DepositQuery, WithdrawalQuery,
} from '../types';

const logger = getLogger('withdrawal-queries');

const toSnakeCase = (input: string): string => input.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
type WithdrawalActivity = DepositQuery & ActivityQuery & {activity_id: string};
export const camelCaseToSnake = (updateValues: Object): {setClause: string, parameters: any[]} => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let setClause = '';
    const parameters: any[] = [];
    let parameterIndex = 1;
    Object.entries(updateValues).forEach(([columnName, columnValue]) => {
        if (columnValue !== undefined) {
            const snakeCaseColumn = toSnakeCase(columnName);
            setClause += `${snakeCaseColumn} = $${parameterIndex}, `;
            parameters.push(columnValue);
            parameterIndex += 1;
        }
    });
    setClause = setClause.slice(0, -2);
    return { setClause, parameters };
};
// write queries
export const createWithdrawal = async ({
    id, account, type, amount, currencySymbol, createdAt,
}: Deposit): Promise<QueryResultRow> => {
    try {
        const parameters = [
            [
                id, account, type, amount, currencySymbol, createdAt,
            ],
        ];
        const query = format('INSERT INTO transactions (id, account, type, amount, currency_symbol, created_at) VALUES %L', parameters);
        const result = await databaseService.query(query, []);
        if (result && result.rows) {
            return result.rows[0];
        }
        return {};
    } catch (error) {
        logger.error({ METHOD: 'createWithdrawal', FILE: 'withdrawal-queries', error });
        throw error;
    }
};


export const getWithdrawal = async (depositId: string): Promise<WithdrawalQuery> => {
    try {
        const query = format(`SELECT *
            FROM transactions where id = $1`);
        const result = await databaseService.query(query, [depositId]);
        if (result && result.rows) {
            return result.rows[0];
        }
        return {} as WithdrawalQuery;
    } catch (error) {
        logger.error({ METHOD: 'getWithdrawal', FILE: 'withdrawal-queries', error });
        throw error;
    }
};

export const getWithdrawalsByAccount = async (account: string): Promise<WithdrawalQuery[]> => {
    try {
        const query = format('SELECT * FROM activity_logs INNER JOIN transactions ON activity_logs.transaction_id = transactions.id'
        + ' where account = $1 AND type=$2  ORDER BY activity_logs.created_at DESC');
        const result = await databaseService.query(query, [account, 'withdrawal']);
        if (result && result.rows) {
            return result.rows;
        }
        return {} as WithdrawalQuery[];
    } catch (error) {
        logger.error({ METHOD: 'getWithdrawalsByAccount', FILE: 'withdrawal-queries', error });
        throw error;
    }
};

export const getWithdrawalActivity = async (): Promise<WithdrawalActivity[]> => {
    try {
        const query = format(`SELECT *, activity_logs.id AS activity_id FROM transactions JOIN activity_logs
         ON transactions.id = activity_logs.transaction_id WHERE activity_logs.status = $1 AND transactions.type = $2;

        `);
        const result = await databaseService.query(query, ['pending', 'withdrawal']);
        if (result && result.rows) {
            return result.rows;
        }
        return {} as WithdrawalActivity[];
    } catch (error) {
        logger.error({ METHOD: 'getWithdrawalActivity', FILE: 'withdrawal-queries', error });
        throw error;
    }
};
