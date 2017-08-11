import ping from './ping';

function getUrl(value) {
  let url;
  switch (typeof value) {
    case 'string':
      url = value;
      break;
    case 'function':
      url = value();
      break;
    default:
      url = value;
  }

  return url;
}

export default async services => {
  const result = {};
  const keys = Object.keys(services);

  for (let i = 0; i < keys.length; i++) {
    const url = getUrl(services[keys[i]]);
    result[keys[i]] = await ping(url);
  }

  return result;
};
