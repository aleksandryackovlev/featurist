/* eslint-disable @typescript-eslint/no-unused-vars */
describe('Users', () => {
  describe('POST /users', () => {
    it('should throw an 400 if invalid body is sent', async () => {
      const result = await app
        .post('/users')
        .send({ username: 'Some description', roleId: 'roleId', test: 'test' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 400,
        message: [
          'property test should not exist',
          'username contains illegal characters',
          'password contains illegal characters',
          'password must be longer than or equal to 5 characters',
          'password must be a string',
          'password should not be empty',
          'roleId must be a UUID',
        ],
        error: 'Bad Request',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should throw an 400 if empty body is sent', async () => {
      const result = await app.post('/users').set({
        Authorization: `Bearer ${credentials.adminToken}`,
      });
      expect(result.body).toEqual({
        statusCode: 400,
        message: [
          'username contains illegal characters',
          'username must be shorter than or equal to 150 characters',
          'username must be longer than or equal to 5 characters',
          'username must be a string',
          'username should not be empty',
          'password contains illegal characters',
          'password must be longer than or equal to 5 characters',
          'password must be a string',
          'password should not be empty',
          'roleId must be a UUID',
          'roleId must be a string',
          'roleId should not be empty',
        ],
        error: 'Bad Request',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should throw an 400 if user with the given username already exists', async () => {
      const user = entities.users[0];

      const result = await app
        .post(`/users`)
        .send({
          username: user.username,
          password: 'test123',
          roleId: entities.roles[0].id,
        })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 400,
        message: 'User already exists',
        error: 'Bad Request',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should return 403 error if current user is not allowed to create users', async () => {
      const result = await app
        .post('/users')
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

    it('should create a new user and return it', async () => {
      const { role, applications, password, ...user } = entities.users[0];

      const result = await app
        .post('/users')
        .send({
          username: 'some_username_5',
          password: 'test123',
          roleId: entities.roles[0].id,
        })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.status).toEqual(201);
      expect(Object.keys(result.body.data).sort()).toEqual(
        Object.keys(user).sort(),
      );
      expect(result.body.data).toMatchObject({
        username: 'some_username_5',
        roleId: entities.roles[0].id,
      });

      await app.delete(`/users/${result.body.data.id}`).set({
        Authorization: `Bearer ${credentials.adminToken}`,
      });
    });
  });
});
