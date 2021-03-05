describe('Features', () => {
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

    it('should throw an 400 if feature with the given name already exists', async () => {
      const application = entities.applications.find(({ users }) =>
        users.some(({ username }) => username == 'admin'),
      );

      const result = await app
        .post(`/applications/${application.id}/features`)
        .send({ description: 'Some description', name: application.features[0].name })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 400,
        message: 'Feature already exists',
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
});
