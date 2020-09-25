import { Test, TestingModule } from '@nestjs/testing';

import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';

import { Application } from './application.entity';

const application = {
  id: 'some-id',
  name: 'Test name',
  description: 'Test description',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const applicationsArray: Application[] = [application];

describe('ApplicationsController', () => {
  let controller: ApplicationsController;
  let service: ApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [
        {
          provide: ApplicationsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(applicationsArray),
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
    it('should return an array of applicatins', async () => {
      expect(await controller.find()).toBe(applicationsArray);
    });
  });

  describe('findOne', () => {
    it('should return an array of applications', async () => {
      const serviceSpy = jest.spyOn(service, 'findOne');
      expect(await controller.findOne('some-id')).toBe(application);
      expect(serviceSpy).toBeCalledWith('some-id');
    });
  });

  describe('create', () => {
    it('should create an application', async () => {
      const serviceSpy = jest.spyOn(service, 'create');
      expect(
        await controller.create({
          name: 'Some name',
          description: 'Some desc',
        }),
      ).toBe(application);
      expect(serviceSpy).toBeCalledWith({
        name: 'Some name',
        description: 'Some desc',
      });
    });
  });

  describe('update', () => {
    it('should create an application', async () => {
      const serviceSpy = jest.spyOn(service, 'update');
      expect(
        await controller.update('some-id-to-update', {
          name: 'Some new name',
          description: 'Some desc',
        }),
      ).toBe(application);
      expect(serviceSpy).toBeCalledWith('some-id-to-update', {
        name: 'Some new name',
        description: 'Some desc',
      });
    });
  });

  describe('remove', () => {
    it('should return an array of applications', async () => {
      const serviceSpy = jest.spyOn(service, 'remove');
      expect(await controller.remove('some-id-to-remove')).toBe(application);
      expect(serviceSpy).toBeCalledWith('some-id-to-remove');
    });
  });
});
