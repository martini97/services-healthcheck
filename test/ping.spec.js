import axios from 'axios';
import { feature } from 'ava-spec';
import MockAdapter from 'axios-mock-adapter';

import ping from '../lib/ping';
import {
  serviceUpUrl,
  serviceDownUrl,
  serviceTimeoutUrl,
  serviceNetworkErrorUrl,
  serviceCustomPingRoute,
  servicePingNotOkBut200,
} from './services';
import {
  statusOK,
  statusNOK,
  statusError,
  statusFail,
  knexUp,
  knexDown,
  knexTracker,
  mockKnex,
  amqpUpConfig,
  amqpDownConfig,
} from './consts';

const mock = new MockAdapter(axios);

/* mocks */
mock.onGet(`${serviceUpUrl}/_ping`).reply(200, 'OK');
mock.onGet(`${serviceDownUrl}/_ping`).reply(500);
mock.onGet(`${serviceTimeoutUrl}/_ping`).timeout();
mock.onGet(`${serviceNetworkErrorUrl}/_ping`).networkError();
mock.onGet(`${serviceCustomPingRoute}/_custom-ping`).reply(200, 'OK');
mock.onGet(`${servicePingNotOkBut200}/_ping`).reply(200);

async function comparePing(t, service, expected) {
  const response = await ping(service);
  t.deepEqual(response, expected);
}

feature('pinging an url', scenario => {
  scenario('given that the url is up', async t => {
    await comparePing(t, { url: serviceUpUrl }, statusOK);
  });
  scenario('given that the url is down', async t => {
    await comparePing(t, { url: serviceDownUrl }, statusError);
  });
  scenario('given that the url timeout', async t => {
    await comparePing(t, { url: serviceTimeoutUrl }, statusNOK);
  });
  scenario('given that the url has a network error', async t => {
    await comparePing(t, { url: serviceNetworkErrorUrl }, statusNOK);
  });
  scenario('given that the url has a custom ping route', async t => {
    await comparePing(t, { url: serviceCustomPingRoute, route: '/_custom-ping' }, statusOK);
  });
  scenario('given that ping does not return ok', async t => {
    await comparePing(t, { url: servicePingNotOkBut200 }, statusFail);
  });
});

feature('pinging a database', scenario => {
  scenario('given that the database is up', async t => {
    mockKnex.mock(knexUp);
    knexTracker.install();
    knexTracker.on('query', query => {
      query.response();
    });
    await comparePing(t, { knex: knexUp }, statusOK);
  });
  scenario('given that the database is down', async t => {
    await comparePing(t, { knex: knexDown }, statusFail);
  });
});

feature('pinging queue', scenario => {
  scenario.skip('given that the queue is up', async t => {
    await comparePing(t, { queue: amqpUpConfig }, statusOK);
  });
  scenario('given that the queue is down', async t => {
    await comparePing(t, { queue: amqpDownConfig }, statusFail);
  });
});
