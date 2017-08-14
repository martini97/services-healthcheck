import knex from 'knex';

export default async (knexConnection) => {
  try {
    const isUp = await knexConnection.raw('SELECT 1');
    return true;
  } catch (e) {
    return false;
  }
};
