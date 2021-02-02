import * as request from 'supertest';

describe('Applications (e2e)', () => {
  let adminToken = '';
  const developerToken = '';

  beforeAll(async () => {
    const result = await request('http://localhost:3000')
      .post('/auth/login')
      .send({ username: 'admin', password: 'test' });

    adminToken = result.body.data.access_token;
  });

  describe('POST /applications', () => {
    it('should throw an 400 if invalid body is sent', () => {
      return request('http://localhost:3000')
        .post('/applications')
        .send({ description: 'Some description', test: 'test' })
        .set({
          Authorization: `Bearer ${adminToken}`
        })
        .expect({
          statusCode: 400,
          message: [
            'property test should not exist',
            'name must be a string',
            'name should not be empty'
          ],
          error: 'Bad Request'
        })
        .expect(400);
    });
  });

  describe('PUT /applications/:id', () => {
    it('should throw an 400 if invalid body is sent', () => {
      return request('http://localhost:3000')
        .put('/applications/app-1')
        .send({})
        .set({
          Authorization: `Bearer ${adminToken}`
        })
        .expect({
          statusCode: 400,
          message: [
            'name should not be empty',
            'name must be a string',
            'description should not be empty',
            'description must be a string'
          ],
          error: 'Bad Request'
        })
        .expect(400);
    });
  });
});
