describe('Users', () => {
  describe('DELETE /users/:id', () => {
    it('should return 400 error if the given id is not a valid uuid', async () => {
      const result = await app
        .delete('/users/app-1')
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

        expect(result.body).toEqual({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
        });

        expect(result.statusCode).toEqual(400);
    });

    it('should return 403 error if current user is not allowed to delete users', async () => {
      const result = await app
        .delete(`/users/${entities.users[0].id}`)
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

    it('should return 404 error if a user with the given id does not exist', async () => {
      const result = await app
        .delete('/users/c6101e77-9bb8-4756-9720-82656d1b92a5')
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

    it('should delete a user and return it', async () => {
      const created = await app
        .post('/users')
        .send({
          username: 'some_username_7',
          password: 'test123',
          roleId: entities.roles[0].id,
        })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      const result = await app
        .delete(`/users/${created.body.data.id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      expect(result.status).toEqual(200);
      expect(result.body.data).toMatchObject(created.body.data);
    });
  });
});
