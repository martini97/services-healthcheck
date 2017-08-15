# CONTRIBUTING
Anyone is welcome to contribute with this project, and every contribution is welcome, be it an issue, tips or code.
But if you are going to contribute with code, please write tests.

### Running tests
This project uses [AVA](https://github.com/avajs/ava) for testing.  
```bash
$ npm test
```  
You will notice that some tests are being skipped, because they test connections with rabbitmq, and I haven't found a way to mock it yet,
if you want to run those tests you can use a docker image to run rabbitmq locally:
```bash
$ docker run -d --hostname my-rabbit --name some-rabbit -p 5672:5672 -p 15672:15672 rabbitmq
```
Or you can install and run rabbitmq on your machine. 
