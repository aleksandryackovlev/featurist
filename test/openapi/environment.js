/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const hooks = require('hooks');

hooks.beforeAll((transactions, done) => {
  const { protocol, host, port } = transactions[0];
  const environment = {};

  Promise.all([
    axios.post(`${protocol}//${host}:${port}/admin/v1/auth/login`, {
      username: 'admin',
      password: 'test',
    }),
    axios.post(`${protocol}//${host}:${port}/admin/v1/auth/login`, {
      username: 'manager',
      password: 'test',
    }),
  ])
    .then(([fullAccessUser, restrictedUser]) => {
      environment.baseUrl = `${protocol}//${host}:${port}`;
      environment.token = fullAccessUser.data.data.access_token;

      transactions.forEach((transaction) => {
        if (
          transaction.expected.headers['Content-Type'] === 'application/json'
        ) {
          transaction.expected.headers['Content-Type'] =
            'application/json; charset=utf-8';
        }

        transaction.environment = environment;

        if (transaction.expected.statusCode !== '401') {
          transaction.request.headers[
            'Authorization'
          ] = `Bearer ${environment.token}`;
        }

        if (transaction.expected.statusCode === '403') {
          transaction.request.headers[
            'Authorization'
          ] = `Bearer ${restrictedUser.data.data.access_token}`;
        }

        if (transaction.expected.statusCode === '404') {
          transaction.fullPath = transaction.fullPath.replace(
            '977a3934-ee5f-4a6f-beed-42a7529ce648',
            '977a3934-ee5f-4a6f-beed-42a7529ce646',
          );

          transaction.request.uri = transaction.request.uri.replace(
            '977a3934-ee5f-4a6f-beed-42a7529ce648',
            '977a3934-ee5f-4a6f-beed-42a7529ce646',
          );
        }

        if (transaction.expected.statusCode === '500') {
          transaction.skip = true;
        }
      });

      done();
    })
    .catch(done);
});
