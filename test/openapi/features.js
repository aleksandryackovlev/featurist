/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const axios = require('axios');
const hooks = require('hooks');

hooks.after(
  '/admin/v1/applications/{appId}/features > Create feature > 201 > application/json',
  (transaction, done) => {
    axios({
      url: `${transaction.environment.baseUrl}/admin/v1/applications/977a3934-ee5f-4a6f-beed-42a7529ce648/features/${
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
  '/admin/v1/applications/{appId}/features/{id} > Delete feature > 200 > application/json',
  (transaction, done) => {
    axios({
      url: `${transaction.environment.baseUrl}/admin/v1/applications/977a3934-ee5f-4a6f-beed-42a7529ce648/features`,
      method: 'POST',
      data: {
        name: 'featureName',
        description: '<p>Feature description</p>',
      },
      headers: {
        Authorization: `Bearer ${transaction.environment.token}`,
      },
    })
      .then((res) => {
        
        transaction.fullPath = [...transaction.fullPath.split('/').slice(0, -1), res.data.data.id].join('/');
        transaction.request.uri = transaction.fullPath;
        transaction.environment.id = res.data.data.id;
        done();
      })
      .catch(done);
  },
);

// 400 errors
hooks.before(
  '/admin/v1/applications/{appId}/features > Find features by params > 400 > application/json',
  (transaction, done) => {
    transaction.fullPath = `${transaction.fullPath}&offset=-1`;
    transaction.request.uri = transaction.fullPath;
    done();
  },
);

hooks.before(
  '/admin/v1/applications/{appId}/features > Create feature > 400 > application/json',
  (transaction, done) => {
    const { name, ...invalidDto } = JSON.parse(transaction.request.body);
    transaction.request.body = JSON.stringify(invalidDto);
    done();
  },
);

hooks.before(
  '/admin/v1/applications/{appId}/features/{id} > Get feature by id > 400 > application/json',
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
  '/admin/v1/applications/{appId}/features/{id} > Update feature > 400 > application/json',
  (transaction, done) => {
    transaction.request.body = '';
    done();
  },
);

hooks.before(
  '/admin/v1/applications/{appId}/features/{id}/enable > Enable feature > 400 > application/json',
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
  '/admin/v1/applications/{appId}/features/{id}/disable > Disable feature > 400 > application/json',
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
  '/admin/v1/applications/{appId}/features/{id} > Delete feature > 400 > application/json',
  (transaction, done) => {
    transaction.fullPath = transaction.fullPath.replace(
      '977a3934-ee5f-4a6f-beed-42a7529ce648',
      'invalid-id',
    );
    transaction.request.uri = transaction.fullPath;
    done();
  },
);
