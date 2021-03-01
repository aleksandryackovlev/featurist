/* eslint-disable @typescript-eslint/no-var-requires */
const hooks = require('hooks');

hooks.beforeAll((transactions, done) => {
  const { protocol, host, port } = transactions[0];

  transactions.forEach((transaction) => {
    if (transaction.expected.headers['Content-Type'] === 'application/json') {
      transaction.expected.headers['Content-Type'] =
        'application/json; charset=utf-8';
    }
    

    transaction.environment = {
      baseUrl: `${protocol}//${host}:${port}`,
    };

    if (transaction.expected.statusCode === '400') {
      transaction.request.headers = {
        ...transaction.request.headers,
        'X-Application-ID': 'invalid-id'
      };
    }

    if (transaction.expected.statusCode === '404') {
      transaction.request.headers = {
        ...transaction.request.headers,
        'X-Application-ID': '977a3934-ee5f-4a6f-beed-42a7529ce646'
      };
    }

    if (transaction.expected.statusCode === '500') {
      transaction.skip = true;
    }
  });

  done();
});
