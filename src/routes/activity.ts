import {
    Routing,
} from '@zeeve-platform/express-server-library';
import * as activityController from '../controllers/activity';

export const activityRouting: Routing = {
    isRoute: false,
    url: '/activity',
    childRoutes: [
        activityController.getActivity,
        activityController.getInitaiteActivity,
    ],
};

export default activityRouting;
