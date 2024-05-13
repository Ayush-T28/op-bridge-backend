import { Errors } from '../types';

export const errors: Errors = {
    NotAuthorized: {
        message: 'Unauthorized.',
        status: 401,
    },
    InvalidRequestBody: {
        message: 'Invalid data.',
        status: 400,
    },
};


export default errors;
