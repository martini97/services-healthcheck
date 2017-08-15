import { feature } from 'ava-spec';
import knex from 'knex';
import mockKnex from 'mock-knex';

import database from '../lib/database';

const knexUp = knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'database',
    port: 3306,
  },
  debug: false,
});

const knexDown = knex({
  client: 'mysql',
});

feature('testing database connection', scenario => {
  scenario('given that the database is up', async t => {
    const tracker = mockKnex.getTracker();
    mockKnex.mock(knexUp);
    tracker.install();
    tracker.on('query', query => {
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
