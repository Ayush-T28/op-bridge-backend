import { Request, Response } from 'express';
import config from 'config';
import { handleErrorResponse, sendDataResponse, Route } from '@zeeve-platform/express-server-library';

export const getL1Details: Route = {
    isRoute: true,
    path: '/l1',
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
                const rpcUrl = config.get('L1.rpcUrl');
                const explorerUrl = config.get('L1.explorerUrl');
                const contractAddress = config.get('L1.contractAddress');
                const currencySymbol = config.get('L1.currencySymbol');
                const data = {
                    rpcUrl, explorerUrl, contractAddress, currencySymbol,
                };
                return sendDataResponse({ success: true, message: 'l1 chain details', data }, res);
            } catch (error: any) {
                if (error.message && error.status) {
                    return handleErrorResponse({ status: error.status, message: error.message }, res);
                }
                return handleErrorResponse({ status: 500, message: error.toString() }, res);
            }
        },
    ],
};

export const getL2Details: Route = {
    isRoute: true,
    path: '/l2',
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
                const rpcUrl = config.get('L2.rpcUrl');
                const explorerUrl = config.get('L2.explorerUrl');
                const contractAddress = config.get('L2.contractAddress');
                const currencySymbol = config.get('L2.currencySymbol');
                const data = {
                    rpcUrl, explorerUrl, contractAddress, currencySymbol,
                };
                return sendDataResponse({ success: true, message: 'l2 chain details', data }, res);
            } catch (error: any) {
                if (error.message && error.status) {
                    return handleErrorResponse({ status: error.status, message: error.message }, res);
                }
                return handleErrorResponse({ status: 500, message: error.toString() }, res);
            }
        },
    ],
};


export const getTokenDetails: Route = {
    isRoute: true,
    path: '/token',
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
                const tokenName = config.get('TOKEN.name');
                const tokenSymbol = config.get('TOKEN.symbol');
                const tokenContractAddress = config.get('TOKEN.contractAddress');
                const data = {
                    tokenName, tokenSymbol, tokenContractAddress,
                };
                return sendDataResponse({ success: true, message: 'token details', data }, res);
            } catch (error: any) {
                if (error.message && error.status) {
                    return handleErrorResponse({ status: error.status, message: error.message }, res);
                }
                return handleErrorResponse({ status: 500, message: error.toString() }, res);
            }
        },
    ],
};
