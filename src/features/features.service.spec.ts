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
  });

  describe('find', () => {
    it('should query the repository with the default params if no args are given', async () => {
      await expect(service.find('appId', <FindFeaturesDto>{})).resolves.toEqual(
        {
          data: [
            {
              id: '935a38e8-ec14-41b8-8066-2bc5c818577a',
              description: 'John Doe',
              name: 'feature_name',
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
  });
});
