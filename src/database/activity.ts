/* eslint-disable camelcase */
import { QueryResultRow } from '@zeeve-platform/postgres-interaction-sdk';
import format from 'pg-format';
import databaseService from '../utils/database';
import { getLogger } from '../utils/logger';
import { Activity, ActivityQuery, TransactionStatus } from '../types';

const logger = getLogger('activity-queries');

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
export const createActivity = async ({
    id, transactionId, subtype, transactionHash, status, createdAt,
}: Activity): Promise<QueryResultRow> => {
    try {
        const parameters = [
            [
                id, transactionId, subtype, transactionHash, status, createdAt,
            ],
        ];
        const query = format('INSERT INTO activity_logs (id, transaction_id, subtype, transaction_hash,'
                + ' status, created_at) VALUES %L', parameters);
        const result = await databaseService.query(query, []);
        if (result && result.rows) {
            return result.rows[0];
        }
        return {};
    } catch (error) {
        logger.error({ METHOD: 'createActivity', FILE: 'activity-queries', error });
        throw error;
    }
};


export const getActivityByTransactionId = async (transactionId: string): Promise<ActivityQuery> => {
    try {
        const query = format('SELECT * FROM activity_logs INNER JOIN transactions ON activity_logs.transaction_id = transactions.id'
        + ' where transaction_id = $1 ORDER BY activity_logs.created_at DESC');
        const result = await databaseService.query(query, [transactionId]);
        if (result && result.rows) {
            return result.rows[0];
        }
        return {} as ActivityQuery;
    } catch (error) {
        logger.error({ METHOD: 'getActivityByTransactionId', FILE: 'activity-queries', error });
        throw error;
    }
};

export const getInitiateTransaction = async (transactionId: string): Promise<ActivityQuery> => {
    try {
        const query = format('SELECT * FROM activity_logs WHERE transaction_id = $1 AND subtype = $2');
        const result = await databaseService.query(query, [transactionId, 'initiate']);
        if (result && result.rows) {
            return result.rows[0];
        }
        return {} as ActivityQuery;
    } catch (error) {
        logger.error({ METHOD: 'getActivityByTransactionId', FILE: 'activity-queries', error });
        throw error;
    }
};


export const updateStatus = async (id: string, status: TransactionStatus): Promise<ActivityQuery[]> => {
    try {
        const query = format('UPDATE activity_logs SET status = $1 where id = $2');
        const result = await databaseService.query(query, [status, id]);
        if (result && result.rows) {
            return result.rows;
        }
        return {} as ActivityQuery[];
    } catch (error) {
        logger.error({ METHOD: 'updateStatus', FILE: 'activity-queries', error });
        throw error;
    }
};
