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
});
