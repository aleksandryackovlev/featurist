import app from '../request';

describe('Features', () => {
  let adminToken = '';
  let developerToken = '';
  let restrictedUserToken = '';

  const appsList = [
    {
      id: 'c6101e77-9bb8-4756-9720-82677d1b92a5',
      createdAt: '2021-02-02T13:52:51.084Z',
      updatedAt: '2021-02-02T13:52:51.084Z',
      name: 'application_1',
      description:
        '<p>Enim qui odit voluptates labore et omnis nisi veritatis. Odit aut et. Incidunt fugiat minima ea. Atque quia quam sed voluptatem.</p>',
      features: [
        {
          id: 'c78438ad-6664-463c-8839-ccf1d02cdddd',
          createdAt: '2021-01-04T13:27:42.888Z',
          updatedAt: '2021-01-04T13:27:42.888Z',
          name: 'architecto-est-consequatur',
          description:
            'Esse iusto tenetur quis non atque qui molestiae sed. Enim architecto aperiam magnam nulla. Eveniet assumenda ut. Soluta cumque impedit dolore nihil perspiciatis officiis voluptas similique nihil.',
          isEnabled: true,
          applicationId: 'c6101e77-9bb8-4756-9720-82677d1b92a5',
        },
        {
          id: 'ce653ea2-cd0d-452a-99da-b906c8d9b90a',
          createdAt: '2021-01-17T13:27:42.877Z',
          updatedAt: '2021-01-17T13:27:42.877Z',
          name: 'recusandae-natus-nisi',
          description:
            'Incidunt et rerum esse et soluta quisquam quia. Non itaque ut est reiciendis aut voluptatem. Hic ut error porro eum natus.',
          isEnabled: true,
          applicationId: 'c6101e77-9bb8-4756-9720-82677d1b92a5',
        },
        {
          id: '14d1e30a-e9c3-48cf-a0b8-82fd52ab4ebf',
          createdAt: '2021-02-04T13:27:42.870Z',
          updatedAt: '2021-02-04T13:27:42.870Z',
          name: 'magnam-cumque-nulla',
          description:
            'Facere iste alias ut eveniet autem voluptate. Qui est aut. At ut harum ut.',
          isEnabled: false,
          applicationId: 'c6101e77-9bb8-4756-9720-82677d1b92a5',
        },
      ],
    },
    {
      id: '71c02296-5418-4cdd-ace3-3886ae6cdcb3',
      createdAt: '2021-01-02T13:52:51.065Z',
      updatedAt: '2021-01-02T13:52:51.065Z',
      name: 'application_2',
      description:
        '<p>Quo minima recusandae minus error qui quod nihil et doloribus. Aspernatur aut sed expedita quis consectetur eveniet. Vitae aperiam quibusdam ab in est est illo. Ut tempora laudantium consequatur quasi eaque aliquam. Voluptate incidunt vitae alias facilis sit quia. Delectus ipsum qui molestiae rem quia eum aliquam.</p>',
      features: [],
    },
  ];

  beforeAll(async () => {
    const [admin, developer, restrictedUser] = await Promise.all([
      app.post('/auth/login').send({ username: 'admin', password: 'test' }),
      app.post('/auth/login').send({ username: 'developer', password: 'test' }),
      app.post('/auth/login').send({ username: 'manager', password: 'test' }),
    ]);

    adminToken = admin.body.data.access_token;
    restrictedUserToken = restrictedUser.body.data.access_token;
    developerToken = developer.body.data.access_token;
  });

  describe('GET /applications/:appId/features', () => {
    it('should throw an 400 if appId is not a valid uuid', () => {
      return app
        .get('/applications/some-id/features')
        .set({
          Authorization: `Bearer ${adminToken}`
        })
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
        })
        .expect(400);
    });

    it('should throw an 403 if the current user is not allowed to read applications', () => {
      return app
        .get(`/applications/${appsList[0].id}/features`)
        .set({
          Authorization: `Bearer ${restrictedUserToken}`,
        })
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })
        .expect(403);
    });

    it('should throw an 403 if the current user is not allowed to read features', () => {
      return app
        .get(`/applications/${appsList[0].id}/features`)
        .set({
          Authorization: `Bearer ${developerToken}`,
        })
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })
        .expect(403);
    });

    it('should return 404 error if an application with the given id does not exist', () => {
      return app
        .get('/applications/c6101e77-9bb8-4756-9720-82656d1b92a5/features')
        .set({
          Authorization: `Bearer ${adminToken}`
        })
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
        })
        .expect(404);
    });

    it('should return a list of available features of the given aplication', () => {
      return app
        .get(`/applications/${appsList[0].id}/features`)
        .set({
          Authorization: `Bearer ${adminToken}`,
        })
        .expect({
          data: appsList[0].features.sort((first, second) => first.updatedAt > second.updatedAt ? -1 : 1),
          total: appsList[0].features.length,
        })
        .expect(200);
    });
  });
});
