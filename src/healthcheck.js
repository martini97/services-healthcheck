import ping from './ping';

export default async services => {
  const result = {};
  const keys = Object.keys(services);

  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = await ping(services[keys[i]]);
  }

  return result;
};
