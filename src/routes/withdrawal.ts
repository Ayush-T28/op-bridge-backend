import {
    Routing,
} from '@zeeve-platform/express-server-library';
import * as withdrawalController from '../controllers/withdrawal';

export const dashboardRouting: Routing = {
    isRoute: false,
    url: '/withdrawal',
    childRoutes: [
        withdrawalController.createWithdrawal,
        withdrawalController.updateWithdrawal,
        withdrawalController.getWithdrawalsByAccount,

    ],
};

export default dashboardRouting;
