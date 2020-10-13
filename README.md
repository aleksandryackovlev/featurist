# Feature toggle service

## Requirements
node.js >= 12
PostgreSQL >= 11
etcd 3
docker
docker-compose
make

## Running the app

```bash
# development
$ make start-dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
