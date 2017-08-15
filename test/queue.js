import { feature } from 'ava-spec';

import queue from '../lib/queue';

const amqpDownConfig = { host: 'localhost', port: '5680' };
const amqpUpConfig = { host: 'localhost', port: '5672' };

feature('testing queue connection', scenario => {
  scenario.skip('given that the queue is up', async t => {
    // I haven't found a way to mock the queue yet, so unless you have it running
    // skip this test. If you have docker and want to run this test:
    // $ docker run -d --name amqp.test -p 5672:5672 rabbitmq
    const isUp = await queue(amqpUpConfig);
    t.true(isUp);
  });
  scenario('given that the queue is down', async t => {
    const isUp = await queue(amqpDownConfig);
    t.false(isUp);
  });
});
