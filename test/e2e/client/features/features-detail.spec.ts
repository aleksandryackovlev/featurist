describe('Client features', () => {
  describe('GET /features/:id', () => {
    it('should return 400 error if the given appId is not a valid uuid', async () => {
      const result = await clientApp
        .get(`/features/${entities.applications[0].features[0].id}`)
        .set({
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
      const result = await clientApp.get(
        `/features/${entities.applications[0].features[0].id}`,
      );

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
      const result = await clientApp
        .get(`/features/${entities.applications[0].features[0].id}`)
        .set({
          'X-Application-ID': 'c6101e77-9bb8-4756-9720-82656d1b92a5',
        });

      expect(result.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: 'Entity does not exist',
      });
      expect(result.statusCode).toEqual(404);
    });

    it('should return 404 error if a feature with the given name does not exist', async () => {
      const result = await clientApp
        .get(`/features/c6101e77-9bb8-4756-9720-82656d1b92a5`)
        .set({
          'X-Application-ID': `${entities.applications[0].id}`,
        });

      expect(result.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: 'Entity does not exist',
      });
      expect(result.statusCode).toEqual(404);
    });

    it('should return the feature with the given id', async () => {
      const application = entities.applications[0];

      const result = await clientApp
        .get(`/features/${application.features[0].name}`)
        .set({
          'X-Application-ID': `${application.id}`,
        });

      expect(result.body).toEqual({
        data: {
          name: application.features[0].name,
          isEnabled: application.features[0].isEnabled,
        },
      });
      expect(result.statusCode).toEqual(200);
    });
  });
});
