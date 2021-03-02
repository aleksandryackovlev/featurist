describe('Roles', () => {
  describe('PUT /roles/:id', () => {
    it('should throw an 400 if invalid body is sent', async () => {
      const result = await app
        .put('/roles/app-1')
        .send({})
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

        expect(result.body).toEqual({
          statusCode: 400,
          message: [
            'name must be shorter than or equal to 150 characters',
            'name must be longer than or equal to 3 characters',
            'name should not be empty',
            'name must be a string',
            'description must be shorter than or equal to 1000 characters',
            'description must be longer than or equal to 3 characters',
            'description should not be empty',
            'description must be a string',
          ],
          error: 'Bad Request'
        })
        expect(result.statusCode).toEqual(400);
    });

    it('should return 400 error if the given id is not a valid uuid', async () => {
      const result = await app
        .put('/roles/app-1')
        .send({
          name: 'app-name',
          description: '<p>Test</p>',
        })
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

    it('should return 403 error if current user is not allowed to edit roles', async () => {
      const result = await app
        .put(`/roles/${entities.roles[0].id}`)
        .send({ description: 'Some description', name: 'test' })
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

    it('should return 404 error if an role with the given id does not exist', async () => {
      const result = await app
        .put('/roles/c6101e77-9bb8-4756-9720-82656d1b92a5')
        .send({ description: 'Some description', name: 'test' })
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

    it('should update an role and return it', async () => {
      const created = await app
        .post('/roles')
        .send({ description: 'Some description', name: 'test' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      const result = await app
        .put(`/roles/${created.body.data.id}`)
        .send({ description: 'Some new description', name: 'Some new name' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      expect(result.status).toEqual(200);
      expect(result.body.data).toMatchObject({ description: 'Some new description', name: 'Some new name' });

      await app
        .delete(`/roles/${created.body.data.id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
    });
  });
});
