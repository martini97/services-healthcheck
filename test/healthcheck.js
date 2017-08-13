import axios from 'axios';
import { feature } from 'ava-spec';
import MockAdapter from 'axios-mock-adapter';

import healthCheck from '../lib/healthcheck';

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
mock.onGet('http://service-1/_ping').reply(200);
mock.onGet('http://service-2/_ping').reply(200);
mock.onGet('http://service-3/_ping').reply(200);
mock.onGet('http://service-4/_ping').reply(200);
mock.onGet('http://service-5/_ping').reply(500);
mock.onGet('http://service-6/_ping').reply(500);
mock.onGet('http://service-7/_ping').reply(500);
mock.onGet('http://service-8/_ping').reply(200);
mock.onGet('http://service-9/_ping').reply(200);

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
