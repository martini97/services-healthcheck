import axios from 'axios';
import { feature } from 'ava-spec';
import MockAdapter from 'axios-mock-adapter';
import knex from 'knex';
import mockKnex from 'mock-knex';

import ping from '../lib/ping';

const mock = new MockAdapter(axios);

/* consts */
const serviceUpUrl = 'http://service-up-dependencie';
const serviceDownUrl = 'http://service-down-dependencie';
const serviceTimeoutUrl = 'http://service-timeout-dependencie';
const serviceNetworkErrorUrl = 'http://service-nw-error-dependencie';
const serviceCustomPingRoute = 'http://service-custom-ping-route';

/* mocks */
mock.onGet(`${serviceUpUrl}/_ping`).reply(200);
mock.onGet(`${serviceDownUrl}/_ping`).reply(500);
mock.onGet(`${serviceTimeoutUrl}/_ping`).timeout();
mock.onGet(`${serviceNetworkErrorUrl}/_ping`).networkError();
mock.onGet(`${serviceCustomPingRoute}/_custom-ping`).reply(200);

/* ping.js */
feature('pinging an url', scenario => {
  scenario('given that the url is up', async t => {
    const { status, error } = await ping({ url: serviceUpUrl });
    t.is(status, 200);
    t.is(error, undefined);
  });
  scenario('given that the url is down', async t => {
    const { status, error } = await ping({ url: serviceDownUrl });
    t.is(status, 500);
    t.is(error, 500);
  });
  scenario('given that the url timeout', async t => {
    const { status, error } = await ping({ url: serviceTimeoutUrl });
    t.is(status, 500);
    t.is(error, undefined);
  });
  scenario('given that the url has a network error', async t => {
    const { status, error } = await ping({ url: serviceNetworkErrorUrl });
    t.is(status, 500);
    t.is(error, undefined);
  });
  scenario('given that the url has a custom ping route', async t => {
    const { status, error } = await ping({ url: serviceCustomPingRoute, route: '/_custom-ping' });
    t.is(status, 200);
    t.is(error, undefined);
  });
});

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

feature('pinging a database', scenario => {
  scenario('given that the database is up', async t => {
    const tracker = mockKnex.getTracker();
    mockKnex.mock(knexUp);
    tracker.install();
    tracker.on('query', query => {
      query.response();
    });

    const { status } = await ping({ knex: knexUp });
    t.is(status, 200);
  });
  scenario('given that the database is down', async t => {
    const { status } = await ping({ knex: knexDown });
    t.is(status, 500);
  });
});

const amqpDownConfig = { host: 'localhost', port: '5680' };
const amqpUpConfig = { host: 'localhost', port: '5672' };

feature('pinging queue', scenario => {
  scenario.skip('given that the queue is up', async t => {
    const { status } = await ping({ queue: amqpUpConfig });
    t.is(status, 200);
  });
  scenario('given that the queue is down', async t => {
    const { status } = await ping({ queue: amqpDownConfig });
    t.is(status, 500);
  });
});
