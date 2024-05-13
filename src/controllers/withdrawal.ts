import { Request, Response } from 'express';
import { handleErrorResponse, sendDataResponse, Route } from '@zeeve-platform/express-server-library';
import { createWithdrawaltValidation } from '../middlewares/withdrawal';

export const createWithdrawal: Route = {
    isRoute: true,
    path: '/create',
    method: 'post',
    handlers: [
        /**
         * Check authorization
         * @param {Request} req Express request object
         * @param {Response} res Express response object
         * @param {NextFunction} next Express next function
         */
        createWithdrawaltValidation,
        /**
         * Creates network with requested details
         * @param {Request} req Express request object
         * @param {Response} res Express response object
         */
        async (req: Request, res: Response): Promise<void> => {
            try {
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
    path: '/update',
    method: 'post',
    handlers: [
        /**
         * Check authorization
         * @param {Request} req Express request object
         * @param {Response} res Express response object
         * @param {NextFunction} next Express next function
         */
        createWithdrawaltValidation,
        /**
         * Creates network with requested details
         * @param {Request} req Express request object
         * @param {Response} res Express response object
         */
        async (req: Request, res: Response): Promise<void> => {
            try {
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
