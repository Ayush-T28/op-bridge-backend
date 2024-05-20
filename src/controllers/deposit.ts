/* eslint-disable camelcase */
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { handleErrorResponse, sendDataResponse, Route } from '@zeeve-platform/express-server-library';
import { createDepositValidation } from '../middlewares/deposit';
import * as DepositDatabase from '../database/deposit';
import { createActivity, getLatestActivity } from '../database/activity';
import { DepositQuery } from '../types';

type ResultData = DepositQuery & { subtype: string, status: string, transaction_id: string, transaction_hash: string};

export const createDeposit: Route = {
    isRoute: true,
    path: '',
    method: 'post',
    handlers: [
        /**
         * Check authorization
         * @param {Request} req Express request object
         * @param {Response} res Express response object
         * @param {NextFunction} next Express next function
         */
        createDepositValidation,
        /**
         * Creates network with requested details
         * @param {Request} req Express request object
         * @param {Response} res Express response object
         */
        async (req: Request, res: Response): Promise<void> => {
            try {
                const {
                    account, type, subtype, amount, transactionHash,
                } = req.body;
                const transactionId = uuidv4();
                await DepositDatabase.createDeposit({
                    id: transactionId,
                    account,
                    type,
                    amount,
                    currencySymbol: 'eth',
                    createdAt: new Date(),
                });
                await createActivity({
                    id: uuidv4(),
                    transactionId,
                    subtype,
                    transactionHash,
                    createdAt: new Date(),
                    status: 'pending',
                });
                return sendDataResponse({ success: true, message: 'deposit created' }, res);
            } catch (error: any) {
                if (error.message && error.status) {
                    return handleErrorResponse({ status: error.status, message: error.message }, res);
                }
                return handleErrorResponse({ status: 500, message: error.toString() }, res);
            }
        },
    ],
};


export const getDepositsByAccount: Route = {
    isRoute: true,
    path: '/:account',
    method: 'get',
    handlers: [
        /**
         * Check authorization
         * @param {Request} req Express request object
         * @param {Response} res Express response object
         * @param {NextFunction} next Express next function
         */
        /**
         * Creates network with requested details
         * @param {Request} req Express request object
         * @param {Response} res Express response object
         */
        async (req: Request, res: Response): Promise<void> => {
            try {
                const { account } = req.params;
                const data = await DepositDatabase.getDepositsByAccount(account);
                const result: ResultData[] = [];
                for (let i = 0; i < data.length; i += 1) {
                    const item = data[i];
                    // eslint-disable-next-line no-await-in-loop
                    const latestActivity = await getLatestActivity(item.id);
                    result.push({
                        ...item,
                        subtype: latestActivity.subtype,
                        status: latestActivity.status,
                        transaction_id: latestActivity.transaction_id,
                        transaction_hash: latestActivity.transaction_hash,
                    });
                }
                return sendDataResponse({ success: true, message: 'Deposit List', data: result }, res);
            } catch (error: any) {
                if (error.message && error.status) {
                    return handleErrorResponse({ status: error.status, message: error.message }, res);
                }
                return handleErrorResponse({ status: 500, message: error.toString() }, res);
            }
        },
    ],
};
