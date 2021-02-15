import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

import { PermissionsAbilityFactory } from '../permissions/permissions-ability.factory';
import { ApplicationsService } from '../applications/applications.service';

import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';

import { Feature } from './feature.entity';
import { FindFeaturesDto } from './dto/find-features.dto';

const appId = 'appId';

const feature = <Feature>{
  id: 'some-id',
  name: 'Test name',
  description: 'Test description',
  applicationId: 'appId',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const req = {
  user: {
    id: 'user-id',
    username: 'username',
  },
};

const featuresArray: Feature[] = [feature];
const ability = {
  can: jest.fn().mockReturnValue(true),
};

describe('FeaturesController', () => {
  let controller: FeaturesController;
  let service: FeaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeaturesController],
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
          provide: FeaturesService,
          useValue: {
            find: jest.fn().mockResolvedValue({
              data: featuresArray,
              total: 10,
            }),
            findOne: jest.fn().mockResolvedValue(feature),
            create: jest.fn().mockReturnValue(feature),
            update: jest.fn().mockResolvedValue(feature),
            remove: jest.fn().mockResolvedValue(feature),
            enable: jest.fn().mockResolvedValue(feature),
            disable: jest.fn().mockResolvedValue(feature),
          },
        },
        {
          provide: ApplicationsService,
          useValue: {
            isApplicationExists: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<FeaturesController>(FeaturesController);
    service = module.get<FeaturesService>(FeaturesService);
  });

  describe('find', () => {
    it('should return an array of features', async () => {
      const findDto = { offset: 10, limit: 10 };
      expect(
        await controller.find(
          appId,
          <FindFeaturesDto>findDto,
          <Request>(<unknown>req),
        ),
      ).toEqual({
        data: featuresArray,
        total: 10,
      });

      expect(service.find).toBeCalledTimes(1);
      expect(service.find).toBeCalledWith(appId, findDto);
    });
  });

  describe('findOne', () => {
    it('should return the feature by id', async () => {
      const serviceSpy = jest.spyOn(service, 'findOne');
      expect(
        await controller.findOne(appId, 'some-id', <Request>(<unknown>req)),
      ).toEqual({
        data: feature,
      });
      expect(serviceSpy).toBeCalledWith(appId, 'some-id');
    });
  });

  describe('create', () => {
    it('should create an feature', async () => {
      const serviceSpy = jest.spyOn(service, 'create');
      expect(
        await controller.create(
          appId,
          {
            name: 'Some name',
            description: 'Some desc',
          },
          <Request>(<unknown>req),
        ),
      ).toEqual({
        data: feature,
      });
      expect(serviceSpy).toBeCalledWith(appId, {
        name: 'Some name',
        description: 'Some desc',
      });
    });
  });

  describe('update', () => {
    it('should update a feature', async () => {
      const serviceSpy = jest.spyOn(service, 'update');
      expect(
        await controller.update(
          appId,
          'some-id-to-update',
          {
            description: 'Some desc',
            isEnabled: false,
          },
          <Request>(<unknown>req),
        ),
      ).toEqual({
        data: feature,
      });
      expect(serviceSpy).toBeCalledWith(appId, 'some-id-to-update', {
        description: 'Some desc',
        isEnabled: false,
      });
    });
  });

  describe('enable', () => {
    it('should enable a feature', async () => {
      const serviceSpy = jest.spyOn(service, 'enable');
      expect(
        await controller.enable(
          appId,
          'some-id-to-update',
          <Request>(<unknown>req),
        ),
      ).toEqual({
        data: feature,
      });
      expect(serviceSpy).toBeCalledWith(appId, 'some-id-to-update');
    });
  });

  describe('disable', () => {
    it('should disable a feature', async () => {
      const serviceSpy = jest.spyOn(service, 'disable');
      expect(
        await controller.disable(
          appId,
          'some-id-to-update',
          <Request>(<unknown>req),
        ),
      ).toEqual({
        data: feature,
      });
      expect(serviceSpy).toBeCalledWith(appId, 'some-id-to-update');
    });
  });

  describe('remove', () => {
    it('should an feature by id', async () => {
      const serviceSpy = jest.spyOn(service, 'remove');
      expect(
        await controller.remove(
          appId,
          'some-id-to-remove',
          <Request>(<unknown>req),
        ),
      ).toEqual({
        data: feature,
      });
      expect(serviceSpy).toBeCalledWith(appId, 'some-id-to-remove');
    });
  });
});
