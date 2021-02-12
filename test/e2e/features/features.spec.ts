describe('Features', () => {
  describe('GET /applications/:appId/features', () => {
    it('should throw an 400 if appId is not a valid uuid', async () => {
      const result = await app.get('/applications/some-id/features').set({
        Authorization: `Bearer ${credentials.adminToken}`,
      });

      expect(result.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed (uuid  is expected)',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should throw an 403 if the current user is not allowed to read applications', async () => {
      const result = await app
        .get(`/applications/${entities.applications[0].id}/features`)
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should throw an 403 if the current user is not allowed to read features', async () => {
      const result = await app
        .get(`/applications/${entities.applications[0].id}/features`)
        .set({
          Authorization: `Bearer ${credentials.developerToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should return 404 error if an application with the given id does not exist', async () => {
      const result = await app
        .get('/applications/c6101e77-9bb8-4756-9720-82656d1b92a5/features')
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: 'Entity does not exist',
      });
      expect(result.statusCode).toEqual(404);
    });

    it('should return a list of available features of the given aplication', async () => {
      const application = entities.applications.find(({ users }) =>
        users.some(({ username }) => username == 'admin'),
      );

      const result = await app
        .get(`/applications/${application.id}/features`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        data: application.features.sort((first, second) =>
          new Date(first.updatedAt) > new Date(second.updatedAt) ? -1 : 1,
        ),
        total: application.features.length,
      });
      expect(result.statusCode).toEqual(200);
    });
  });

  describe('GET /applications/:appId/features/:id', () => {
    it('should return 403 error if current user is not allowed to read applications', async () => {
      const result = await app
        .get(
          `/applications/${entities.applications[0].id}/features/${entities.applications[0].features[0].id}`,
        )
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should throw an 403 if the current user is not allowed to read features', async () => {
      const result = await app
        .get(
          `/applications/${entities.applications[0].id}/features/${entities.applications[0].features[0].id}`,
        )
        .set({
          Authorization: `Bearer ${credentials.developerToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should return 404 error if an application with the given id does not exist', async () => {
      const result = await app
        .get(
          `/applications/c6101e77-9bb8-4756-9720-82656d1b92a5/features/${entities.applications[0].features[0].id}`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: 'Entity does not exist',
      });
      expect(result.statusCode).toEqual(404);
    });

    it('should return 404 error if a feature with the given id does not exist', async () => {
      const result = await app
        .get(
          `/applications/${entities.applications[0].id}/features/c6101e77-9bb8-4756-9720-82656d1b92a5`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: 'Entity does not exist',
      });
      expect(result.statusCode).toEqual(404);
    });

    it('should return 400 error if the given appId is not a valid uuid', async () => {
      const result = await app
        .get(
          `/applications/some-id/features/${entities.applications[0].features[0].id}`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed (uuid  is expected)',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should return 400 error if the given feature id is not a valid uuid', async () => {
      const result = await app
        .get(`/applications/${entities.applications[0].id}/features/some-id`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed (uuid  is expected)',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should return the feature with the given id', async () => {
      const application = entities.applications.find(({ users }) =>
        users.some(({ username }) => username == 'admin'),
      );

      const result = await app
        .get(
          `/applications/${application.id}/features/${application.features[0].id}`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        data: application.features[0],
      });
      expect(result.statusCode).toEqual(200);
    });
  });

  describe('POST /applications/:appId/features', () => {
    it('should throw an 400 if invalid body is sent', async () => {
      const result = await app
        .post(`/applications/${entities.applications[0].id}/features`)
        .send({ description: 'Some description', name: 'test flag' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 400,
        message: ['name should contain only letters digits and -._ symbols'],
        error: 'Bad Request',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should throw an 400 if empty body is sent', async () => {
      const result = await app
        .post(`/applications/${entities.applications[0].id}/features`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
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
        error: 'Bad Request',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should return 403 error if current user is not allowed to read applications', async () => {
      const result = await app
        .post(`/applications/${entities.applications[0].id}/features`)
        .send({ description: 'Some description', name: 'test' })
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should throw an 403 if the current user is not allowed to create features', async () => {
      const result = await app
        .post(`/applications/${entities.applications[0].id}/features`)
        .send({ description: 'Some description', name: 'test' })
        .set({
          Authorization: `Bearer ${credentials.developerToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should create a new feature and return it', async () => {
      const application = entities.applications.find(({ users }) =>
        users.some(({ username }) => username == 'admin'),
      );

      const result = await app
        .post(`/applications/${application.id}/features`)
        .send({ description: 'Some description', name: 'test.feature_a' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.status).toEqual(201);
      expect(Object.keys(result.body.data).sort()).toEqual(
        Object.keys(application.features[0]).sort(),
      );
      expect(result.body.data).toMatchObject({
        description: 'Some description',
        name: 'test.feature_a',
      });

      await app
        .delete(
          `/applications/${application.id}/features/${result.body.data.id}`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });
    });
  });

  describe('PUT /applications/:appId/features/:id', () => {
    it('should throw an 400 if invalid body is sent', async () => {
      const result = await app
        .put(
          `/applications/${entities.applications[0].id}/features/${entities.applications[0].features[0].id}`,
        )
        .send({ name: 'test_feature_1' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
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
        error: 'Bad Request',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should return 400 error if the given appId is not a valid uuid', async () => {
      const result = await app
        .put(
          `/applications/app-1/features/${entities.applications[0].features[0].id}`,
        )
        .send({ description: 'test_feature_1', isEnabled: true })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed (uuid  is expected)',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should return 400 error if the given feature id is not a valid uuid', async () => {
      const result = await app
        .put(
          `/applications/app-1/features/${entities.applications[0].features[0].id}`,
        )
        .send({ description: 'test_feature_1', isEnabled: true })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed (uuid  is expected)',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should return 403 error if current user is not allowed to read applications', async () => {
      const result = await app
        .put(
          `/applications/${entities.applications[0].id}/features/${entities.applications[0].features[0].id}`,
        )
        .send({ description: 'test_feature_1', isEnabled: true })
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should throw an 403 if the current user is not allowed to update features', async () => {
      const result = await app
        .put(
          `/applications/${entities.applications[0].id}/features/${entities.applications[0].features[0].id}`,
        )
        .send({ description: 'test_feature_1', isEnabled: true })
        .set({
          Authorization: `Bearer ${credentials.developerToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should return 404 error if an application with the given id does not exist', async () => {
      const result = await app
        .put(
          `/applications/c6101e77-9bb8-4756-9720-82656d1b92a5/features/${entities.applications[0].features[0].id}`,
        )
        .send({ description: 'test_feature_1', isEnabled: true })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: 'Entity does not exist',
      });
      expect(result.statusCode).toEqual(404);
    });

    it('should return 404 error if a feature with the given id does not exist', async () => {
      const result = await app
        .put(
          `/applications/${entities.applications[0].id}/features/c6101e77-9bb8-4756-9720-82656d1b92a5`,
        )
        .send({ description: 'test_feature_1', isEnabled: true })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: 'Entity does not exist',
      });
      expect(result.statusCode).toEqual(404);
    });

    it('should update a feature and return it', async () => {
      const application = entities.applications.find(({ users }) =>
        users.some(({ username }) => username == 'admin'),
      );

      const created = await app
        .post(`/applications/${application.id}/features`)
        .send({ description: 'Some description', name: 'test_feature' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      const result = await app
        .put(
          `/applications/${application.id}/features/${created.body.data.id}`,
        )
        .send({ description: 'Some new description', isEnabled: false })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.status).toEqual(200);
      expect(result.body.data).toMatchObject({
        description: 'Some new description',
        isEnabled: false,
      });

      await app
        .delete(
          `/applications/${application.id}/features/${created.body.data.id}`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });
    });
  });

  describe('POST /applications/:appId/features/:id/enable', () => {
    it('should return 400 error if the given appId is not a valid uuid', async () => {
      const result = await app
        .post(
          `/applications/app-id/features/${entities.applications[0].features[0].id}/enable`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed (uuid  is expected)',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should return 400 error if the given feature id is not a valid uuid', async () => {
      const result = await app
        .post(`/applications/${entities.applications[0].id}/features/feature-id/enable`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed (uuid  is expected)',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should return 403 error if current user is not allowed to read applications', async () => {
      const result = await app
        .post(
          `/applications/${entities.applications[0].id}/features/${entities.applications[0].features[0].id}/enable`,
        )
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`,
        });

      expect(result.body).toEqual({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should throw an 403 if the current user is not allowed to update features', async () => {
      const result = await app
        .post(
          `/applications/${entities.applications[0].id}/features/${entities.applications[0].features[0].id}/enable`,
        )
        .set({
          Authorization: `Bearer ${credentials.developerToken}`,
        });

      expect(result.body).toEqual({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should return 404 error if an application with the given id does not exist', async () => {
      const result = await app
        .post(
          `/applications/c6101e77-9bb8-4756-9720-82656d1b92a5/features/${entities.applications[0].features[0].id}/enable`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
      });
      expect(result.statusCode).toEqual(404);
    });

    it('should return 404 error if a feature with the given id does not exist', async () => {
      const result = await app
        .post(
          `/applications/${entities.applications[0].id}/features/c6101e77-9bb8-4756-9720-82656d1b92a5/enable`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
      });
      expect(result.statusCode).toEqual(404);
    });

    it('should update a feature and return it', async () => {
      const application = entities.applications.find(({ users }) =>
        users.some(({ username }) => username == 'admin'),
      );

      const created = await app
        .post(`/applications/${application.id}/features`)
        .send({ description: 'Some description', name: 'test_feature' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      const result = await app
        .post(
          `/applications/${application.id}/features/${created.body.data.id}/enable`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.status).toEqual(201);
      expect(result.body.data).toMatchObject({
        description: 'Some description',
        isEnabled: true,
      });

      await app
        .delete(
          `/applications/${application.id}/features/${created.body.data.id}`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });
    });
  });

  describe('POST /applications/:appId/features/:id/disable', () => {
    it('should return 400 error if the given appId is not a valid uuid', async () => {
      const result = await app
        .post(
          `/applications/app-id/features/${entities.applications[0].features[0].id}/disable`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should return 400 error if the given feature id is not a valid uuid', async () => {
      const result = await app
        .post(`/applications/${entities.applications[0].id}/features/feature-id/disable`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should return 403 error if current user is not allowed to read applications', async () => {
      const result = await app
        .post(
          `/applications/${entities.applications[0].id}/features/${entities.applications[0].features[0].id}/disable`,
        )
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`,
        });

      expect(result.body).toEqual({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should throw an 403 if the current user is not allowed to update features', async () => {
      const result = await app
        .post(
          `/applications/${entities.applications[0].id}/features/${entities.applications[0].features[0].id}/disable`,
        )
        .set({
          Authorization: `Bearer ${credentials.developerToken}`,
        });

      expect(result.body).toEqual({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should return 404 error if an application with the given id does not exist', async () => {
      const result = await app
        .post(
          `/applications/c6101e77-9bb8-4756-9720-82656d1b92a5/features/${entities.applications[0].features[0].id}/disable`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
      });
      expect(result.statusCode).toEqual(404);
    });

    it('should return 404 error if a feature with the given id does not exist', async () => {
      const result = await app
        .post(
          `/applications/${entities.applications[0].id}/features/c6101e77-9bb8-4756-9720-82656d1b92a5/disable`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
      });
      expect(result.statusCode).toEqual(404);
    });

    it('should update a feature and return it', async () => {
      const application = entities.applications.find(({ users }) =>
        users.some(({ username }) => username == 'admin'),
      );

      const created = await app
        .post(`/applications/${application.id}/features`)
        .send({ description: 'Some description', name: 'test_feature' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      const result = await app
        .post(
          `/applications/${application.id}/features/${created.body.data.id}/disable`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.status).toEqual(201);
      expect(result.body.data).toMatchObject({
        description: 'Some description',
        isEnabled: false,
      });

      await app
        .delete(
          `/applications/${application.id}/features/${created.body.data.id}`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });
    });
  });

  describe('DELETE /applications/:appId/features/:id', () => {
    it('should return 400 error if the given appId is not a valid uuid', async () => {
      const result = await app
        .delete(`/applications/app-1/features/${entities.applications[0].features[0].id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should return 400 error if the given feature id is not a valid uuid', async () => {
      const result = await app
        .delete(`/applications/${entities.applications[0].id}/features/app-1`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should return 403 error if current user is not allowed to read applications', async () => {
      const result = await app
        .delete(
          `/applications/${entities.applications[0].id}/features/${entities.applications[0].features[0].id}`,
        )
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`,
        });

      expect(result.body).toEqual({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should throw an 403 if the current user is not allowed to delete features', async () => {
      const result = await app
        .delete(
          `/applications/${entities.applications[0].id}/features/${entities.applications[0].features[0].id}`,
        )
        .set({
          Authorization: `Bearer ${credentials.developerToken}`,
        });

      expect(result.body).toEqual({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should return 404 error if an application with the given id does not exist', async () => {
      const result = await app
        .delete(
          `/applications/c6101e77-9bb8-4756-9720-82656d1b92a5/features/${entities.applications[0].features[0].id}`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
      });
      expect(result.statusCode).toEqual(404);
    });

    it('should return 404 error if a feature with the given id does not exist', async () => {
      const result = await app
        .delete(
          `/applications/${entities.applications[0].id}/features/c6101e77-9bb8-4756-9720-82656d1b92a5`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
      });
      expect(result.statusCode).toEqual(404);
    });

    it('should delete a feature and return it', async () => {
      const application = entities.applications.find(({ users }) =>
        users.some(({ username }) => username == 'admin'),
      );

      const created = await app
        .post(`/applications/${application.id}/features`)
        .send({ description: 'Some description', name: 'test_feature' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      const result = await app
        .delete(
          `/applications/${application.id}/features/${created.body.data.id}`,
        )
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.status).toEqual(200);
      expect(result.body.data).toMatchObject(created.body.data);
    });
  });
});
