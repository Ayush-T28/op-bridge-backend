/* eslint-disable camelcase */
import { QueryResultRow } from '@zeeve-platform/postgres-interaction-sdk';
import format from 'pg-format';
import databaseService from '../utils/database';
import { getLogger } from '../utils/logger';
import { ActivityQuery, Deposit, DepositQuery } from '../types';

const logger = getLogger('deposit-queries');

const toSnakeCase = (input: string): string => input.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
type DepositActivity = DepositQuery & ActivityQuery & {activity_id: string};
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
export const createDeposit = async ({
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
        logger.error({ METHOD: 'createDeposit', FILE: 'deposit-queries', error });
        throw error;
    }
};


export const getDeposit = async (depositId: string): Promise<DepositQuery> => {
    try {
        const query = format(`SELECT *
            FROM transactions where id = $1`);
        const result = await databaseService.query(query, [depositId]);
        if (result && result.rows) {
            return result.rows[0];
        }
        return {} as DepositQuery;
    } catch (error) {
        logger.error({ METHOD: 'getDeposit', FILE: 'deposit-queries', error });
        throw error;
    }
};

export const getDepositsByAccount = async (account: string): Promise<DepositQuery[]> => {
    try {
        const query = format('SELECT DISTINCT transactions.id, transactions.*, activity_logs.* FROM activity_logs INNER JOIN transactions ON activity_logs.transaction_id = transactions.id'
        + ' where account = $1 AND type=$2  ORDER BY activity_logs.created_at DESC');
        const result = await databaseService.query(query, [account, 'deposit']);
        if (result && result.rows) {
            return result.rows;
        }
        return {} as DepositQuery[];
    } catch (error) {
        logger.error({ METHOD: 'getDepositsByAccount', FILE: 'deposit-queries', error });
        throw error;
    }
};


export const getDepositActivity = async (): Promise<DepositActivity[]> => {
    try {
        const query = format(`SELECT *, activity_logs.id AS activity_id FROM transactions JOIN activity_logs
         ON transactions.id = activity_logs.transaction_id WHERE activity_logs.status = $1 AND transactions.type = $2;

        `);
        const result = await databaseService.query(query, ['pending', 'deposit']);
        if (result && result.rows) {
            return result.rows;
        }
        return {} as DepositActivity[];
    } catch (error) {
        logger.error({ METHOD: 'getDepositsByAccount', FILE: 'deposit-queries', error });
        throw error;
    }
};
