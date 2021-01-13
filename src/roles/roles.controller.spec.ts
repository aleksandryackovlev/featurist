import { Test, TestingModule } from '@nestjs/testing';

import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

import { Role } from './role.entity';
import { FindRolesDto } from './dto/find-roles.dto';

const role = {
  id: 'some-id',
  name: 'admin',
  description: 'Test description',
  users: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const rolesArray: Role[] = [role];

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: {
            find: jest.fn().mockResolvedValue({
              data: rolesArray,
              total: 10,
            }),
            findOne: jest.fn().mockResolvedValue(role),
            create: jest.fn().mockReturnValue(role),
            update: jest.fn().mockResolvedValue(role),
            remove: jest.fn().mockResolvedValue(role),
          },
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  describe('find', () => {
    it('should return an array of roles', async () => {
      expect(
        await controller.find(<FindRolesDto>{ offset: 10, limit: 10 }),
      ).toEqual({
        data: rolesArray,
        total: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return the role by id', async () => {
      const serviceSpy = jest.spyOn(service, 'findOne');
      expect(await controller.findOne('some-id')).toEqual({
        data: role,
      });
      expect(serviceSpy).toBeCalledWith('some-id');
    });
  });

  describe('create', () => {
    it('should create an role', async () => {
      const serviceSpy = jest.spyOn(service, 'create');
      expect(
        await controller.create({
          name: 'Some name',
          description: 'Some desc',
        }),
      ).toEqual({ data: role });
      expect(serviceSpy).toBeCalledWith({
        name: 'Some name',
        description: 'Some desc',
      });
    });
  });

  describe('update', () => {
    it('should update an role', async () => {
      const serviceSpy = jest.spyOn(service, 'update');
      expect(
        await controller.update('some-id-to-update', {
          name: 'Some new name',
          description: 'Some desc',
        }),
      ).toEqual({ data: role });
      expect(serviceSpy).toBeCalledWith('some-id-to-update', {
        name: 'Some new name',
        description: 'Some desc',
      });
    });
  });

  describe('remove', () => {
    it('should an role by id', async () => {
      const serviceSpy = jest.spyOn(service, 'remove');
      expect(await controller.remove('some-id-to-remove')).toEqual({
        data: role,
      });
      expect(serviceSpy).toBeCalledWith('some-id-to-remove');
    });
  });
});
