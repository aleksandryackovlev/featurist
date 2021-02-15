import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

import { PermissionsAbilityFactory } from '../permissions/permissions-ability.factory';

import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';

import { Application } from './application.entity';
import { FindApplicationsDto } from './dto/find-applications.dto';

const application = {
  id: 'some-id',
  name: 'Test name',
  description: 'Test description',
  features: [],
  users: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const req = {
  user: {
    id: 'user-id',
    username: 'username',
  },
};

const applicationsArray: Application[] = [application];
const ability = {
  can: jest.fn().mockReturnValue(true),
};

describe('ApplicationsController', () => {
  let controller: ApplicationsController;
  let service: ApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
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
          provide: ApplicationsService,
          useValue: {
            find: jest.fn().mockResolvedValue({
              data: applicationsArray,
              total: 10,
            }),
            findOne: jest.fn().mockResolvedValue(application),
            create: jest.fn().mockReturnValue(application),
            update: jest.fn().mockResolvedValue(application),
            remove: jest.fn().mockResolvedValue(application),
          },
        },
      ],
    }).compile();

    controller = module.get<ApplicationsController>(ApplicationsController);
    service = module.get<ApplicationsService>(ApplicationsService);
  });

  describe('find', () => {
    it('should return an array of applications', async () => {
      expect(
        await controller.find(
          <FindApplicationsDto>{ offset: 10, limit: 10 },
          <Request>(<unknown>req),
        ),
      ).toEqual({
        data: applicationsArray,
        total: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return the application by id', async () => {
      const serviceSpy = jest.spyOn(service, 'findOne');
      expect(
        await controller.findOne('some-id', <Request>(<unknown>req)),
      ).toEqual({
        data: application,
      });
      expect(serviceSpy).toBeCalledWith('some-id', req.user.id);
    });
  });

  describe('create', () => {
    it('should create an application', async () => {
      const serviceSpy = jest.spyOn(service, 'create');
      expect(
        await controller.create(
          {
            name: 'Some name',
            description: 'Some desc',
          },
          <Request>(<unknown>req),
        ),
      ).toEqual({ data: application });
      expect(serviceSpy).toBeCalledWith(
        {
          name: 'Some name',
          description: 'Some desc',
        },
        req.user,
      );
    });
  });

  describe('update', () => {
    it('should update an application', async () => {
      const serviceSpy = jest.spyOn(service, 'update');
      expect(
        await controller.update(
          'some-id-to-update',
          {
            name: 'Some new name',
            description: 'Some desc',
          },
          <Request>(<unknown>req),
        ),
      ).toEqual({ data: application });
      expect(serviceSpy).toBeCalledWith(
        'some-id-to-update',
        {
          name: 'Some new name',
          description: 'Some desc',
        },
        req.user.id,
      );
    });
  });

  describe('remove', () => {
    it('should an application by id', async () => {
      const serviceSpy = jest.spyOn(service, 'remove');
      expect(
        await controller.remove('some-id-to-remove', <Request>(<unknown>req)),
      ).toEqual({
        data: application,
      });
      expect(serviceSpy).toBeCalledWith('some-id-to-remove', req.user.id);
    });
  });
});
