/* eslint-disable @typescript-eslint/no-unused-vars */
describe('Applications', () => {
  describe('GET /applications/:id', () => {
    it('should return 403 error if current user is not allowed to read applications', async () => {
      const result = await app
        .get(`/applications/${entities.applications[0].id}`)
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`
        });

        expect(result.body).toEqual({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })
        expect(result.statusCode).toEqual(403);
    });

    it('should return 404 error if an application with the given id does not exist', async () => {
      const result = await app
        .get('/applications/c6101e77-9bb8-4756-9720-82656d1b92a5')
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

        expect(result.body).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
        })
        expect(result.statusCode).toEqual(404);
    });

    it('should return 400 error if the given id is not a valid uuid', async () => {
      const result = await app
        .get('/applications/some-id')
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

        expect(result.body).toEqual({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
        })
        expect(result.statusCode).toEqual(400);
    });

    it('should return the application with the given id', async () => {
      const {
        users,
        features,
        ...expected
      } = entities.applications
        .find(({ users }) => users.some(({ username }) => username == 'admin'));

      const result = await app
        .get(`/applications/${expected.id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      expect(result.body).toEqual({
        data: expected,
      });

      expect(result.statusCode).toEqual(200);
    });
  });
});
