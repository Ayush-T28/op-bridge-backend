import Web3 from 'web3';
import config from 'config';
import * as schedule from 'node-schedule';
import { getLogger } from '../utils/logger';
import { getDepositActivity } from '../database/deposit';
import { updateStatus } from '../database/activity';
import { getWithdrawalActivity } from '../database/withdrawal';

const logger = getLogger('solution-status-check-cron');


schedule.scheduleJob('*/10 * * * *', async () => {
    try {
        logger.info('Deposit Status Update Cron: start');
        const web3 = new Web3(config.get('L1.rpcUrl') as string);
        const activity = await getDepositActivity();
        activity.forEach(async (item) => {
            try {
                // Get the transaction receipt
                const receipt = await web3.eth.getTransactionReceipt(item.transaction_hash);
                logger.info(receipt, receipt.status, receipt.status.toString());
                if (receipt) {
                    // Check the status of the transaction
                    if (receipt.status) {
                        updateStatus(item.activity_id, 'completed');
                    } else {
                        updateStatus(item.activity_id, 'failed');
                    }
                } else {
                    logger.info('Transaction receipt not found, the transaction might still be pending');
                }
            } catch (error) {
                logger.error('An error occurred:', error);
            }
        });
    } catch (error) {
        logger.error(error);
    } finally {
        logger.info('Deposit Status Update Cron: end');
    }
});


schedule.scheduleJob('*/10 * * * *', async () => {
    try {
        logger.info('Withdrawal Status Update Cron: start');
        const web3 = new Web3(config.get('L1.rpcUrl') as string);
        const activity = await getWithdrawalActivity();
        activity.forEach(async (item) => {
            try {
                console.log(51, item);
                // Get the transaction receipt
                const receipt = await web3.eth.getTransactionReceipt(item.transaction_hash);
                logger.info(receipt, receipt.status, receipt.status.toString());
                if (receipt) {
                    // Check the status of the transaction
                    if (receipt.status) {
                        updateStatus(item.activity_id, 'completed');
                    } else {
                        updateStatus(item.activity_id, 'failed');
                    }
                } else {
                    logger.info('Transaction receipt not found, the transaction might still be pending');
                }
            } catch (error) {
                logger.error('An error occurred:', error);
            }
        });
    } catch (error) {
        logger.error(error);
    } finally {
        logger.info('Withdrawal Status Update Cron: end');
    }
});
