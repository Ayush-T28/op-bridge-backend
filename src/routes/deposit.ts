import {
    Routing,
} from '@zeeve-platform/express-server-library';
import * as depositController from '../controllers/deposit';

export const depositRouting: Routing = {
    isRoute: false,
    url: '/deposit',
    childRoutes: [
        depositController.createDeposit,
        depositController.getDepositsByAccount,
    ],
};

export default depositRouting;
