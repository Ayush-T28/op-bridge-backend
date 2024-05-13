import {
    Routing,
} from '@zeeve-platform/express-server-library';
import * as depositController from '../controllers/deposit';

export const dashboardRouting: Routing = {
    isRoute: false,
    url: '/deposit',
    childRoutes: [
        depositController.createDeposit,
    ],
};

export default dashboardRouting;
