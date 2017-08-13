import axios from 'axios';
import { feature } from 'ava-spec';
import MockAdapter from 'axios-mock-adapter';

import ping from '../lib/ping';

const mock = new MockAdapter(axios);

/* consts */
const serviceUpUrl = 'http://service-up-dependencie';
const serviceDownUrl = 'http://service-down-dependencie';
const serviceTimeoutUrl = 'http://service-timeout-dependencie';
const serviceNetworkErrorUrl = 'http://service-nw-error-dependencie';

/* mocks */
mock.onGet(`${serviceUpUrl}/_ping`).reply(200);
mock.onGet(`${serviceDownUrl}/_ping`).reply(500);
mock.onGet(`${serviceTimeoutUrl}/_ping`).timeout();
mock.onGet(`${serviceNetworkErrorUrl}/_ping`).networkError();

/* ping.js */
feature('pinging an url', scenario => {
  scenario('given that the url is up', async t => {
    const { status, error } = await ping(serviceUpUrl);
    t.is(status, 200);
    t.is(error, undefined);
  });
  scenario('given that the url is down', async t => {
    const { status, error } = await ping(serviceDownUrl);
    t.is(status, 500);
    t.is(error, 500);
  });
  scenario('given that the url timeout', async t => {
    const { status, error } = await ping(serviceTimeoutUrl);
    t.is(status, 500);
    t.is(error, undefined);
  });
  scenario('given that the url has a network error', async t => {
    const { status, error } = await ping(serviceNetworkErrorUrl);
    t.is(status, 500);
    t.is(error, undefined);
  });
});
