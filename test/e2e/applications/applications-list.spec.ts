/* eslint-disable @typescript-eslint/no-unused-vars */
describe('Applications', () => {
  describe('GET /applications', () => {
    it('should throw an 403 if the current user is not allowed to read applications', async () => {
      const result = await app
        .get('/applications')
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

    it('should return a list of available for user applications', async () => {
      const expected = entities
        .applications
        .filter(({ users }) => users.some(({ username }) => username == 'admin'))
        .map(({ users, features, ...rest }) => rest)
        .sort((first, second) => first.updatedAt > second.updatedAt ? -1 : 1);

      const result = await app
        .get('/applications')
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

        expect(result.body).toEqual({
          data: expected,
          total: expected.length,
        })
        expect(result.statusCode).toEqual(200);
    });
  });
});
