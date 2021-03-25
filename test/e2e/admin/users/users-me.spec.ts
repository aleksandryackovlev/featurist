/* eslint-disable @typescript-eslint/no-unused-vars */
describe('Users', () => {
  describe('GET /users/me', () => {
    it('should return the current user with permissions info', async () => {
      const user = entities.users.find(({ username }) => username === 'developer');

      const result = await app
        .get(`/users/me`)
        .set({
          Authorization: `Bearer ${credentials.developerToken}`
        });

      expect(result.body).toEqual({
        data: {
          username: 'developer',
          permissions: entities.permissions
            .filter(({ roleId, isAllowed }) => roleId === user.roleId && isAllowed)
            .map(({ action, subject, isAllowed }) => ({ action, subject, isAllowed }))
        },
      });

      expect(result.statusCode).toEqual(200);
    });
  });
});
