/* eslint-disable @typescript-eslint/no-unused-vars */
describe('Roles', () => {
  describe('GET /roles', () => {
    it('should throw an 403 if the current user is not allowed to read roles', async () => {
      const result = await app.get('/roles').set({
        Authorization: `Bearer ${credentials.restrictedUserToken}`,
      });

      expect(result.body).toEqual({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should return a list of roles', async () => {
      const expected = entities.roles
        .map(({ users, permissions, ...rest }) => rest)
        .sort((first, second) => (first.updatedAt > second.updatedAt ? -1 : 1));

      const result = await app.get('/roles').set({
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
        .get('/roles')
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
        .get('/roles')
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

    it('should filter roles by name', async () => {
      const role = entities.roles.find(({ users }) =>
        users.some(({ username }) => username == 'admin'),
      );

      const result = await app
        .get('/roles')
        .query({
          search: role.name.substring(1, role.name.length - 1),
        })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body.data.some(({ id }) => id === role.id)).toEqual(true);
      expect(result.statusCode).toEqual(200);
    });

    it('should sort roles by the given field', async () => {
      const roles = entities.roles
        .sort((first, second) => first.name > second.name ? 1 : -1)
        .map(({ users, permissions, ...rest }) => rest);

      const result = await app
        .get('/roles')
        .query({
          sortBy: 'name',
          sortDirection: 'asc',
        })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.statusCode).toEqual(200);
      expect(result.body.data).toEqual(roles);
      expect(result.body.total).toEqual(roles.length);
    });
  });
});
