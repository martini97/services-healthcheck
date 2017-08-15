import axios from 'axios';

import databaseIsUp from './database';

/**
 * ping connects with the service passed and returns it's status.
 * @params {Object} - if there is an url, it will ping it on the route /_ping or
 * on the route that was passed and return it's status. If there is a knex it
 * will try to connect to the database, and return the connection status.
 * @returns {Object} - the status code of the connection, and the error code if
 * there was one.
 */
export default async ({ url, route, knex }) => {
  if (knex) {
    const isUp = await databaseIsUp(knex);
    return { status: isUp ? 200 : 500 };
  }

  const pingRoute = route || '/_ping';
  const pingUrl = `${url}${pingRoute}`;
  try {
    await axios({
      url: pingUrl,
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
