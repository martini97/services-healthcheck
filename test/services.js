const knexUp = require('./consts').knexUp;
const knexDown = require('./consts').knexDown;
const amqpUpConfig = require('./consts').amqpUpConfig;
const amqpDownConfig = require('./consts').amqpDownConfig;

const servicesAllUp = {
  'service-1': 'http://service-1',
  'service-2': 'http://service-2',
  'service-3': 'http://service-3',
  'service-4': 'http://service-4',
};
const servicesSomeDown = {
  'service-5': 'http://service-5',
  'service-6': 'http://service-6',
  'service-7': 'http://service-7',
  'service-8': 'http://service-8',
};
const servicesSomeFunction = {
  'service-9': () => 'http://service-8',
};
const servicesCustomPing = {
  'service-10': { url: 'http://service-10', route: '/health/ping' },
  'service-11': { url: 'http://service-11', route: '/_custom-ping' },
  'service-12': 'http://service-3',
  'service-13': 'http://service-4',
};
const servicesDatabase = {
  'db-up': { knex: knexUp },
  'db-down': { knex: knexDown },
};
const servicesQueue = {
  'queue-up': { queue: amqpUpConfig },
  'queue-down': { queue: amqpDownConfig },
};
const servicesAllUpHealth = {
  'service-1': { status: 200 },
  'service-2': { status: 200 },
  'service-3': { status: 200 },
  'service-4': { status: 200 },
};
const servicesSomeDownHealth = {
  'service-5': { error: 500, status: 500 },
  'service-6': { error: 500, status: 500 },
  'service-7': { error: 500, status: 500 },
  'service-8': { status: 200 },
};
const servicesSomeFunctionHealth = {
  'service-9': { status: 200 },
};
const servicesCustomPingHealth = {
  'service-10': { status: 200 },
  'service-11': { status: 200 },
  'service-12': { status: 200 },
  'service-13': { status: 200 },
};
const servicesDatabaseHealth = {
  'db-up': { status: 200 },
  'db-down': { status: 500 },
};
const servicesQueueHealth = {
  'queue-up': { status: 200 },
  'queue-down': { status: 500 },
};
const serviceUpUrl = 'http://service-up-dependencie';
const serviceDownUrl = 'http://service-down-dependencie';
const serviceTimeoutUrl = 'http://service-timeout-dependencie';
const serviceNetworkErrorUrl = 'http://service-nw-error-dependencie';
const serviceCustomPingRoute = 'http://service-custom-ping-route';
const servicePingNotOkBut200 = 'http://service-not-ok-but-200';

module.exports = {
  serviceUpUrl,
  serviceDownUrl,
  serviceTimeoutUrl,
  serviceNetworkErrorUrl,
  serviceCustomPingRoute,
  servicesAllUp,
  servicesAllUpHealth,
  servicesSomeDown,
  servicesSomeDownHealth,
  servicesSomeFunction,
  servicesSomeFunctionHealth,
  servicesCustomPing,
  servicesCustomPingHealth,
  servicesDatabase,
  servicesDatabaseHealth,
  servicesQueue,
  servicesQueueHealth,
  servicePingNotOkBut200,
};
