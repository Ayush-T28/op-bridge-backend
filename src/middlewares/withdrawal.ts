import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { handleErrorResponse } from '@zeeve-platform/express-server-library';
import { getLogger } from '../utils/logger';
import { errors } from '../errors';

const logger = getLogger('withdrawal-validation');

export const createWithdrawalValidation = (req: Request,
    res: Response, next: NextFunction): void => {
    try {
        const createWithdrawalSchema = Joi.object().keys({
            account: Joi.string().required(),
            type: Joi.string().required(),
            subtype: Joi.string().required(),
            amount: Joi.number().required(),
            transactionHash: Joi.string().required(),
        });

        const { error } = createWithdrawalSchema.validate(req.body);
        if (error) {
            if ('details' in error && error.details.length > 0 && error.details[0].message) {
                return handleErrorResponse({ status: 401, message: error.details[0].message }, res);
            }
            return handleErrorResponse(errors.InvalidRequestBody, res);
        }
        return next();
    } catch (error: any) {
        logger.error(error);
        return handleErrorResponse({ status: 500, message: error.toString() }, res);
    }
};


export const updateWithdrawalValidation = (req: Request,
    res: Response, next: NextFunction): void => {
    try {
        const createWithdrawalSchema = Joi.object().keys({
            subtype: Joi.string().required(),
            transactionHash: Joi.string().required(),
        });

        const { error } = createWithdrawalSchema.validate(req.body);
        if (error) {
            if ('details' in error && error.details.length > 0 && error.details[0].message) {
                return handleErrorResponse({ status: 401, message: error.details[0].message }, res);
            }
            return handleErrorResponse(errors.InvalidRequestBody, res);
        }
        return next();
    } catch (error: any) {
        logger.error(error);
        return handleErrorResponse({ status: 500, message: error.toString() }, res);
    }
};
