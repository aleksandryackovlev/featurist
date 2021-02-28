/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const axios = require('axios');
const hooks = require('hooks');

hooks.after(
  '/admin/v1/applications > Create application > 201 > application/json',
  (transaction, done) => {
    axios({
      url: `${transaction.environment.baseUrl}/admin/v1/applications/${
        JSON.parse(transaction.real.body).data.id
      }`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${transaction.environment.token}`,
      },
    })
      .then(done)
      .catch(done);
  },
);

hooks.before(
  '/admin/v1/applications/{id} > Delete application > 200 > application/json',
  (transaction, done) => {
    axios({
      url: `${transaction.environment.baseUrl}/admin/v1/applications`,
      method: 'POST',
      data: {
        name: 'Some application name',
        description: '<p>Some application description</p>',
      },
      headers: {
        Authorization: `Bearer ${transaction.environment.token}`,
      },
    })
      .then((res) => {
        transaction.fullPath = transaction.fullPath.replace(
          '977a3934-ee5f-4a6f-beed-42a7529ce648',
          res.data.data.id,
        );
        transaction.request.uri = transaction.fullPath;
        transaction.environment.id = res.data.data.id;
        done();
      })
      .catch(done);
  },
);

// 400 errors
hooks.before(
  '/admin/v1/applications > Find applications by params > 400 > application/json',
  (transaction, done) => {
    transaction.fullPath = `${transaction.fullPath}&offset=-1`;
    transaction.request.uri = transaction.fullPath;
    done();
  },
);

hooks.before(
  '/admin/v1/applications > Create application > 400 > application/json',
  (transaction, done) => {
    const { name, ...invalidDto } = JSON.parse(transaction.request.body);
    transaction.request.body = JSON.stringify(invalidDto);
    done();
  },
);

hooks.before(
  '/admin/v1/applications/{id} > Get application by id > 400 > application/json',
  (transaction, done) => {
    transaction.fullPath = transaction.fullPath.replace(
      '977a3934-ee5f-4a6f-beed-42a7529ce648',
      'invalid-id',
    );
    transaction.request.uri = transaction.fullPath;
    done();
  },
);

hooks.before(
  '/admin/v1/applications/{id} > Update application > 400 > application/json',
  (transaction, done) => {
    transaction.request.body = '';
    done();
  },
);

hooks.before(
  '/admin/v1/applications/{id} > Delete application > 400 > application/json',
  (transaction, done) => {
    transaction.fullPath = transaction.fullPath.replace(
      '977a3934-ee5f-4a6f-beed-42a7529ce648',
      'invalid-id',
    );
    transaction.request.uri = transaction.fullPath;
    done();
  },
);
