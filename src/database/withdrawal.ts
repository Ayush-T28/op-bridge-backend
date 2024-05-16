/* eslint-disable camelcase */
import { QueryResultRow } from '@zeeve-platform/postgres-interaction-sdk';
import format from 'pg-format';
import databaseService from '../utils/database';
import { getLogger } from '../utils/logger';
import { Deposit, DepositQuery } from '../types';

const logger = getLogger('withdrawal-queries');

const toSnakeCase = (input: string): string => input.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);

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


export const getWithdrawal = async (depositId: string): Promise<DepositQuery> => {
    try {
        const query = format(`SELECT *
            FROM transactions where id = $1`);
        const result = await databaseService.query(query, [depositId]);
        if (result && result.rows) {
            return result.rows[0];
        }
        return {} as DepositQuery;
    } catch (error) {
        logger.error({ METHOD: 'getWithdrawal', FILE: 'withdrawal-queries', error });
        throw error;
    }
};

export const getWithdrawalsByAccount = async (account: string): Promise<DepositQuery[]> => {
    try {
        const query = format('SELECT * FROM transactions where account= $1 and type=$2');
        const result = await databaseService.query(query, [account, 'withdrawal']);
        if (result && result.rows) {
            return result.rows;
        }
        return {} as DepositQuery[];
    } catch (error) {
        logger.error({ METHOD: 'getWithdrawalsByAccount', FILE: 'withdrawal-queries', error });
        throw error;
    }
};
