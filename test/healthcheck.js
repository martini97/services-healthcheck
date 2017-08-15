import axios from 'axios';
import { feature } from 'ava-spec';
import MockAdapter from 'axios-mock-adapter';
import knex from 'knex';
import mockKnex from 'mock-knex';

import healthCheck from '../lib/healthcheck';

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

const amqpDownConfig = { host: 'localhost', port: '5680' };
const amqpUpConfig = { host: 'localhost', port: '5672' };

const mock = new MockAdapter(axios);

/* consts */
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

const tracker = mockKnex.getTracker();
mockKnex.mock(knexUp);
tracker.install();
tracker.on('query', query => {
  query.response();
});

/* mocks */
mock.onGet('http://service-1/_ping').reply(200);
mock.onGet('http://service-2/_ping').reply(200);
mock.onGet('http://service-3/_ping').reply(200);
mock.onGet('http://service-4/_ping').reply(200);
mock.onGet('http://service-5/_ping').reply(500);
mock.onGet('http://service-6/_ping').reply(500);
mock.onGet('http://service-7/_ping').reply(500);
mock.onGet('http://service-8/_ping').reply(200);
mock.onGet('http://service-9/_ping').reply(200);
mock.onGet('http://service-10/health/ping').reply(200);
mock.onGet('http://service-11/_custom-ping').reply(200);

/* healthcheck */
feature('running health check on services', scenario => {
  scenario('given that all services are go', async t => {
    const health = await healthCheck(servicesAllUp);
    t.deepEqual(health, servicesAllUpHealth);
  });
  scenario('given that some services are down', async t => {
    const health = await healthCheck(servicesSomeDown);
    t.deepEqual(health, servicesSomeDownHealth);
  });
  scenario('given that some services are functions', async t => {
    const health = await healthCheck(servicesSomeFunction);
    t.deepEqual(health, servicesSomeFunctionHealth);
  });
  scenario('given that some services have custom ping route', async t => {
    const health = await healthCheck(servicesCustomPing);
    t.deepEqual(health, servicesCustomPingHealth);
  });
  scenario('given that some services are databases', async t => {
    const health = await healthCheck(servicesDatabase);
    t.deepEqual(health, servicesDatabaseHealth);
  });
  scenario.skip('given that you are checking queues', async t => {
    const health = await healthCheck(servicesQueue);
    t.deepEqual(health, servicesQueueHealth);
  });
});
