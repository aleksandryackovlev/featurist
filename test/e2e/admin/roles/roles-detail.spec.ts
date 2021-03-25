/* eslint-disable @typescript-eslint/no-unused-vars */
describe('Roles', () => {
  describe('GET /roles/:id', () => {
    it('should return 403 error if current user is not allowed to read roles', async () => {
      const result = await app.get(`/roles/${entities.roles[0].id}`).set({
        Authorization: `Bearer ${credentials.restrictedUserToken}`,
      });

      expect(result.body).toEqual({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Forbidden resource',
      });
      expect(result.statusCode).toEqual(403);
    });

    it('should return 404 error if an role with the given id does not exist', async () => {
      const result = await app
        .get('/roles/c6101e77-9bb8-4756-9720-82656d1b92a5')
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

    it('should return 400 error if the given id is not a valid uuid', async () => {
      const result = await app.get('/roles/some-id').set({
        Authorization: `Bearer ${credentials.adminToken}`,
      });

      expect(result.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed (uuid  is expected)',
      });
      expect(result.statusCode).toEqual(400);
    });

    it('should return the role with the given id', async () => {
      const { users, permissions, ...expected } = entities.roles[0];

      const result = await app.get(`/roles/${expected.id}`).set({
        Authorization: `Bearer ${credentials.adminToken}`,
      });

      const { ...actual } = result.body;

      expect({
        data: {
          ...result.body.data,
          permissions: result.body.data.permissions
            .sort((first, second) => {
              if (first.subject === second.subject) {
                return first.action > second.action ? -1 : 1;
              }

              return first.subject > second.subject ? -1 : 1;
            })
            .map(({ action, subject, isAllowed }) => ({
              action,
              subject,
              isAllowed,
            })),
        },
      }).toEqual({
        data: {
          ...expected,
          permissions: permissions
            .sort((first, second) => {
              if (first.subject === second.subject) {
                return first.action > second.action ? -1 : 1;
              }

              return first.subject > second.subject ? -1 : 1;
            })
            .map(({ action, subject, isAllowed }) => ({
              action,
              subject,
              isAllowed,
            })),
        },
      });

      expect(result.statusCode).toEqual(200);
    });
  });
});
