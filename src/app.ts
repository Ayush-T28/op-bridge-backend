import config from 'config';
import Express from 'express';
import { Options, ServerApp } from '@zeeve-platform/express-server-library';
import depositRouting from './routes/deposit';
import withdrawalRouting from './routes/withdrawal';
import activityRouting from './routes/activity';
import chainRouting from './routes/chain';


const serverName = 'ExternalServer';
const serverPort: number = config.get(`${serverName}.port`);
const allowedOrigins: string[] = JSON.parse(config.get(`${serverName}.cors.allowedOrigins`));

const corsParams = {
    origin: allowedOrigins,
    methods: 'GET,HEAD,POST',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['authorization', 'Authorization', 'content-type'],
};
const expressOptions: Options = {
    enableGlobalRateLimiter: config.get(`${serverName}.enableGlobalRateLimit`),
    port: serverPort,
    cors: {
        options: corsParams,
    },
    securityHeaders: {
        expectCt: {
            options: {
                maxAge: config.get(`${serverName}.headerCtMaxAge`),
                enforce: true,
            },
        },
    },
};
if (config.has(`${serverName}.globalRateLimit.window`) && config.has(`${serverName}.globalRateLimit.hits`)) {
    expressOptions.globalRateLimiterOptions = {
        windowMs: config.get(`${serverName}.globalRateLimit.window`),
        max: config.get(`${serverName}.globalRateLimit.hits`),
        legacyHeaders: false,
        standardHeaders: false,
    };
}

const externalAPIServer = new ServerApp(expressOptions);
const numberOfProxies = config.get('ExternalServer.numberOfProxies') ? config.get('ExternalServer.numberOfProxies') : 1;
externalAPIServer.expressApp.set('trust proxy', numberOfProxies);
externalAPIServer.expressApp.get('/ip', (request, response) => response.send(request.ip));
externalAPIServer.expressApp.get('/x-forwarded-for', (request, response) => response.send(request.headers['x-forwarded-for']));
const app = externalAPIServer.expressApp;
const requestBodySize = config.get(`${serverName}.requestBodySize`) as string;
app.use(Express.urlencoded({
    extended: true,
    limit: requestBodySize,
}));
app.use(Express.json({
    limit: requestBodySize,
}));


const initExternalServer = (): void => {
    externalAPIServer.applyRoutes('', depositRouting);
    externalAPIServer.applyRoutes('', withdrawalRouting);
    externalAPIServer.applyRoutes('', activityRouting);
    externalAPIServer.applyRoutes('', chainRouting);

    externalAPIServer.initalise();
};

const closeExternalServer = async (): Promise<void> => {
    await externalAPIServer.closeServer();
};

export { initExternalServer, closeExternalServer };
