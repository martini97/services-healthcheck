import axios from 'axios';
import express from 'express';
import { feature } from 'ava-spec';
import MockAdapter from 'axios-mock-adapter';
import supertest from 'supertest';

import ping from '../lib/ping';
import healthCheck from '../lib/healthcheck';
import middleware from '../lib/middleware';

const mock = new MockAdapter(axios);

/* consts */
const serviceUpUrl = 'http://service-up-dependencie';
const serviceDownUrl = 'http://service-down-dependencie';
const serviceTimeoutUrl = 'http://service-timeout-dependencie';
const serviceNetworkErrorUrl = 'http://service-nw-error-dependencie';
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

/* mocks */
mock.onGet(`${serviceUpUrl}/_ping`).reply(200);
mock.onGet(`${serviceDownUrl}/_ping`).reply(500);
mock.onGet(`${serviceTimeoutUrl}/_ping`).timeout();
mock.onGet(`${serviceNetworkErrorUrl}/_ping`).networkError();
mock.onGet('http://service-1/_ping').reply(200);
mock.onGet('http://service-2/_ping').reply(200);
mock.onGet('http://service-3/_ping').reply(200);
mock.onGet('http://service-4/_ping').reply(200);
mock.onGet('http://service-5/_ping').reply(500);
mock.onGet('http://service-6/_ping').reply(500);
mock.onGet('http://service-7/_ping').reply(500);
mock.onGet('http://service-8/_ping').reply(200);
mock.onGet('http://service-9/_ping').reply(200);

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
});

/* middleware */
feature('using the middleware', scenario => {
  scenario('should return services health', async t => {
    const app = express();
    app.use(await middleware(servicesAllUp));
    const { body } = await supertest(app)
      .get('/_health');

    t.deepEqual(body, servicesAllUpHealth);
  });

  scenario('should return services health again', async t => {
    const app = express();
    app.use(await middleware(servicesSomeDown));
    const { body } = await supertest(app)
      .get('/_health');

    t.deepEqual(body, servicesSomeDownHealth);
  });
});
