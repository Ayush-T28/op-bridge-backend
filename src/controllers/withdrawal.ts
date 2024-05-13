import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { handleErrorResponse, sendDataResponse, Route } from '@zeeve-platform/express-server-library';
import { createWithdrawalValidation, updateWithdrawalValidation } from '../middlewares/withdrawal';
import * as WithdrawalDatabase from '../database/withdrawal';
import { createActivity } from '../database/activity';

export const createWithdrawal: Route = {
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
        createWithdrawalValidation,
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
                await WithdrawalDatabase.createWithdrawal({
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
                return sendDataResponse({ success: true, message: 'withdrawal created' }, res);
            } catch (error: any) {
                if (error.message && error.status) {
                    return handleErrorResponse({ status: error.status, message: error.message }, res);
                }
                return handleErrorResponse({ status: 500, message: error.toString() }, res);
            }
        },
    ],
};


export const updateWithdrawal: Route = {
    isRoute: true,
    path: '/:transactionId',
    method: 'post',
    handlers: [
        /**
         * Check authorization
         * @param {Request} req Express request object
         * @param {Response} res Express response object
         * @param {NextFunction} next Express next function
         */
        updateWithdrawalValidation,
        /**
         * Creates network with requested details
         * @param {Request} req Express request object
         * @param {Response} res Express response object
         */
        async (req: Request, res: Response): Promise<void> => {
            try {
                const { transactionId } = req.params;
                const { subtype, transactionHash } = req.body;
                await createActivity({
                    id: uuidv4(),
                    transactionId,
                    subtype,
                    transactionHash,
                    createdAt: new Date(),
                    status: 'pending',
                });
                return sendDataResponse({ success: true, message: 'withdrawal activity created' }, res);
            } catch (error: any) {
                if (error.message && error.status) {
                    return handleErrorResponse({ status: error.status, message: error.message }, res);
                }
                return handleErrorResponse({ status: 500, message: error.toString() }, res);
            }
        },
    ],
};


export const getWithdrawalsByAccount: Route = {
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
                const data = await WithdrawalDatabase.getWithdrawalsByAccount(account);
                return sendDataResponse({ success: true, message: 'Withdrawal List', data }, res);
            } catch (error: any) {
                if (error.message && error.status) {
                    return handleErrorResponse({ status: error.status, message: error.message }, res);
                }
                return handleErrorResponse({ status: 500, message: error.toString() }, res);
            }
        },
    ],
};
