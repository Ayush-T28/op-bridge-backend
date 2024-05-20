import { Request, Response } from 'express';
import { handleErrorResponse, sendDataResponse, Route } from '@zeeve-platform/express-server-library';
import { getActivityByTransactionId, getInitiateTransaction } from '../database/activity';

export const getActivity: Route = {
    isRoute: true,
    path: '/:transactionId',
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
                const { transactionId } = req.params;
                const data = await getActivityByTransactionId(transactionId);
                return sendDataResponse({ success: true, message: 'activity list', data }, res);
            } catch (error: any) {
                if (error.message && error.status) {
                    return handleErrorResponse({ status: error.status, message: error.message }, res);
                }
                return handleErrorResponse({ status: 500, message: error.toString() }, res);
            }
        },
    ],
};

export const getInitaiteActivity: Route = {
    isRoute: true,
    path: '/initiate/:transactionId',
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
                const { transactionId } = req.params;
                const data = await getInitiateTransaction(transactionId);
                return sendDataResponse({ success: true, message: 'initate activity', data }, res);
            } catch (error: any) {
                if (error.message && error.status) {
                    return handleErrorResponse({ status: error.status, message: error.message }, res);
                }
                return handleErrorResponse({ status: 500, message: error.toString() }, res);
            }
        },
    ],
};
