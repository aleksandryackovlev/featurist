import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { ApplicationsService } from '../../admin/applications/applications.service';
import { FeaturesService } from '../../admin/features/features.service';

import { ClientFeaturesController as FeaturesController } from './features.controller';

import { ClientFeature as Feature } from './feature.entity';

const appId = 'appId';

const feature = <Feature>{
  id: 'some-id',
  name: 'Test name',
  description: 'Test description',
  applicationId: 'appId',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const featuresArray: Feature[] = [feature];

describe('FeaturesController', () => {
  let controller: FeaturesController;
  let service: FeaturesService;
  let applicationsService: ApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeaturesController],
      providers: [
        {
          provide: FeaturesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue({
              data: featuresArray,
              total: 10,
            }),
            findOneByName: jest.fn().mockResolvedValue(feature),
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

    jest.clearAllMocks();

    controller = module.get<FeaturesController>(FeaturesController);
    service = module.get<FeaturesService>(FeaturesService);
    applicationsService = module.get<ApplicationsService>(ApplicationsService);
  });

  describe('find', () => {
    it('should throw not found exception if application does not exist', async () => {
      jest
        .spyOn(applicationsService, 'isApplicationExists')
        .mockResolvedValueOnce(false);

      try {
        await controller.find({ appId });

        throw new Error('Catch pass through');
      } catch (error) {
        expect(error instanceof NotFoundException).toEqual(true);
      }
    });

    it('should return an array of features', async () => {
      expect(await controller.find({ appId })).toEqual({
        data: featuresArray,
        total: 10,
      });

      expect(service.findAll).toBeCalledTimes(1);
      expect(service.findAll).toBeCalledWith(appId);
    });
  });

  describe('findOne', () => {
    it('should throw not found exception if application does not exist', async () => {
      jest
        .spyOn(applicationsService, 'isApplicationExists')
        .mockResolvedValueOnce(false);

      try {
        await controller.findOne({ appId }, 'some-name');

        throw new Error('Catch pass through');
      } catch (error) {
        expect(error instanceof NotFoundException).toEqual(true);
      }
    });

    it('should return the feature by id', async () => {
      const serviceSpy = jest.spyOn(service, 'findOneByName');
      expect(await controller.findOne({ appId }, 'some-name')).toEqual({
        data: feature,
      });
      expect(serviceSpy).toBeCalledWith(appId, 'some-name');
    });
  });
});
