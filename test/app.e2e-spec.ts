import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
      skipMissingProperties: false,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }));

    await app.init();
  });

  describe('Applications', () => {
    describe('POST /applications', () => {
      it('should throw an 400 if invalid body is sent', () => {
        return request(app.getHttpServer())
          .post('/applications')
          .send({ description: 'Some description', test: 'test' })
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
        return request(app.getHttpServer())
          .put('/applications/app-1')
          .send({})
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
});
