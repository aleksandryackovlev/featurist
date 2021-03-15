describe('Client features', () => {
  describe('GET /features', () => {
    it('should throw an 400 if appId is not a valid uuid', async () => {
      const result = await clientApp.get('/features').set({
        'X-Application-ID': 'some-id',
      });

      expect(result.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: ['appId must be a UUID'],
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should return 400 error if appId is not sent', async () => {
      const result = await clientApp.get(`/features`);

      expect(result.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: [
          'appId must be a UUID',
          'appId should not be empty',
          'appId must be a string',
        ],
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should return 404 error if an application with the given id does not exist', async () => {
      const result = await clientApp.get(`/features`).set({
        'X-Application-ID': 'c6101e77-9bb8-4756-9720-82656d1b92a5',
      });

      expect(result.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: 'Entity does not exist',
      });
      expect(result.statusCode).toEqual(404);
    });

    it('should return a list of available features of the given aplication', async () => {
      const application = entities.applications[0];

      const result = await clientApp.get(`/features`).set({
        'X-Application-ID': `${application.id}`,
      });

      expect(result.body).toEqual({
        data: application.features
          .sort((first, second) =>
            new Date(first.updatedAt) > new Date(second.updatedAt) ? -1 : 1,
          )
          .map(({ isEnabled, name }) => ({ isEnabled, name })),
        total: application.features.length,
      });
      expect(result.statusCode).toEqual(200);
    });
  });
});
