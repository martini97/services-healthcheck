import ping from './ping';

function getUrl(value) {
  let url,  route,  knex;
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

      url = value.url;
      route = value.route;
      break;
    default:
      return {};
  }

  return { url, route, knex };
}

export default async services => {
  const result = {};
  const keys = Object.keys(services);

  for (let i = 0; i < keys.length; i++) {
    const service = getUrl(services[keys[i]]);
    result[keys[i]] = await ping(service);
  }

  return result;
};
