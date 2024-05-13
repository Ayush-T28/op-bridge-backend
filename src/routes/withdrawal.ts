import {
    Routing,
} from '@zeeve-platform/express-server-library';
import * as withdrawalController from '../controllers/deposit';

export const dashboardRouting: Routing = {
    isRoute: false,
    url: '/withdrawal',
    childRoutes: [
        withdrawalController.createDeposit,
    ],
};

export default dashboardRouting;
