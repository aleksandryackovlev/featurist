describe('Users', () => {
  describe('PUT /users/:id', () => {
    it('should throw an 400 if invalid body is sent', async () => {
      const result = await app
        .put('/users/app-1')
        .send({})
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.body).toEqual({
        statusCode: 400,
        message: [
          'password contains illegal characters',
          'password must be longer than or equal to 5 characters',
          'password should not be empty',
          'password must be a string',
          'roleId must be a UUID',
          'roleId must be a string',
          'roleId should not be empty',
        ],
        error: 'Bad Request',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should return 400 error if the given id is not a valid uuid', async () => {
      const result = await app
        .put('/users/app-1')
        .send({
          password: 'test_123',
          roleId: entities.roles[0].id,
        })
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

    it('should return 403 error if current user is not allowed to edit users', async () => {
      const result = await app
        .put(`/users/${entities.users[0].id}`)
        .send({
          password: 'test_123',
          roleId: entities.roles[0].id,
        })
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

    it('should return 404 error if an user with the given id does not exist', async () => {
      const result = await app
        .put('/users/c6101e77-9bb8-4756-9720-82656d1b92a5')
        .send({
          password: 'test_123',
          roleId: entities.roles[0].id,
        })
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

    it('should update an user and return it', async () => {
      const created = await app
        .post('/users')
        .send({
          password: 'test123',
          roleId: entities.roles[0].id,
          username: 'user_to_test_update',
        })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      const result = await app
        .put(`/users/${created.body.data.id}`)
        .send({
          password: 'newtest12',
          roleId: entities.roles[0].id,
        })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`,
        });

      expect(result.status).toEqual(200);
      expect(result.body.data).toMatchObject({
        roleId: entities.roles[0].id,
      });

      await app.delete(`/users/${created.body.data.id}`).set({
        Authorization: `Bearer ${credentials.adminToken}`,
      });
    });
  });
});
