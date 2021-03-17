/* eslint-disable @typescript-eslint/no-var-requires */
const hooks = require('hooks');

hooks.before(
  '/admin/v1/auth/login > Login > 401 > application/json',
  (transaction, done) => {
    transaction.request.body = JSON.stringify({
      ...transaction.request.body,
      username: 'someUsername',
    });
    done();
  },
);
