import * as request from 'supertest';

const app = request('http://localhost:3000');

describe('Applications', () => {
  let adminToken = '';
  let developerToken = '';
  let restrictedUserToken = '';

  const appsList = [
    {
      id: 'c6101e77-9bb8-4756-9720-82677d1b92a5',
      createdAt: '2021-02-02T13:52:51.084Z',
      updatedAt: '2021-02-02T13:52:51.084Z',
      name: 'application_1',
      description: '<p>Enim qui odit voluptates labore et omnis nisi veritatis. Odit aut et. Incidunt fugiat minima ea. Atque quia quam sed voluptatem.</p>'
    },
    {
      id: '71c02296-5418-4cdd-ace3-3886ae6cdcb3',
      createdAt: '2021-01-02T13:52:51.065Z',
      updatedAt: '2021-01-02T13:52:51.065Z',
      name: 'application_2',
      description: '<p>Quo minima recusandae minus error qui quod nihil et doloribus. Aspernatur aut sed expedita quis consectetur eveniet. Vitae aperiam quibusdam ab in est est illo. Ut tempora laudantium consequatur quasi eaque aliquam. Voluptate incidunt vitae alias facilis sit quia. Delectus ipsum qui molestiae rem quia eum aliquam.</p>'
    }
  ];

  beforeAll(async () => {
    const [admin, developer, restrictedUser] = await Promise.all([
      app
        .post('/auth/login')
        .send({ username: 'admin', password: 'test' }),
      app
        .post('/auth/login')
        .send({ username: 'developer', password: 'test' }),
      app
        .post('/auth/login')
        .send({ username: 'manager', password: 'test' }),
    ]);

    adminToken = admin.body.data.access_token;
    developerToken = developer.body.data.access_token;
    restrictedUserToken = restrictedUser.body.data.access_token;
  });

  describe('GET /applications', () => {
    it('should throw an 403 if the current user is not allowed to read applications', () => {
      return app
        .get('/applications')
        .set({
          Authorization: `Bearer ${restrictedUserToken}`
        })
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })
        .expect(403);
    });

    it('should return a list of available applications', () => {
      return app
        .get('/applications')
        .set({
          Authorization: `Bearer ${adminToken}`
        })
        .expect({
          data: appsList,
          total: appsList.length,
        })
        .expect(200);
    });
  });

  describe('POST /applications', () => {
    it('should throw an 400 if invalid body is sent', () => {
      return app
        .post('/applications')
        .send({ description: 'Some description', test: 'test' })
        .set({
          Authorization: `Bearer ${adminToken}`
        })
        .expect({
          statusCode: 400,
          message: [
            'property test should not exist',
            'name must be a string',
            'name should not be empty'
          ],
          error: 'Bad Request'
        })
        .expect(400);
    });
  });

  describe('PUT /applications/:id', () => {
    it('should throw an 400 if invalid body is sent', () => {
      return app
        .put('/applications/app-1')
        .send({})
        .set({
          Authorization: `Bearer ${adminToken}`
        })
        .expect({
          statusCode: 400,
          message: [
            'name should not be empty',
            'name must be a string',
            'description should not be empty',
            'description must be a string'
          ],
          error: 'Bad Request'
        })
        .expect(400);
    });
  });
});
