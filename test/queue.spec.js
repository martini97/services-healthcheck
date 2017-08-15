import { feature } from 'ava-spec';

import queue from '../lib/queue';
import {
  amqpUpConfig,
  amqpDownConfig,
} from './consts';

feature('testing queue connection', scenario => {
  scenario.skip('given that the queue is up', async t => {
    const isUp = await queue(amqpUpConfig);
    t.true(isUp);
  });
  scenario('given that the queue is down', async t => {
    const isUp = await queue(amqpDownConfig);
    t.false(isUp);
  });
});
