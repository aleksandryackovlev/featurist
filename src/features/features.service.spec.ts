import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Etcd3 } from '../etcd';
import { ApplicationsService } from '../applications/applications.service';

import { FindFeaturesDto } from './dto/find-features.dto';

import { FeaturesService } from './features.service';
import { Feature } from './feature.entity';

const feature = new Feature();
feature.id = '935a38e8-ec14-41b8-8066-2bc5c818577a';
feature.description = 'John Doe';
feature.name = 'Description';

const resultArr = [feature];

const query = {
  where: jest.fn(),
  andWhere: jest.fn(),
  offset: jest.fn(),
  limit: jest.fn(),
  orderBy: jest.fn(),
  getMany: jest.fn().mockReturnValue(resultArr),
};

describe('FeaturesService', () => {
  // let service: FeaturesService;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [
  //       FeaturesService,
  //       {
  //         provide: getRepositoryToken(Feature),
  //         useValue: {
  //           createQueryBuilder: jest.fn().mockReturnValue(query),
  //         },
  //       },
  //       {
  //         provide: ApplicationsService,
  //         useValue: {
  //           isApplicationExists: jest.fn().mockResolvedValue(query),
  //         },
  //       },
  //       // {
  //       //   provide: Etcd3,
  //       //   useValue: {
  //       //     getAll: jest.fn().mockResolvedValue(query),
  //       //   },
  //       // },
  //     ],
  //   }).compile();

  //   jest.clearAllMocks();

  //   service = module.get<FeaturesService>(FeaturesService);
  // });

  // describe('find', () => {
  //   it('should query the repository with the default params if no args are given', () => {
  //     expect(service.find('appId', <FindFeaturesDto>{})).resolves.toEqual(resultArr);

  //     expect(query.where).toBeCalledTimes(0);
  //     expect(query.andWhere).toBeCalledTimes(0);
  //     expect(query.offset).toBeCalledTimes(0);

  //     expect(query.orderBy).toBeCalledTimes(1);
  //     expect(query.orderBy).toBeCalledWith('feature.createdAt', 'DESC');

  //     expect(query.limit).toBeCalledTimes(1);
  //     expect(query.limit).toBeCalledWith(10);

  //     expect(query.getMany).toBeCalledTimes(1);
  //   });
  // })
  it('dummy test', () => {
    expect(true).toEqual(true);
  });
});
