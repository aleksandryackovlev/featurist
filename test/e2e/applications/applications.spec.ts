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

  describe('GET /applications/:id', () => {
    it('should return 403 error if current user is not allowed to read applications', async () => {
      const result = await app
        .get(`/applications/${entities.applications[0].id}`)
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

    it('should return 404 error if an application with the given id does not exist', async () => {
      const result = await app
        .get('/applications/c6101e77-9bb8-4756-9720-82656d1b92a5')
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

    it('should return 400 error if the given id is not a valid uuid', async () => {
      const result = await app
        .get('/applications/some-id')
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

    it('should return the application with the given id', async () => {
      const {
        users,
        features,
        ...expected
      } = entities.applications
        .find(({ users }) => users.some(({ username }) => username == 'admin'));

      const result = await app
        .get(`/applications/${expected.id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      expect(result.body).toEqual({
        data: expected,
      });

      expect(result.statusCode).toEqual(200);
    });
  });

  describe('POST /applications', () => {
    it('should throw an 400 if invalid body is sent', async () => {
      const result = await app
        .post('/applications')
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
        .post('/applications')
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

    it('should return 403 error if current user is not allowed to create applications', async () => {
      const result = await app
        .post('/applications')
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

    it('should create a new application and return it', async () => {
      const { users, features, ...application } = entities.applications[0];
      const result = await app
        .post('/applications')
        .send({ description: 'Some description', name: 'test' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      expect(result.status).toEqual(201);
      expect(Object.keys(result.body.data).sort()).toEqual(Object.keys(application).sort());
      expect(result.body.data).toMatchObject({ description: 'Some description', name: 'test' });

      await app
        .delete(`/applications/${result.body.data.id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
    });
  });

  describe('PUT /applications/:id', () => {
    it('should throw an 400 if invalid body is sent', async () => {
      const result = await app
        .put('/applications/app-1')
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
        .put('/applications/app-1')
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

    it('should return 403 error if current user is not allowed to edit applications', async () => {
      const result = await app
        .put(`/applications/${entities.applications[0].id}`)
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

    it('should return 404 error if an application with the given id does not exist', async () => {
      const result = await app
        .put('/applications/c6101e77-9bb8-4756-9720-82656d1b92a5')
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

    it('should update an application and return it', async () => {
      const created = await app
        .post('/applications')
        .send({ description: 'Some description', name: 'test' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      const result = await app
        .put(`/applications/${created.body.data.id}`)
        .send({ description: 'Some new description', name: 'Some new name' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      expect(result.status).toEqual(200);
      expect(result.body.data).toMatchObject({ description: 'Some new description', name: 'Some new name' });

      await app
        .delete(`/applications/${created.body.data.id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
    });
  });

  describe('DELETE /applications/:id', () => {
    it('should return 400 error if the given id is not a valid uuid', async () => {
      const result = await app
        .delete('/applications/app-1')
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

    it('should return 400 error if the api with the given id has features', async () => {
      const result = await app
        .delete(`/applications/${entities.applications[0].id}`)
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

    it('should return 403 error if current user is not allowed to edit applications', async () => {
      const result = await app
        .delete(`/applications/${entities.applications[0].id}`)
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

    it('should return 404 error if an application with the given id does not exist', async () => {
      const result = await app
        .delete('/applications/c6101e77-9bb8-4756-9720-82656d1b92a5')
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

    it('should delete an application and return it', async () => {
      const created = await app
        .post('/applications')
        .send({ description: 'Some description', name: 'test' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      const result = await app
        .delete(`/applications/${created.body.data.id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      expect(result.status).toEqual(200);
      expect(result.body.data).toMatchObject(created.body.data);
    });
  });
});
