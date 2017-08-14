import axios from 'axios';

import databaseIsUp from './database';

export default async ({ url, route, knex }) => {
  if (knex) {
    const isUp = await databaseIsUp(knex);
    return { status: isUp ? 200 : 500 };
  }

  route = route || '/_ping';
  const pingUrl = `${url}${route}`;
  try {
    await axios({
      url: `${url}${route}`,
      method: 'get',
    });

    return { status: 200 };
  } catch (e) {
    return {
      status: 500,
      error: e.response && e.response.status,
    };
  }
};
