/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const axios = require('axios');
const hooks = require('hooks');

hooks.after(
  '/admin/v1/users > Create user > 201 > application/json',
  (transaction, done) => {
    console.log(transaction.real.body);
    axios({
      url: `${transaction.environment.baseUrl}/admin/v1/users/${
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
  '/admin/v1/users/{id} > Delete user > 200 > application/json',
  (transaction, done) => {
    axios({
      url: `${transaction.environment.baseUrl}/admin/v1/users`,
      method: 'POST',
      data: {
        username: 'someUserName1',
        password: 'testfdsfs',
        roleId: '977a3934-ee5f-4a6f-beed-42a7529ce648',
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
  '/admin/v1/users > Find users by params > 400 > application/json',
  (transaction, done) => {
    transaction.fullPath = `${transaction.fullPath}&offset=-1`;
    transaction.request.uri = transaction.fullPath;
    done();
  },
);

hooks.before(
  '/admin/v1/users > Create user > 400 > application/json',
  (transaction, done) => {
    const { roleId, ...invalidDto } = JSON.parse(transaction.request.body);
    transaction.request.body = JSON.stringify(invalidDto);
    done();
  },
);

hooks.before(
  '/admin/v1/users/{id} > Get user by id > 400 > application/json',
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
  '/admin/v1/users/{id} > Update user > 400 > application/json',
  (transaction, done) => {
    transaction.request.body = '';
    done();
  },
);

hooks.before(
  '/admin/v1/users/{id} > Delete user > 400 > application/json',
  (transaction, done) => {
    transaction.fullPath = transaction.fullPath.replace(
      '977a3934-ee5f-4a6f-beed-42a7529ce648',
      'invalid-id',
    );
    transaction.request.uri = transaction.fullPath;
    done();
  },
);
