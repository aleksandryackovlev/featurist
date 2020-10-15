import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ApplicationsService } from '../applications/applications.service';
import { ETCD_CONNECTION } from '../etcd/etcd.constants';

import { FindFeaturesDto } from './dto/find-features.dto';

import { FeaturesService } from './features.service';
import { Feature } from './feature.entity';

const feature = {
  id: '935a38e8-ec14-41b8-8066-2bc5c818577a',
  description: 'John Doe',
  name: 'feature_name',
};

const resultArr = [feature];

const query = {
  where: jest.fn(),
  andWhere: jest.fn(),
  offset: jest.fn(),
  limit: jest.fn(),
  orderBy: jest.fn(),
  getManyAndCount: jest.fn().mockReturnValue([resultArr, 10]),
};

const etcd = {
  getAll: jest.fn().mockReturnValue({
    prefix: jest.fn().mockReturnValue({
      strings: jest.fn().mockResolvedValue({
        'appId/feature_name': '1',
      }),
    }),
  }),
  put: jest.fn().mockReturnValue({
    value: jest.fn().mockResolvedValue(true),
  }),
  get: jest.fn().mockReturnValue({
    string: jest.fn().mockResolvedValue('1'),
  }),
  delete: jest.fn().mockReturnValue({
    key: jest.fn().mockResolvedValue(true),
  }),
};

