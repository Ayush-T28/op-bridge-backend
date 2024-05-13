/* eslint-disable import/first */
const dotenv = require('dotenv');

dotenv.config();

const config = require('config');

// Update with your config settings.

module.exports = {
    configuration: {
        client: 'pg',
        version: '7.2',
        connection: {
            host: config.get('Database.host'),
            port: config.get('Database.port'),
            user: config.get('Database.user'),
            password: config.get('Database.password'),
            database: config.get('Database.database'),
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },

};
