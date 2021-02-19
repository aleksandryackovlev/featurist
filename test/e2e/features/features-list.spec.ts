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

    it('should not allow to use non-positive offsets and limits', async () => {
      const application = entities.applications.find(({ users }) =>
        users.some(({ username }) => username == 'admin'));

      const result = await app
        .get(`/applications/${application.id}/features`)
        .query({
          offset: -1,
          limit: 0,
        })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        error: 'Bad Request',
        message: [
          'offset must not be less than 1',
          'limit must not be less than 1',
        ],
        statusCode: 400,
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should paginate the result list', async () => {
      const offset = 1;
      const limit = 2;

      const application = entities.applications.find(({ users }) =>
        users.some(({ username }) => username == 'admin'));

      const expected = application.features
        .sort((first, second) => (first.updatedAt > second.updatedAt ? -1 : 1))
        .slice(offset, offset + limit);

      const result = await app
        .get(`/applications/${application.id}/features`)
        .query({
          offset,
          limit,
        })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body.data).toEqual(expected);
      expect(result.body.total).toEqual(application.features.length);
      expect(result.statusCode).toEqual(200);
    });

    it('should not allow to use invalid dates in filters', async () => {
      const application = entities.applications.find(({ users }) =>
        users.some(({ username }) => username == 'admin'));

      const result = await app
        .get(`/applications/${application.id}/features`)
        .query({
          createdFrom: '04-03-2020',
          createdTo: '2020-12-12',
          updatedFrom: '2075-05-05',
          updatedTo: new Date('2020-01-01').toISOString(),
        })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        error: 'Bad Request',
        message: [
          'createdFrom should in the YYYY-MM-DD format',
          'createdFrom must be a valid ISO 8601 date string',
          `maximal allowed date for updatedFrom is ${(new Date(new Date().toISOString().split('T')[0])).toString()}`,
          'updatedTo should in the YYYY-MM-DD format',
        ],
        statusCode: 400,
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should filter features by name', async () => {
      const application = entities.applications.find(({ users }) =>
        users.some(({ username }) => username == 'admin'));

      const result = await app
        .get(`/applications/${application.id}/features`)
        .query({
          search: application.features[0].name.substring(1, application.features[0].name.length - 1),
        })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body.data.some(({ id }) => id === application.features[0].id)).toEqual(true);
      expect(result.statusCode).toEqual(200);
    });

    it('should sort features by the given field', async () => {
      const application = entities.applications.find(({ users }) =>
        users.some(({ username }) => username == 'admin'));

      const expected = application.features
        .sort((first, second) => (first.name > second.name ? 1 : -1));

      const result = await app
        .get(`/applications/${application.id}/features`)
        .query({
          sortBy: 'name',
          sortDirection: 'asc',
        })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.statusCode).toEqual(200);
      expect(result.body.data).toEqual(expected);
      expect(result.body.total).toEqual(expected.length);
    });
  });
});