describe('FeaturesService', () => {
  let service: FeaturesService;
  let applicationsService: ApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeaturesService,
        {
          provide: getRepositoryToken(Feature),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(query),
          },
        },
        {
          provide: ApplicationsService,
          useValue: {
            isApplicationExists: jest.fn().mockResolvedValue(query),
          },
        },
        {
          provide: ETCD_CONNECTION,
          useValue: etcd,
        },
      ],
    }).compile();

    jest.clearAllMocks();

    service = module.get<FeaturesService>(FeaturesService);
    applicationsService = module.get<ApplicationsService>(ApplicationsService);
  });

  describe('find', () => {
    it('should query the repository with the default params if no args are given', async () => {
      await expect(service.find('appId', <FindFeaturesDto>{})).resolves.toEqual(
        {
          data: [
            {
              ...feature,
              isEnabled: true,
            },
          ],
          total: 10,
        },
      );

      expect(query.where).toBeCalledTimes(1);
      expect(query.where).toBeCalledWith('feature.applicationId = :appId', {
        appId: 'appId',
      });
      expect(query.andWhere).toBeCalledTimes(0);
      expect(query.offset).toBeCalledTimes(0);

      expect(query.orderBy).toBeCalledTimes(1);
      expect(query.orderBy).toBeCalledWith('feature.createdAt', 'DESC');

      expect(query.limit).toBeCalledTimes(1);
      expect(query.limit).toBeCalledWith(10);

      expect(query.getManyAndCount).toBeCalledTimes(1);
    });

    it('should throw an error if application does not exist', async () => {
      jest
        .spyOn(applicationsService, 'isApplicationExists')
        .mockResolvedValueOnce(false);

      await expect(service.find('appId', <FindFeaturesDto>{})).rejects.toThrow(
        'Application not found',
      );
    });

    it('should be able to filter features by the creation date range', async () => {
      await expect(
        service.find('appId', <FindFeaturesDto>{
          createdFrom: new Date('2020-09-09'),
          createdTo: new Date('2020-09-14'),
        }),
      ).resolves.toEqual({
        data: [
          {
            ...feature,
            isEnabled: true,
          },
        ],
        total: 10,
      });

      expect(query.where).toBeCalledTimes(1);
      expect(query.where).toBeCalledWith('feature.applicationId = :appId', {
        appId: 'appId',
      });

      expect(query.andWhere).toBeCalledTimes(2);

      expect(query.andWhere).toBeCalledWith(
        'CAST (feature.createdAt AS DATE) >= :createdFrom',
        {
          createdFrom: new Date('2020-09-09'),
        },
      );

      expect(query.andWhere).toBeCalledWith(
        'CAST (feature.createdAt AS DATE) <= :createdTo',
        {
          createdTo: new Date('2020-09-14'),
        },
      );
    });

    it('should be able to filter features by the update date range', async () => {
      await expect(
        service.find('appId', <FindFeaturesDto>{
          updatedFrom: new Date('2020-09-09'),
          updatedTo: new Date('2020-09-14'),
        }),
      ).resolves.toEqual({
        data: [
          {
            ...feature,
            isEnabled: true,
          },
        ],
        total: 10,
      });

      expect(query.where).toBeCalledTimes(1);
      expect(query.where).toBeCalledWith('feature.applicationId = :appId', {
        appId: 'appId',
      });

      expect(query.andWhere).toBeCalledTimes(2);

      expect(query.andWhere).toBeCalledWith(
        'CAST (feature.updatedAt AS DATE) >= :updatedFrom',
        {
          updatedFrom: new Date('2020-09-09'),
        },
      );

      expect(query.andWhere).toBeCalledWith(
        'CAST (feature.updatedAt AS DATE) <= :updatedTo',
        {
          updatedTo: new Date('2020-09-14'),
        },
      );
    });

    it('should be able to filter applications by substring of the name', async () => {
      await expect(
        service.find('appId', <FindFeaturesDto>{ search: 'some name' }),
      ).resolves.toEqual({
        data: [
          {
            ...feature,
            isEnabled: true,
          },
        ],
        total: 10,
      });

      expect(query.andWhere).toBeCalledTimes(1);
      expect(query.andWhere).toBeCalledWith('feature.name LIKE :search', {
        search: '%some name%',
      });
    });

    it('should skip the given amount on entities if offset is set', async () => {
      await expect(
        service.find('appId', <FindFeaturesDto>{
          search: 'some name',
          offset: 300,
        }),
      ).resolves.toEqual({
        data: [
          {
            ...feature,
            isEnabled: true,
          },
        ],
        total: 10,
      });

      expect(query.offset).toBeCalledTimes(1);
      expect(query.offset).toBeCalledWith(300);
    });

    it('should sort entities by given params', async () => {
      await expect(
        service.find('appId', <FindFeaturesDto>{
          sortBy: 'name',
          sortDirection: 'asc',
        }),
      ).resolves.toEqual({
        data: [
          {
            ...feature,
            isEnabled: true,
          },
        ],
        total: 10,
      });

      expect(query.orderBy).toBeCalledTimes(1);
      expect(query.orderBy).toBeCalledWith('feature.name', 'ASC');
    });

    it('should return the given amount of entities if limit is set', async () => {
      await expect(
        service.find('appId', <FindFeaturesDto>{
          limit: 200,
          sortBy: 'name',
          sortDirection: 'asc',
        }),
      ).resolves.toEqual({
        data: [
          {
            ...feature,
            isEnabled: true,
          },
        ],
        total: 10,
      });

      expect(query.limit).toBeCalledTimes(1);
      expect(query.limit).toBeCalledWith(200);
    });

    it('should return isEnabled = false for disabled features', async () => {
      jest
        .spyOn(etcd.getAll().prefix('appId'), 'strings')
        .mockResolvedValueOnce({ 'appId/feature_name': '0' });

      await expect(
        service.find('appId', <FindFeaturesDto>{
          limit: 200,
          sortBy: 'name',
          sortDirection: 'asc',
        }),
      ).resolves.toEqual({
        data: [
          {
            ...feature,
            isEnabled: false,
          },
        ],
        total: 10,
      });
    });

    it('should return isEnabled = false for features that are not saved in etcd', async () => {
      jest
        .spyOn(etcd.getAll().prefix('appId'), 'strings')
        .mockResolvedValueOnce({ 'appId/feature_name1': '1' });

      await expect(
        service.find('appId', <FindFeaturesDto>{
          limit: 200,
          sortBy: 'name',
          sortDirection: 'asc',
        }),
      ).resolves.toEqual({
        data: [
          {
            ...feature,
            isEnabled: false,
          },
        ],
        total: 10,
      });
    });
  });
});
