import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const response = {
  access_token: 'token',
};

const service = {
  login: jest.fn().mockResolvedValue(response),
};

describe('UsersController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: service,
        },
      ],
    }).compile();

    jest.clearAllMocks();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login users', async () => {
      const request: unknown = {
        user: {
          username: 'username',
        },
      };

      expect(controller.login(<Request>request)).resolves.toEqual(response);
      expect(service.login).toBeCalledWith({
        username: 'username',
      });
    });
  });
});
