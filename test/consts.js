const knex = require('knex');
const mockKnex = require('mock-knex');

const amqpDownConfig = { host: 'localhost', port: '5680' };
const amqpUpConfig = { host: 'localhost', port: '5672' };
const knexUp = knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'database',
    port: 3306,
  },
  debug: false,
});
const knexDown = knex({
  client: 'mysql',
});
const knexTracker = mockKnex.getTracker();
const statusOK = { status: 200 };
const statusError = { status: 500, error: 500 };
const statusNOK = { status: 500, error: undefined };
const statusFail = { status: 500 };

module.exports = {
  amqpUpConfig,
  amqpDownConfig,
  knexUp,
  knexDown,
  mockKnex,
  knexTracker,
  statusOK,
  statusError,
  statusNOK,
  statusFail,
};
