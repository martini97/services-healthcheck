import axios from 'axios';
import express from 'express';
import { feature } from 'ava-spec';
import MockAdapter from 'axios-mock-adapter';
import supertest from 'supertest';

import middleware from '../lib/middleware';

const mock = new MockAdapter(axios);

import {
  amqpUpConfig,
  amqpDownConfig,
} from './consts';
import {
  servicesQueue,
  servicesQueueHealth,
  servicesAllUp,
  servicesAllUpHealth,
  servicesSomeDown,
  servicesSomeDownHealth,
  servicesCustomPing,
  servicesCustomPingHealth,
} from './services';

mock.onGet('http://service-1/_ping').reply(200);
mock.onGet('http://service-2/_ping').reply(200);
mock.onGet('http://service-3/_ping').reply(200);
mock.onGet('http://service-4/_ping').reply(200);
mock.onGet('http://service-5/_ping').reply(500);
mock.onGet('http://service-6/_ping').reply(500);
mock.onGet('http://service-7/_ping').reply(500);
mock.onGet('http://service-8/_ping').reply(200);
mock.onGet('http://service-9/ping/health').reply(500);
mock.onGet('http://service-10/health/ping').reply(200);
mock.onGet('http://service-11/_custom-ping').reply(200);

async function compareMiddlewareResponse(t, service, expected) {
  const app = express();
  app.use(middleware(service));
  const { body } = await supertest(app)
    .get('/_health');

  t.deepEqual(body, expected);
}

/* middleware */
feature('using the middleware', scenario => {
  scenario('should return services health', async t => {
    await compareMiddlewareResponse(t, servicesAllUp, servicesAllUpHealth);
  });
  scenario('should return services health again', async t => {
    await compareMiddlewareResponse(t, servicesSomeDown, servicesSomeDownHealth);
  });
  scenario('given that some services have custom ping routes', async t => {
    await compareMiddlewareResponse(t, servicesCustomPing, servicesCustomPingHealth);
  });
  scenario.skip('given that you are checking queues', async t => {
    await compareMiddlewareResponse(t, servicesQueue, servicesQueueHealth);
  });
});
