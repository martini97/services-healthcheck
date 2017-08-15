import healthCheck from './healthcheck';

const wrap = fn => (...args) => fn(...args).catch(args[2]);

/**
 * middleware returns a middleware function to be used by express.
 * @param {Object} services - a map of the services to their values
 * (see getService [healthcheck.js])
 * @returns {function} - a function to be used as a middleware on express.
 */

// eslint-disable-next-line consistent-return
export default services => wrap(async (req, res, next) => {
  if (req.url !== '/_health' || req.method !== 'GET') {
    return next();
  }

  const health = await healthCheck(services);
  res.status(200).send(health);
});
