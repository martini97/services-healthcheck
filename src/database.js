/**
 * checks to see if the knex instance is connected to the database
 * @param {knex instance} knexConnection - Knex connection to the database.
 * @returns {bool} isUp - True if it was able to connect to the database,
 *                        false if there was an error
 */
export default async (knexConnection) => {
  try {
    await knexConnection.raw('SELECT 1');
    return true;
  } catch (e) {
    return false;
  }
};
