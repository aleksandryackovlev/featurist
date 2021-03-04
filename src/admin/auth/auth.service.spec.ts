import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';
import { Bcrypt } from './auth.bcrypt';

const user = {
  password: 'password',
  username: 'username',
  id: 'some-id',
};

const bcrypt = {
  compare: jest.fn().mockResolvedValue(true),
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByUsername: jest.fn().mockReturnValue(user),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('access_token'),
          },
        },
        {
          provide: Bcrypt,
          useValue: bcrypt,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('validateUser', () => {
    it('should return null if user does not exist', async () => {
      const usersSpy = jest
        .spyOn(usersService, 'findByUsername')
        .mockResolvedValueOnce(null);

      await expect(
        service.validateUser('username', 'password'),
      ).resolves.toStrictEqual(null);

      expect(usersSpy).toBeCalledWith('username');
    });

    it('should return null if password is not correct', async () => {
      const bcryptSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValueOnce(false);

      await expect(
        service.validateUser('username', 'password'),
      ).resolves.toStrictEqual(null);

      expect(bcryptSpy).toBeCalledWith('password', 'password');
    });

    it('should strip password from the returned user', async () => {
      await expect(
        service.validateUser('username', 'password'),
      ).resolves.toStrictEqual({
        username: 'username',
        id: 'some-id',
      });
    });
  });

  describe('login', () => {
    it('should return an access token for a given user', async () => {
      const user = {
        id: 'user-id',
      };

      const jwtSpy = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce('some_token');

      await expect(service.login(user)).resolves.toEqual({
        data: {
          access_token: 'some_token',
        },
      });

      expect(jwtSpy).toBeCalledWith({
        id: 'user-id',
      });
    });
  });
});
