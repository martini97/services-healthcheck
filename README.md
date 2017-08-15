# services-healthcheck  
[![Build Status](https://travis-ci.org/martini97/services-healthcheck.svg?branch=master)](https://travis-ci.org/martini97/services-healthcheck)  
Simple module to check the health status of a service dependencies

## Installing
To install it, just use npm:  
`npm i services-healthcheck`

## Usage

### Parameters
- `services`:  
  An object mapping the service name to its URL or to it's URL getter (the service must have a /_ping route), or to a knex connection.
	Supported DB's: Postgres, MSSQL, MySQL, MariaDB, SQLite3, and Oracle.

```js  
const express = require('express');
const knex = require('knex');
const healthcheck = require('services-healthcheck').default;

const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

const getServiceUrl = () => return `http://service-{getRandomArbitrary(5, 10)}`;

const knexInstance = knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'database',
    port: 3306,
  },
  debug: false,
});

const services = {
  'service-1': 'http://service-1',
  'service-2': 'http://service-2',
  'service-3': 'http://service-3',
  'service-4': 'http://service-4',
  'service-5': { url: 'http://service-custom-ping', route: '/health/_ping' },
  'service-x': getServiceUrl,
  'db-1':      { knex: knexInstance },
  'queue-1':   { queue: { host: 'localhost', port: '5672' } }
};

function application() {
  const app = express();
  app.use(healthcheck(services));
  return app;
};

async function start() {
  const app = await application();
  app.listen(3000, () => console.log('http://localhost:3000'));
}

start();
```

After that, it will add a /_health route, that returns the status of the services passed

## Contributing

Anyone is welcome to contribute, with issues, tips, or code.
If you want to run the tests you can use `npm test`, however you will notice that some tests are skipped,
this is because I couldn't mock the amqp. If you wish to run those tests, you will need an instance
running locally. You can do this by installing and running rabbitmq or by using docker:  
`$ docker run -d --name amqp.test -p 5672:5672 rabbitmq`  
After that, just remove the `.skip` from the test and run `npm test`.
