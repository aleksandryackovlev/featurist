describe('Features', () => {
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
