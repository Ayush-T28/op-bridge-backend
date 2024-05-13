/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.raw(`
    CREATE TABLE IF NOT EXISTS  transactions (
        id UUID PRIMARY KEY,
        account VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL,
        last_updated_at TIMESTAMP NOT NULL,
        type VARCHAR(50) NOT NULL,
        amount NUMERIC(20, 2) NOT NULL,
        currency_symbol VARCHAR(50),
        transaction VARCHAR NOT NULL,
        status INT NOT NULL,
        status_text VARCHAR(100) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS activity_logs (
      id UUID PRIMARY KEY,
      transaction_id UUID,
      action VARCHAR(100),
      created_at TIMESTAMP NOT NULL
    );
  `);
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.raw(`
    DROP TABLE IF EXISTS activity_logs;
    DROP TABLE IF EXISTS transactions;
  `);
};
