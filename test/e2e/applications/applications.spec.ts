declare const credentials: any;
declare const app: any;
declare const entities: any;

describe('Applications', () => {
  const appsList = [
    {
      id: 'c6101e77-9bb8-4756-9720-82677d1b92a5',
      createdAt: '2021-02-02T13:52:51.084Z',
      updatedAt: '2021-02-02T13:52:51.084Z',
      name: 'application_1',
      description: '<p>Enim qui odit voluptates labore et omnis nisi veritatis. Odit aut et. Incidunt fugiat minima ea. Atque quia quam sed voluptatem.</p>'
    },
    {
      id: '71c02296-5418-4cdd-ace3-3886ae6cdcb3',
      createdAt: '2021-01-02T13:52:51.065Z',
      updatedAt: '2021-01-02T13:52:51.065Z',
      name: 'application_2',
      description: '<p>Quo minima recusandae minus error qui quod nihil et doloribus. Aspernatur aut sed expedita quis consectetur eveniet. Vitae aperiam quibusdam ab in est est illo. Ut tempora laudantium consequatur quasi eaque aliquam. Voluptate incidunt vitae alias facilis sit quia. Delectus ipsum qui molestiae rem quia eum aliquam.</p>'
    }
  ];

  describe('GET /applications', () => {
    it('should throw an 403 if the current user is not allowed to read applications', () => {
      return app
        .get('/applications')
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`
        })
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })
        .expect(403);
    });

    it.only('should return a list of available for user applications', () => {
      const expected = entities
        .applications
        .filter(({ users }) => users.some(({ username }) => username == 'admin'))
        .map(({ users, ...rest }) => rest);

      return app
        .get('/applications')
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          data: expected,
          total: expected.length,
        })
        .expect(200);
    });
  });

  describe('GET /applications/:id', () => {
    it('should return 403 error if current user is not allowed to read applications', () => {
      return app
        .get(`/applications/${appsList[0].id}`)
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`
        })
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })
        .expect(403);
    });

    it('should return 404 error if an application with the given id does not exist', () => {
      return app
        .get('/applications/c6101e77-9bb8-4756-9720-82656d1b92a5')
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
        })
        .expect(404);
    });

    it('should return 400 error if the given id is not a valid uuid', () => {
      return app
        .get('/applications/some-id')
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
        })
        .expect(400);
    });

    it('should return the application with the given id', () => {
      return app
        .get(`/applications/${appsList[0].id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          data: appsList[0],
        })
        .expect(200);
    });
  });

  describe('POST /applications', () => {
    it('should throw an 400 if invalid body is sent', () => {
      return app
        .post('/applications')
        .send({ description: 'Some description', test: 'test' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
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
        .expect(400);
    });

    it('should throw an 400 if empty body is sent', () => {
      return app
        .post('/applications')
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
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
        .expect(400);
    });

    it('should return 403 error if current user is not allowed to create applications', () => {
      return app
        .post('/applications')
        .send({ description: 'Some description', name: 'test' })
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`
        })
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })
        .expect(403);
    });

    it('should create a new application and return it', async () => {
      const result = await app
        .post('/applications')
        .send({ description: 'Some description', name: 'test' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        });

      expect(result.status).toEqual(201);
      expect(Object.keys(result.body.data).sort()).toEqual(Object.keys(appsList[0]).sort());
      expect(result.body.data).toMatchObject({ description: 'Some description', name: 'test' });

      await app
        .delete(`/applications/${result.body.data.id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
    });
  });

  describe('PUT /applications/:id', () => {
    it('should throw an 400 if invalid body is sent', () => {
      return app
        .put('/applications/app-1')
        .send({})
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
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
        .expect(400);
    });

    it('should return 400 error if the given id is not a valid uuid', () => {
      return app
        .put('/applications/app-1')
        .send({
          name: 'app-name',
          description: '<p>Test</p>',
        })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
        })
        .expect(400);
    });

    it('should return 403 error if current user is not allowed to edit applications', () => {
      return app
        .put(`/applications/${appsList[0].id}`)
        .send({ description: 'Some description', name: 'test' })
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`
        })
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })
        .expect(403);
    });

    it('should return 404 error if an application with the given id does not exist', () => {
      return app
        .put('/applications/c6101e77-9bb8-4756-9720-82656d1b92a5')
        .send({ description: 'Some description', name: 'test' })
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
        })
        .expect(404);
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
    it('should return 400 error if the given id is not a valid uuid', () => {
      return app
        .delete('/applications/app-1')
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed (uuid  is expected)',
        })
        .expect(400);
    });

    it('should return 400 error if the api with the given id has features', () => {
      return app
        .delete(`/applications/${appsList[0].id}`)
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Related entities should be deleted first',
        })
        .expect(400);
    });

    it('should return 403 error if current user is not allowed to edit applications', () => {
      return app
        .delete(`/applications/${appsList[0].id}`)
        .set({
          Authorization: `Bearer ${credentials.restrictedUserToken}`
        })
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        })
        .expect(403);
    });

    it('should return 404 error if an application with the given id does not exist', () => {
      return app
        .delete('/applications/c6101e77-9bb8-4756-9720-82656d1b92a5')
        .set({
          Authorization: `Bearer ${credentials.adminToken}`
        })
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Entity does not exist',
        })
        .expect(404);
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
