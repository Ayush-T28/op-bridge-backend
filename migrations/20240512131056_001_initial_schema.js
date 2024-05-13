/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.raw(`
    CREATE TABLE IF NOT EXISTS transactions (
      id UUID PRIMARY KEY,
      account VARCHAR(42) NOT NULL,
      type VARCHAR(20) NOT NULL,
      amount NUMERIC(20, 2) NOT NULL,
      currency_symbol VARCHAR(20),
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id UUID PRIMARY KEY,
      transaction_id UUID NOT NULL,
      subtype VARCHAR(20) NOT NULL,
      transaction_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50) NOT NULL
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
