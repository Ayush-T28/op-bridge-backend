import Web3 from 'web3';
import config from 'config';
import * as schedule from 'node-schedule';
import { getLogger } from '../utils/logger';
import { getAllDeposit } from '../database/deposit';
import { getAllActivity, updateStatus } from '../database/activity';
import { getAllWithdrawal } from '../database/withdrawal';

const logger = getLogger('solution-status-check-cron');


schedule.scheduleJob('*/10 * * * *', async () => {
    try {
        logger.info('Deposit Status Update Cron: start');
        const web3 = new Web3(config.get('L1.rpcUrl') as string);
        const activity = await getAllDeposit();
        activity.forEach(async (item) => {
            try {
                // Get the transaction receipt
                const allActivity = await getAllActivity(item.id, 'pending');
                allActivity.forEach(async (data) => {
                    try {
                        const receipt = await web3.eth.getTransactionReceipt(data.transaction_hash);
                        logger.info(receipt, receipt.status, receipt.status.toString());
                        if (receipt) {
                            // Check the status of the transaction
                            if (receipt.status) {
                                updateStatus(data.id, 'completed');
                            } else {
                                updateStatus(data.id, 'failed');
                            }
                        } else {
                            logger.info('Transaction receipt not found, the transaction might still be pending');
                        }
                    } catch (error) {
                        logger.error('An error occurred:', error);
                    }
                });
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
        const web3L1 = new Web3(config.get('L1.rpcUrl') as string);
        const web3L2 = new Web3(config.get('L2.rpcUrl') as string);
        const activity = await getAllWithdrawal();
        activity.forEach(async (item) => {
            try {
                // Get the transaction receipt
                const allActivity = await getAllActivity(item.id, 'pending');
                allActivity.forEach(async (data) => {
                    try {
                        let receipt;
                        if (data.subtype === 'initiate') {
                            receipt = await web3L2.eth.getTransactionReceipt(data.transaction_hash);
                        } else {
                            receipt = await web3L1.eth.getTransactionReceipt(data.transaction_hash);
                        }
                        logger.info(receipt, receipt.status, receipt.status.toString());
                        if (receipt) {
                            // Check the status of the transaction
                            if (receipt.status) {
                                updateStatus(data.id, 'completed');
                            } else {
                                updateStatus(data.id, 'failed');
                            }
                        } else {
                            logger.info('Transaction receipt not found, the transaction might still be pending');
                        }
                    } catch (error) {
                        logger.error('An error occurred:', error);
                    }
                });
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
