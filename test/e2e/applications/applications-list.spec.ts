/* eslint-disable @typescript-eslint/no-unused-vars */
describe('Applications', () => {
  describe('GET /applications', () => {
    const adminApplications = entities.applications.filter(({ users }) =>
      users.some(({ username }) => username == 'admin'),
    );

    it('should throw an 403 if the current user is not allowed to read applications', async () => {
      const result = await app.get('/applications').set({
        Authorization: `Bearer ${credentials.restrictedUserToken}`,
      });

      expect(result.body).toEqual({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should return a list of available for user applications', async () => {
      const expected = adminApplications
        .map(({ users, features, ...rest }) => rest)
        .sort((first, second) => (first.updatedAt > second.updatedAt ? -1 : 1));

      const result = await app.get('/applications').set({
        Authorization: `Bearer ${credentials.adminToken}`,
      });

      expect(result.body).toEqual({
        data: expected,
        total: expected.length,
      });
      expect(result.statusCode).toEqual(200);
    });

    it('should not allow to use non-positive offsets and limits', async () => {
      const result = await app
        .get('/applications')
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

    it('should not allow to use invalid dates in filters', async () => {
      const result = await app
        .get('/applications')
        .query({
          createdFrom: '04-03-2020',
          createdTo: '2020-12-12',
          updatedFrom: '2075-05-05',
          updatedTo: new Date('2020-01-01').toISOString(),
        })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      const today = new Date();
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
  });
});
