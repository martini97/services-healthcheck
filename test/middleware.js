import axios from 'axios';
import express from 'express';
import { feature } from 'ava-spec';
import MockAdapter from 'axios-mock-adapter';
import supertest from 'supertest';

import middleware from '../lib/middleware';

const mock = new MockAdapter(axios);

const amqpDownConfig = { host: 'localhost', port: '5680' };
const amqpUpConfig = { host: 'localhost', port: '5672' };

/* consts */
const servicesQueue = {
  'queue-up': { queue: amqpUpConfig },
  'queue-down': { queue: amqpDownConfig },
};
const servicesQueueHealth = {
  'queue-up': { status: 200 },
  'queue-down': { status: 500 },
};
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
const servicesCustomPingRoute = {
  'service-9': { url: 'http://service-9', route: '/ping/health' },
  'service-10': { url: 'http://service-10', route: '/ping' },
  'service-11': { url: 'http://service-11', route: '/custom-ping' },
  'service-12': { url: 'http://service-12', route: '/_health/_ping' },
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
const servicesCustomPingRouteHealth = {
  'service-9': { error: 500, status: 500 },
  'service-10': { status: 200 },
  'service-11': { error: 500, status: 500 },
  'service-12': { status: 200 },
};

/* mocks */
mock.onGet('http://service-1/_ping').reply(200);
mock.onGet('http://service-2/_ping').reply(200);
mock.onGet('http://service-3/_ping').reply(200);
mock.onGet('http://service-4/_ping').reply(200);
mock.onGet('http://service-5/_ping').reply(500);
mock.onGet('http://service-6/_ping').reply(500);
mock.onGet('http://service-7/_ping').reply(500);
mock.onGet('http://service-8/_ping').reply(200);
mock.onGet('http://service-9/ping/health').reply(500);
mock.onGet('http://service-10/ping').reply(200);
mock.onGet('http://service-11/custom-ping').reply(500);
mock.onGet('http://service-12/_health/_ping').reply(200);

/* middleware */
feature('using the middleware', scenario => {
  scenario('should return services health', async t => {
    const app = express();
    app.use(middleware(servicesAllUp));
    const { body } = await supertest(app)
      .get('/_health');

    t.deepEqual(body, servicesAllUpHealth);
  });
  scenario('should return services health again', async t => {
    const app = express();
    app.use(middleware(servicesSomeDown));
    const { body } = await supertest(app)
      .get('/_health');

    t.deepEqual(body, servicesSomeDownHealth);
  });
  scenario('given that some services have custom ping routes', async t => {
    const app = express();
    app.use(middleware(servicesCustomPingRoute));
    const { body } = await supertest(app)
      .get('/_health');

    t.deepEqual(body, servicesCustomPingRouteHealth);
  });
  scenario.skip('given that you are checking queues', async t => {
    const app = express();
    app.use(middleware(servicesQueue));
    const { body } = await supertest(app)
      .get('/_health');

    t.deepEqual(body, servicesQueueHealth);
  });
});
