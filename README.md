# healthcheck-middleware  
[![Build Status](https://travis-ci.org/martini97/healthcheck-middleware.svg?branch=master)](https://travis-ci.org/martini97/healthcheck-middleware)  
Simple module to check the health status of a service dependencies

## Usage

### Parameters
- `services`: an object mapping the service name to its URL, the service must have a /_ping route.

```js  
const express = require('express');
const healthcheck = require('@martini97/healthcheck-middleware').default;

const servicesAllUp = {
  'service-1': 'http://service-1',
  'service-2': 'http://service-2',
  'service-3': 'http://service-3',
  'service-4': 'http://service-4',
};

async function application() {
  const app = express();
  app.use(await healthcheck(servicesAllUp));
  return app;
};

async function start() {
  const app = await application();
  app.listen(3000, () => console.log('http://localhost:3000'));
}

start();
```
