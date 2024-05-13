/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import { initExternalServer, closeExternalServer } from './app';
import { closeDbConnectionPool, initDbConnectionPool } from './utils/database';

const gracefulShutdown = async () => {
    await closeExternalServer();
    await closeDbConnectionPool();
    process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);

const bootUp = async () => {
    try {
        // Init connection to database pool
        await initDbConnectionPool();

        // Init external server
        await initExternalServer();
        // Init the Polkadotwallet
    } catch (e) {
        await gracefulShutdown();
    }
};

bootUp();
