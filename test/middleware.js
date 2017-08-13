import axios from 'axios';
import express from 'express';
import { feature } from 'ava-spec';
import MockAdapter from 'axios-mock-adapter';
import supertest from 'supertest';

import middleware from '../lib/middleware';

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

/* mocks */
mock.onGet('http://service-1/_ping').reply(200);
mock.onGet('http://service-2/_ping').reply(200);
mock.onGet('http://service-3/_ping').reply(200);
mock.onGet('http://service-4/_ping').reply(200);
mock.onGet('http://service-5/_ping').reply(500);
mock.onGet('http://service-6/_ping').reply(500);
mock.onGet('http://service-7/_ping').reply(500);
mock.onGet('http://service-8/_ping').reply(200);

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
