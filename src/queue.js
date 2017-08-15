import amqp from 'amqp';

/**
 * connect returns a promise that will fail if the rabbitmq is down
 * @params {Object} amqpConnection - object to connect with rabbitmq.
 * @returns {Promise} - a promise that will fail if rabbitmq is down.
 */
function connect(amqpConnection) {
  return new Promise((resolve, reject) => {
    const conn = new amqp.Connection(amqpConnection);
    conn.on('error', reject);
    conn.on('ready', resolve);
    conn.connect();
  });
}

/**
 * returns a boolean, indicating rabbitmq status.
 * @params {Object} amqpConnection - object to connect with rabbitmq.
 * @returns {boolean} - true if rabbitmq is up, false otherwise.
 */
export default async (amqpConnection) => {
  try {
    await connect(amqpConnection);
    return true;
  } catch (err) {
    return false;
  }
};
