import * as log4js from 'log4js';
import config from 'config';

export function getLogger(loggerName?: string): log4js.Logger {
    const logger = log4js.getLogger(loggerName);
    logger.level = config.get('logger.level');
    return logger;
}

interface LoggerConfig {
  [key: string]: any; // Allow any additional properties
}

interface LoggerWithCustomLevels {
    [key: string]: (...args: any[]) => void;
}

class Logger {
    private logger: LoggerWithCustomLevels;

    private customConfig: LoggerConfig;

    constructor(loggerName: string, ...configs: LoggerConfig[]) {
        this.customConfig = Object.assign({}, ...configs);
        this.customConfig.loggerName = loggerName;
        this.logger = this.createLogger();
    }

    private createLogger(): LoggerWithCustomLevels {
        const callerFunctionName = this.getCallerFunctionName();
        const loggerName = this.customConfig.loggerName || callerFunctionName;
        const logger = log4js.getLogger(loggerName);
        logger.level = config.get('logger.level');
        return logger as unknown as LoggerWithCustomLevels; // Type assertion
    }

    // eslint-disable-next-line class-methods-use-this
    private getCallerFunctionName(): string {
        const stack = new Error().stack as string;
        const stackLines = stack.split('\n');
        const functionNameLine = stackLines[3];
        const functionName = (functionNameLine.match(/at\s+([^\s]+)/) ?? [])[1] || 'unknownFunction';
        return functionName;
    }


    private log(level: string, ...args: any[]): void {
        const logMethod = this.logger[level] as (message: string) => void;
        const logMessage = args
            .map((arg) => (arg instanceof Error ? `\x1b[31mError Stack: ${arg.stack}\x1b[0m` : arg))
            .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg))
            .join(' ');
        logMethod.call(this.logger, this.formatLogMessage(logMessage));
    }

    public info(...args: any[]): void {
        this.log('info', ...args);
    }

    public warn(...args: any[]): void {
        this.log('warn', ...args);
    }

    public error(...args: any[]): void {
        this.log('error', ...args);
    }

    private formatLogMessage(message: string): string {
        const userIdPart = this.customConfig.userId ? `[${this.customConfig.userId}] ` : '';
        const serviceNamePart = this.customConfig.serviceName ? `[${this.customConfig.serviceName}] ` : '';
        return `${userIdPart}${serviceNamePart}- ${message}`;
    }
}

log4js.configure({
    appenders: {
        console: { type: 'console' },
    },
    categories: {
        default: { appenders: ['console'], level: 'info' },
    },
});

export default Logger;


/*
 *       example usage:
 *        class User {
 *        private userId: string;
 *        private logger: CustomLogger;
 *        constructor(userId: string) {
 *            this.userId = userId;
 *            this.logger = new CustomLogger('user-logger', {
 *                userId,
 *                serviceName: 'user-service',
 *            });
 *        }
 *        public doSomething(): void {
 *            this.logger.info('Doing something...');
 *            this.logger.warn('Warning:', 'Something might be wrong.');
 *            const error = new Error('This is a sample error.');
 *            this.logger.error('Error:', error, 'Something went wrong.');
 *            this.logger.error(error); // Logging just the error stack
 *            this.logger.info('Additional info:', { key: 'value' }); // Logging an object
 *            this.logger.info('Array:', [1, 2, 3]); // Logging an array
 *            this.logger.info('Number:', 42); // Logging a number
 *        }
 *    }
 *    const user = new User('user123');
 *    user.doSomething();
 */
