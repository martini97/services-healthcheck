import axios from 'axios';
import { feature } from 'ava-spec';
import MockAdapter from 'axios-mock-adapter';
import knex from 'knex';

import healthCheck from '../lib/healthcheck';
import {
  knexUp,
  knexDown,
  mockKnex,
  knexTracker,
  amqpUpConfig,
  amqpDownConfig,
} from './consts';
import {
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
} from './services';

const mock = new MockAdapter(axios);

mockKnex.mock(knexUp);
knexTracker.install();
knexTracker.on('query', query => {
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

async function compareHealth(t, services, expectedHealth) {
  const health = await healthCheck(services);
  t.deepEqual(health, expectedHealth);
}

/* healthcheck */
feature('running health check on services', scenario => {
  scenario('given that all services are go', async t => {
    await compareHealth(t, servicesAllUp, servicesAllUpHealth);
  });
  scenario('given that some services are down', async t => {
    await compareHealth(t, servicesSomeDown, servicesSomeDownHealth);
  });
  scenario('given that some services are functions', async t => {
    await compareHealth(t, servicesSomeFunction, servicesSomeFunctionHealth);
  });
  scenario('given that some services have custom ping route', async t => {
    await compareHealth(t, servicesCustomPing, servicesCustomPingHealth);
  });
  scenario('given that some services are databases', async t => {
    await compareHealth(t, servicesDatabase, servicesDatabaseHealth);
  });
  scenario.skip('given that you are checking queues', async t => {
    await compareHealth(t, servicesQueue, servicesQueueHealth);
  });
});
