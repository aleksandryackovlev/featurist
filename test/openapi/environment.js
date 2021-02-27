/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const hooks = require('hooks');

hooks.beforeAll((transactions, done) => {
  const { protocol, host, port } = transactions[0];
  const environment = {};

  axios
    .post(`${protocol}//${host}:${port}/admin/v1/auth/login`, {
      username: 'admin',
      password: 'test',
    })
    .then((res) => {
      environment.baseUrl = `${protocol}//${host}:${port}`;
      environment.token = res.data.data.access_token;

      transactions.forEach((transaction) => {
        if (
          transaction.expected.headers['Content-Type'] === 'application/json'
        ) {
          transaction.expected.headers['Content-Type'] =
            'application/json; charset=utf-8';
        }

        transaction.environment = environment;

        transaction.request.headers[
          'Authorization'
        ] = `Bearer ${environment.token}`;
      });

      done();
    })
    .catch(done);
});
