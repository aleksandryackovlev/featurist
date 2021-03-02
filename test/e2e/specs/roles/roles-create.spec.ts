/* eslint-disable @typescript-eslint/no-unused-vars */
describe('Roles', () => {
  describe('POST /roles', () => {
    it('should throw an 400 if invalid body is sent', async () => {
      const result = await app
        .post('/roles')
        .send({ description: 'Some description', test: 'test' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

        expect(result.body).toEqual({
          statusCode: 400,
          message: [
            'property test should not exist',
            'name must be shorter than or equal to 150 characters',
            'name must be longer than or equal to 3 characters',
            'name must be a string',
            'name should not be empty'
          ],
          error: 'Bad Request'
        })
        expect(result.statusCode).toEqual(400);
    });

    it('should throw an 400 if empty body is sent', async () => {
      const result = await app
        .post('/roles')
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });
        expect(result.body).toEqual({
          statusCode: 400,
          message: [
            'name must be shorter than or equal to 150 characters',
            'name must be longer than or equal to 3 characters',
            'name must be a string',
            'name should not be empty',
            'description must be shorter than or equal to 1000 characters',
            'description must be longer than or equal to 3 characters',
            'description must be a string',
            'description should not be empty'
          ],
          error: 'Bad Request'
        })
        expect(result.statusCode).toEqual(400);
    });

    it('should return 403 error if current user is not allowed to create roles', async () => {
      const result = await app
        .post('/roles')
        .send({ description: 'Some description', name: 'test' })
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`
        })
        expect(result.body).toEqual({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })
        expect(result.statusCode).toEqual(403);
    });

    it('should create a new role and return it', async () => {
      const { permissions, users, ...role } = entities.roles[0];

      const result = await app
        .post('/roles')
        .send({ description: 'Some description', name: 'test' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      expect(result.status).toEqual(201);
      expect(Object.keys(result.body.data).sort()).toEqual(Object.keys(role).sort());
      expect(result.body.data).toMatchObject({ description: 'Some description', name: 'test' });

      await app
        .delete(`/roles/${result.body.data.id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
    });
  });
});
