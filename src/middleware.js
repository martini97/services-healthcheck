import healthCheck from './healthcheck';

const wrap = fn => (...args) => fn(...args).catch(args[2]);

// eslint-disable-next-line consistent-return
export default services => wrap(async (req, res, next) => {
  if (req.url !== '/_health' || req.method !== 'GET') {
    return next();
  }

  const health = await healthCheck(services);
  res.status(200).send(health);
});
