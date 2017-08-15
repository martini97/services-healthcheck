import ping from './ping';

/**
 * getService receives a value, and return an object that will be used by ping
 * to check if the service is up. The value can a string containing an url,
 * a function that receives no arguments, and returns an string containing an url,
 * an object with an url and it's ping route, or an object with a knex instance.
 * @param {(string|function|Object)} value
 * @returns {Object} - Object that ping will use to check service status.
 */
function getService(value) {
  let url;
  let route;
  let knex;
  let queue;
  switch (typeof value) {
    case 'string':
      url = value;
      break;
    case 'function':
      url = value();
      break;
    case 'object':
      if (value.knex) {
        knex = value.knex;
        break;
      }

      if (value.queue) {
        queue = value.queue;
        break;
      }

      url = value.url;
      route = value.route;
      break;
    default:
      return {};
  }

  return { url, route, knex, queue };
}

/**
 * Iterates through the services passed and returns a map of the service and
 * it's status.
 * @param {Object} services - Map of the service to it's value (see getService).
 * @returns {Object} result - A mapping of the services to their status.
 */
export default async services => {
  const result = {};

  for (const service of Object.keys(services)) {
    result[service] = await ping(getService(services[service]));
  }

  return result;
};
