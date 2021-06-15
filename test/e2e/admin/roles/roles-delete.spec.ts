describe('Roles', () => {
  const permissionsActions = ['create', 'read', 'update', 'delete'];
  const permissionsSubjects = ['Application', 'Feature', 'User', 'Role'];
  const permissions = permissionsActions.reduce((acc, action) => {
    return [
      ...acc,
      ...permissionsSubjects.map((subject) => ({ subject, action, isAllowed: true })),
    ];
  }, []);
  describe('DELETE /roles/:id', () => {
    it('should return 400 error if the given id is not a valid uuid', async () => {
      const result = await app
        .delete('/roles/app-1')
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

    it('should return 400 error if the role with the given id has users', async () => {
      const result = await app
        .delete(`/roles/${entities.roles[0].id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

        expect(result.body).toEqual({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Related entities should be deleted first',
        })
        expect(result.statusCode).toEqual(400);
    });

    it('should return 403 error if current user is not allowed to delete roles', async () => {
      const result = await app
        .delete(`/roles/${entities.roles[0].id}`)
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

    it('should return 404 error if a role with the given id does not exist', async () => {
      const result = await app
        .delete('/roles/c6101e77-9bb8-4756-9720-82656d1b92a5')
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

    it('should delete a role and return it', async () => {
      const created = await app
        .post('/roles')
        .send({ description: 'Some description', name: 'test', permissions })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      const result = await app
        .delete(`/roles/${created.body.data.id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      expect(result.status).toEqual(200);
      expect(result.body.data).toMatchObject(created.body.data);
    });
  });
});
