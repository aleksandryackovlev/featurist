describe('Features', () => {
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

  describe('GET /applications/:appId/features', () => {
    it.only('should throw an 400 if appId is not a valid uuid', () => {
      return app
        .get('/applications/some-id/features')
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
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
          Authorization: `Bearer ${credentials.restrictedUserToken}`,
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
          Authorization: `Bearer ${credentials.developerToken}`,
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
          Authorization: `Bearer ${credentials.adminToken}`
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
          Authorization: `Bearer ${credentials.adminToken}`,
        })
        .expect({
          data: appsList[0].features.sort((first, second) => first.updatedAt > second.updatedAt ? -1 : 1),
          total: appsList[0].features.length,
        })
        .expect(200);
    });
  });

  describe('GET /applications/:appId/features/:id', () => {
    it('should return 403 error if current user is not allowed to read applications', () => {
      return app
        .get(`/applications/${appsList[0].id}/features/${appsList[0].features[0].id}`)
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`
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
        .get(`/applications/${appsList[0].id}/features/${appsList[0].features[0].id}`)
        .set({
          Authorization: `Bearer ${credentials.developerToken}`,
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
        .get(`/applications/c6101e77-9bb8-4756-9720-82656d1b92a5/features/${appsList[0].features[0].id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
        })
        .expect(404);
    });

    it('should return 404 error if a feature with the given id does not exist', () => {
      return app
        .get(`/applications/${appsList[0].id}/features/c6101e77-9bb8-4756-9720-82656d1b92a5`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
        })
        .expect(404);
    });

    it('should return 400 error if the given appId is not a valid uuid', () => {
      return app
        .get(`/applications/some-id/features/${appsList[0].features[0].id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
        })
        .expect(400);
    });

    it('should return 400 error if the given feature id is not a valid uuid', () => {
      return app
        .get(`/applications/${appsList[0].id}/features/some-id`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
        })
        .expect(400);
    });

    it('should return the feature with the given id', () => {
      return app
        .get(`/applications/${appsList[0].id}/features/${appsList[0].features[0].id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          data: appsList[0].features[0],
        })
        .expect(200);
    });
  });

  describe('POST /applications/:appId/features', () => {
    it('should throw an 400 if invalid body is sent', () => {
      return app
        .post(`/applications/${appsList[0].id}/features`)
        .send({ description: 'Some description', name: 'test flag' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 400,
          message: [ 'name should contain only letters digits and -._ symbols' ],
          error: 'Bad Request'
        })
        .expect(400);
    });

    it('should throw an 400 if empty body is sent', () => {
      return app
        .post(`/applications/${appsList[0].id}/features`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 400,
          message: [
            'name should contain only letters digits and -._ symbols',
            'name must be shorter than or equal to 150 characters',
            'name must be longer than or equal to 5 characters',
            'name must be a string',
            'name should not be empty',
            'description must be shorter than or equal to 1000 characters',
            'description must be longer than or equal to 3 characters',
            'description must be a string',
            'description should not be empty',
          ],
          error: 'Bad Request'
        })
        .expect(400);
    });

    it('should return 403 error if current user is not allowed to read applications', () => {
      return app
        .post(`/applications/${appsList[0].id}/features`)
        .send({ description: 'Some description', name: 'test' })
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`
        })
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })
        .expect(403);
    });

    it('should throw an 403 if the current user is not allowed to create features', () => {
      return app
        .post(`/applications/${appsList[0].id}/features`)
        .send({ description: 'Some description', name: 'test' })
        .set({
          Authorization: `Bearer ${credentials.developerToken}`,
        })
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })
        .expect(403);
    });

    it('should create a new application and return it', async () => {
      const result = await app
        .post(`/applications/${appsList[0].id}/features`)
        .send({ description: 'Some description', name: 'test.feature_a' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      expect(result.status).toEqual(201);
      expect(Object.keys(result.body.data).sort()).toEqual(Object.keys(appsList[0].features[0]).sort());
      expect(result.body.data).toMatchObject({ description: 'Some description', name: 'test.feature_a' });

      await app
        .delete(`/applications/${appsList[0].id}/features/${result.body.data.id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
    });
  });

  describe('PUT /applications/:appId/features/:id', () => {
    it('should throw an 400 if invalid body is sent', () => {
      return app
        .put(`/applications/${appsList[0].id}/features/${appsList[0].features[0].id}`)
        .send({ name: 'test_feature_1' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 400,
          message: [
            'property name should not exist',
            'description must be shorter than or equal to 1000 characters',
            'description must be longer than or equal to 3 characters',
            'description should not be empty',
            'description must be a string',
            'isEnabled should not be empty',
            'isEnabled must be a boolean value',
          ],
          error: 'Bad Request'
        })
        .expect(400);
    });

    it('should return 400 error if the given appId is not a valid uuid', () => {
      return app
        .put(`/applications/app-1/features/${appsList[0].features[0].id}`)
        .send({ description: 'test_feature_1', isEnabled: true })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
        })
        .expect(400);
    });

    it('should return 400 error if the given feature id is not a valid uuid', () => {
      return app
        .put(`/applications/app-1/features/${appsList[0].features[0].id}`)
        .send({ description: 'test_feature_1', isEnabled: true })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
        })
        .expect(400);
    });

    it('should return 403 error if current user is not allowed to read applications', () => {
      return app
        .put(`/applications/${appsList[0].id}/features/${appsList[0].features[0].id}`)
        .send({ description: 'test_feature_1', isEnabled: true })
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`
        })
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })
        .expect(403);
    });

    it('should throw an 403 if the current user is not allowed to update features', () => {
      return app
        .put(`/applications/${appsList[0].id}/features/${appsList[0].features[0].id}`)
        .send({ description: 'test_feature_1', isEnabled: true })
        .set({
          Authorization: `Bearer ${credentials.developerToken}`,
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
        .put(`/applications/c6101e77-9bb8-4756-9720-82656d1b92a5/features/${appsList[0].features[0].id}`)
        .send({ description: 'test_feature_1', isEnabled: true })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
        })
        .expect(404);
    });

    it('should return 404 error if a feature with the given id does not exist', () => {
      return app
        .put(`/applications/${appsList[0].id}/features/c6101e77-9bb8-4756-9720-82656d1b92a5`)
        .send({ description: 'test_feature_1', isEnabled: true })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
        })
        .expect(404);
    });


    it('should update a feature and return it', async () => {

      const created = await app
        .post(`/applications/${appsList[0].id}/features`)
        .send({ description: 'Some description', name: 'test_feature' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      const result = await app
        .put(`/applications/${appsList[0].id}/features/${created.body.data.id}`)
        .send({ description: 'Some new description', isEnabled: false })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      expect(result.status).toEqual(200);
      expect(result.body.data).toMatchObject({ description: 'Some new description', isEnabled: false });

      await app
        .delete(`/applications/${appsList[0].id}/features/${created.body.data.id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });
    });
  });

  describe('POST /applications/:appId/features/:id/enable', () => {
    it('should return 400 error if the given appId is not a valid uuid', () => {
      return app
        .post(`/applications/app-id/features/${appsList[0].features[0].id}/enable`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
        })
        .expect(400);
    });

    it('should return 400 error if the given feature id is not a valid uuid', () => {
      return app
        .post(`/applications/${appsList[0].id}/features/feature-id/enable`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
        })
        .expect(400);
    });

    it('should return 403 error if current user is not allowed to read applications', async () => {
      await app
        .post(`/applications/${appsList[0].id}/features/${appsList[0].features[0].id}/enable`)
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`
        })
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })
        .expect(403);
    });

    it('should throw an 403 if the current user is not allowed to update features', () => {
      return app
        .post(`/applications/${appsList[0].id}/features/${appsList[0].features[0].id}/enable`)
        .set({
          Authorization: `Bearer ${credentials.developerToken}`,
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
        .post(`/applications/c6101e77-9bb8-4756-9720-82656d1b92a5/features/${appsList[0].features[0].id}/enable`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
        })
        .expect(404);
    });

    it('should return 404 error if a feature with the given id does not exist', () => {
      return app
        .post(`/applications/${appsList[0].id}/features/c6101e77-9bb8-4756-9720-82656d1b92a5/enable`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
        })
        .expect(404);
    });


    it('should update a feature and return it', async () => {
      const created = await app
        .post(`/applications/${appsList[0].id}/features`)
        .send({ description: 'Some description', name: 'test_feature' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      const result = await app
        .post(`/applications/${appsList[0].id}/features/${created.body.data.id}/enable`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      expect(result.status).toEqual(201);
      expect(result.body.data).toMatchObject({ description: 'Some description', isEnabled: true });

      await app
        .delete(`/applications/${appsList[0].id}/features/${created.body.data.id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });
    });
  });

  describe('POST /applications/:appId/features/:id/disable', () => {
    it('should return 400 error if the given appId is not a valid uuid', () => {
      return app
        .post(`/applications/app-id/features/${appsList[0].features[0].id}/disable`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
        })
        .expect(400);
    });

    it('should return 400 error if the given feature id is not a valid uuid', () => {
      return app
        .post(`/applications/${appsList[0].id}/features/feature-id/disable`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
        })
        .expect(400);
    });

    it('should return 403 error if current user is not allowed to read applications', async () => {
      await app
        .post(`/applications/${appsList[0].id}/features/${appsList[0].features[0].id}/disable`)
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`
        })
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })
        .expect(403);
    });

    it('should throw an 403 if the current user is not allowed to update features', () => {
      return app
        .post(`/applications/${appsList[0].id}/features/${appsList[0].features[0].id}/disable`)
        .set({
          Authorization: `Bearer ${credentials.developerToken}`,
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
        .post(`/applications/c6101e77-9bb8-4756-9720-82656d1b92a5/features/${appsList[0].features[0].id}/disable`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
        })
        .expect(404);
    });

    it('should return 404 error if a feature with the given id does not exist', () => {
      return app
        .post(`/applications/${appsList[0].id}/features/c6101e77-9bb8-4756-9720-82656d1b92a5/disable`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
        })
        .expect(404);
    });


    it('should update a feature and return it', async () => {
      const created = await app
        .post(`/applications/${appsList[0].id}/features`)
        .send({ description: 'Some description', name: 'test_feature' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      const result = await app
        .post(`/applications/${appsList[0].id}/features/${created.body.data.id}/disable`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      expect(result.status).toEqual(201);
      expect(result.body.data).toMatchObject({ description: 'Some description', isEnabled: false });

      await app
        .delete(`/applications/${appsList[0].id}/features/${created.body.data.id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });
    });
  });

  describe('DELETE /applications/:appId/features/:id', () => {
    it('should return 400 error if the given appId is not a valid uuid', () => {
      return app
        .delete(`/applications/app-1/features/${appsList[0].features[0].id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
        })
        .expect(400);
    });

    it('should return 400 error if the given feature id is not a valid uuid', () => {
      return app
        .delete(`/applications/${appsList[0].id}/features/app-1`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
        })
        .expect(400);
    });

    it('should return 403 error if current user is not allowed to read applications', () => {
      return app
        .delete(`/applications/${appsList[0].id}/features/${appsList[0].features[0].id}`)
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`
        })
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })
        .expect(403);
    });

    it('should throw an 403 if the current user is not allowed to delete features', () => {
      return app
        .delete(`/applications/${appsList[0].id}/features/${appsList[0].features[0].id}`)
        .set({
          Authorization: `Bearer ${credentials.developerToken}`,
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
        .delete(`/applications/c6101e77-9bb8-4756-9720-82656d1b92a5/features/${appsList[0].features[0].id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
        })
        .expect(404);
    });

    it('should return 404 error if a feature with the given id does not exist', () => {
      return app
        .delete(`/applications/${appsList[0].id}/features/c6101e77-9bb8-4756-9720-82656d1b92a5`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
        })
        .expect(404);
    });

    it('should delete a feature and return it', async () => {
      const created = await app
        .post(`/applications/${appsList[0].id}/features`)
        .send({ description: 'Some description', name: 'test_feature' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      const result = await app
        .delete(`/applications/${appsList[0].id}/features/${created.body.data.id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      expect(result.status).toEqual(200);
      expect(result.body.data).toMatchObject(created.body.data);
    });
  });
});
