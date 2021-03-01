/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const axios = require('axios');
const hooks = require('hooks');

hooks.after(
  '/admin/v1/roles > Create role > 201 > application/json',
  (transaction, done) => {
    axios({
      url: `${transaction.environment.baseUrl}/admin/v1/roles/${
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
  '/admin/v1/roles/{id} > Delete role > 200 > application/json',
  (transaction, done) => {
    axios({
      url: `${transaction.environment.baseUrl}/admin/v1/roles`,
      method: 'POST',
      data: {
        name: 'roleName',
        description: '<p>Role description</p>',
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
  '/admin/v1/roles > Find roles by params > 400 > application/json',
  (transaction, done) => {
    transaction.fullPath = `${transaction.fullPath}&offset=-1`;
    transaction.request.uri = transaction.fullPath;
    done();
  },
);

hooks.before(
  '/admin/v1/roles > Create role > 400 > application/json',
  (transaction, done) => {
    const { name, ...invalidDto } = JSON.parse(transaction.request.body);
    transaction.request.body = JSON.stringify(invalidDto);
    done();
  },
);

hooks.before(
  '/admin/v1/roles/{id} > Get role by id > 400 > application/json',
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
  '/admin/v1/roles/{id} > Update role > 400 > application/json',
  (transaction, done) => {
    transaction.request.body = '';
    done();
  },
);

hooks.before(
  '/admin/v1/roles/{id} > Delete role > 400 > application/json',
  (transaction, done) => {
    transaction.fullPath = transaction.fullPath.replace(
      '977a3934-ee5f-4a6f-beed-42a7529ce648',
      'invalid-id',
    );
    transaction.request.uri = transaction.fullPath;
    done();
  },
);
