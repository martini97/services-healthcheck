# services-healthcheck  
[![Build Status](https://travis-ci.org/martini97/healthcheck-middleware.svg?branch=master)](https://travis-ci.org/martini97/healthcheck-middleware)  
Simple module to check the health status of a service dependencies

## Installing
To install it, just use npm:  
`npm i services-healthcheck`

## Usage

### Parameters
- `services`:  
  An object mapping the service name to its URL or to it's URL getter, the service must have a /_ping route.

```js  
const express = require('express');
const healthcheck = require('services-healthcheck').default;

const getRandomArbitrary = (min, max) => {
  return Math.random() * (max - min) + min;
};

const getServiceUrl = () => return `http://service-{getRandomArbitrary(5, 10)}`;

const services = {
  'service-1': 'http://service-1',
  'service-2': 'http://service-2',
  'service-3': 'http://service-3',
  'service-4': 'http://service-4',
  'service-5': { url: 'http://service-custom-ping', route: '/health/_ping' },
  'service-x': getServiceUrl,
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
