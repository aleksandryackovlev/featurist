/* eslint-disable @typescript-eslint/no-unused-vars */
describe('Users', () => {
  describe('GET /users', () => {
    it('should throw an 403 if the current user is not allowed to read users', async () => {
      const result = await app.get('/users').set({
        Authorization: `Bearer ${credentials.restrictedUserToken}`,
      });

      expect(result.body).toEqual({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should return a list of users', async () => {
      const expected = entities.users
        .map(({ role, password, applications, ...rest }) => rest)
        .sort((first, second) => (first.updatedAt > second.updatedAt ? -1 : 1));

      const result = await app.get('/users').set({
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
        .get('/users')
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
          'offset must not be less than 0',
          'limit must not be less than 1',
        ],
        statusCode: 400,
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should not allow to use invalid dates in filters', async () => {
      const result = await app
        .get('/users')
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

    it('should filter users by username', async () => {
      const user = entities.users[0];

      const result = await app
        .get('/users')
        .query({
          search: user.username.substring(1, user.username.length - 1),
        })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body.data.some(({ id }) => id === user.id)).toEqual(true);
      expect(result.statusCode).toEqual(200);
    });

    it('should sort users by the given field', async () => {
      const users = entities.users
        .sort((first, second) => first.username > second.username ? 1 : -1)
        .map(({ applications, role, password, ...rest }) => rest);

      const result = await app
        .get('/users')
        .query({
          sortBy: 'username',
          sortDirection: 'asc',
        })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.statusCode).toEqual(200);
      expect(result.body.data).toEqual(users);
      expect(result.body.total).toEqual(users.length);
    });
  });
});
