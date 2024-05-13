import {
    Routing,
} from '@zeeve-platform/express-server-library';
import * as activityController from '../controllers/activity';

export const dashboardRouting: Routing = {
    isRoute: false,
    url: '/activity',
    childRoutes: [
        activityController.getActivity,
    ],
};

export default dashboardRouting;
