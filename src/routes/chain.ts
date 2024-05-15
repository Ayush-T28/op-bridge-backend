import {
    Routing,
} from '@zeeve-platform/express-server-library';
import * as chainController from '../controllers/chain';

export const chainRouting: Routing = {
    isRoute: false,
    url: '/chain',
    childRoutes: [
        chainController.getL1Details,
        chainController.getL2Details,
    ],
};

export default chainRouting;
