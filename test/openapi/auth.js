const axios = require('axios')
const hooks = require('hooks');

const stash = {}

hooks.beforeAll((transactions, done) => {
  transactions.forEach((transaction) => {
    if (transaction.expected.headers['Content-Type'] === 'application/json') {
      transaction.expected.headers['Content-Type'] = 'application/json; charset=utf-8';
    }

    if (transaction.expected.statusCode === '400') {
      transaction.skip = true;
    }
  });

  console.log(transactions);
  done(new Error());

  const { protocol, host, port } = transactions[0];

  axios
    .post(`${protocol}//${host}:${port}/admin/v1/auth/login`, {
      username: 'admin',
      password: 'test',
    })
    .then(res => {
      stash.token = res.data.data.access_token;
      done();
    })
    .catch(done)
});

hooks.beforeEach((transaction) => {
  if (stash.token) {
    transaction.request.headers['Authorization'] = `Bearer ${stash.token}`;
  };
});

