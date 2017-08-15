import { feature } from 'ava-spec';

import database from '../lib/database';
import {
  knexUp,
  knexDown,
  mockKnex,
  knexTracker,
} from './consts';

feature('testing database connection', scenario => {
  scenario('given that the database is up', async t => {
    mockKnex.mock(knexUp);
    knexTracker.install();
    knexTracker.on('query', query => {
      query.response();
    });

    const isUp = await database(knexUp);
    t.true(isUp);
  });
  scenario('given that the database is down', async t => {
    const isUp = await database(knexDown);
    t.false(isUp);
  });
});
