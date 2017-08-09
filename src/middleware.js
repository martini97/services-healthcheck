import healthCheck from './healthcheck';

// eslint-disable-next-line consistent-return
export default async services => async (req, res, next) => {
  if (req.url !== '/_health' || req.method !== 'GET') {
    return next();
  }

  const health = await healthCheck(services);
  res.status(200).send(health);
};
