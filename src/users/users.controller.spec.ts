import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

import { PermissionsAbilityFactory } from '../permissions/permissions-ability.factory';

import { FindUsersDto } from './dto/find-users.dto';

import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const user = new User();
user.password = 'password';
user.username = 'username';
user.id = 'id';

const usersArr = [user];
const ability = {
  can: jest.fn().mockReturnValue(true),
};

const service = {
  find: jest.fn().mockResolvedValue({ data: usersArr, total: 10 }),
  findOne: jest.fn().mockResolvedValue(user),
  create: jest.fn().mockResolvedValue(user),
  update: jest.fn().mockResolvedValue(user),
  remove: jest.fn().mockResolvedValue(user),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: PermissionsAbilityFactory,
          useValue: {
            createForUser() {
              return ability;
            },
          },
        },
        {
          provide: UsersService,
          useValue: service,
        },
      ],
    }).compile();

    jest.clearAllMocks();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCurrentUser', () => {
    it('should return a current logged in user', async () => {
      expect(
        await controller.getCurrentUser(<Request>(
          (<unknown>{ user: { username: 'John Doe' } })
        )),
      ).toEqual({ data: { username: 'John Doe' } });
    });
  });

  describe('find', () => {
    it('should return an array of users', async () => {
      const findDto: unknown = {};

      expect(await controller.find(<FindUsersDto>findDto)).toEqual({
        data: usersArr,
        total: 10,
      });

      expect(service.find).toBeCalledTimes(1);
      expect(service.find).toBeCalledWith(findDto);
    });
  });

  describe('findOne', () => {
    it('should return the user by id', async () => {
      const serviceSpy = jest.spyOn(service, 'findOne');
      expect(await controller.findOne('some-id')).toEqual({ data: user });
      expect(serviceSpy).toBeCalledWith('some-id');
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const serviceSpy = jest.spyOn(service, 'create');
      expect(
        await controller.create({
          username: 'name',
          password: 'password',
        }),
      ).toEqual({ data: user });
      expect(serviceSpy).toBeCalledWith({
        username: 'name',
        password: 'password',
      });
    });
  });

  describe('update', () => {
    it('should udate a user', async () => {
      const serviceSpy = jest.spyOn(service, 'update');
      expect(
        await controller.update('some-id-to-update', {
          password: 'password',
        }),
      ).toEqual({ data: user });
      expect(serviceSpy).toBeCalledWith('some-id-to-update', {
        password: 'password',
      });
    });
  });

  describe('remove', () => {
    it('should delete a user by id', async () => {
      const serviceSpy = jest.spyOn(service, 'remove');
      expect(await controller.remove('some-id-to-remove')).toEqual({
        data: user,
      });
      expect(serviceSpy).toBeCalledWith('some-id-to-remove');
    });
  });
});
