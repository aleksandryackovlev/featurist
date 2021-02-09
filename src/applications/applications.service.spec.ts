import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IFindEntitiesDto as FindDtoType } from '../crud/interfaces';

import { ApplicationsService } from './applications.service';
import { Application } from './application.entity';

const app = new Application();
app.id = '935a38e8-ec14-41b8-8066-2bc5c818577a';
app.name = 'John Doe';
app.features = [];
app.description = 'Description';

const resultArr = [app];

const query = {
  where: jest.fn(),
  andWhere: jest.fn(),
  offset: jest.fn(),
  limit: jest.fn(),
  orderBy: jest.fn(),
  getManyAndCount: jest.fn().mockReturnValue([resultArr, 1]),
  getOne: jest.fn().mockResolvedValue(app),
  innerJoin: jest.fn(),
};

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let repo: Repository<Application>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getRepositoryToken(Application),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(query),
            findOne: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    jest.clearAllMocks();

    service = module.get<ApplicationsService>(ApplicationsService);
    repo = module.get<Repository<Application>>(getRepositoryToken(Application));
  });

  describe('isApplicationExists', () => {
    it('should return false if an application with the given id does not exist', () => {
      jest.spyOn(query, 'getOne').mockResolvedValueOnce(null);

      expect(service.isApplicationExists('uid')).resolves.toEqual(false);
      expect(query.where).toBeCalledTimes(1);
      expect(query.where).toBeCalledWith('application.id = :id', { id: 'uid' });

      expect(query.getOne).toBeCalledTimes(1);
    });

    it('should return false if an application with the given id and userId does not exist', () => {
      jest.spyOn(query, 'getOne').mockResolvedValueOnce(null);

      expect(service.isApplicationExists('uid', 'userId')).resolves.toEqual(
        false,
      );

      expect(query.innerJoin).toBeCalledTimes(1);
      expect(query.innerJoin).toBeCalledWith(
        'application.users',
        'user',
        'application_user.user_id = :userId',
        { userId: 'userId' },
      );
      expect(query.where).toBeCalledTimes(1);
      expect(query.where).toBeCalledWith('application.id = :id', { id: 'uid' });

      expect(query.getOne).toBeCalledTimes(1);
    });

    it('should return true if an application with the given id exists', async () => {
      jest
        .spyOn(query, 'getOne')
        .mockResolvedValueOnce(<Application>{ name: 'name' });

      expect(service.isApplicationExists('uid')).resolves.toEqual(true);
      expect(query.where).toBeCalledTimes(1);
      expect(query.where).toBeCalledWith('application.id = :id', { id: 'uid' });

      expect(query.getOne).toBeCalledTimes(1);
    });

    it('should return true if an application with the given id and userId exists', async () => {
      jest
        .spyOn(query, 'getOne')
        .mockResolvedValueOnce(<Application>{ name: 'name' });

      expect(service.isApplicationExists('uid', 'userId')).resolves.toEqual(
        true,
      );
      expect(query.innerJoin).toBeCalledTimes(1);
      expect(query.innerJoin).toBeCalledWith(
        'application.users',
        'user',
        'application_user.user_id = :userId',
        { userId: 'userId' },
      );
      expect(query.where).toBeCalledTimes(1);
      expect(query.where).toBeCalledWith('application.id = :id', { id: 'uid' });

      expect(query.getOne).toBeCalledTimes(1);
    });
  });

  describe('find', () => {
    it('should query the repository with the default params if no args are given', async () => {
      await expect(service.find(<FindDtoType>{})).resolves.toEqual({
        data: resultArr,
        total: 1,
      });

      expect(query.where).toBeCalledTimes(0);
      expect(query.andWhere).toBeCalledTimes(0);
      expect(query.offset).toBeCalledTimes(0);

      expect(query.orderBy).toBeCalledTimes(1);
      expect(query.orderBy).toBeCalledWith('application.createdAt', 'DESC');

      expect(query.limit).toBeCalledTimes(1);
      expect(query.limit).toBeCalledWith(10);

      expect(query.getManyAndCount).toBeCalledTimes(1);
    });

    it('should be able to filter applications by the creation date range', async () => {
      await expect(
        service.find(<FindDtoType>{
          createdFrom: new Date('2020-09-09'),
          createdTo: new Date('2020-09-14'),
        }),
      ).resolves.toEqual({
        data: resultArr,
        total: 1,
      });

      expect(query.where).toBeCalledTimes(1);
      expect(query.where).toBeCalledWith(
        'CAST (application.createdAt AS DATE) >= :createdFrom',
        {
          createdFrom: new Date('2020-09-09'),
        },
      );

      expect(query.andWhere).toBeCalledTimes(1);
      expect(query.andWhere).toBeCalledWith(
        'CAST (application.createdAt AS DATE) <= :createdTo',
        {
          createdTo: new Date('2020-09-14'),
        },
      );
    });

    it('should be able to filter applications by the update date range', async () => {
      await expect(
        service.find(<FindDtoType>{
          updatedFrom: new Date('2020-09-09'),
          updatedTo: new Date('2020-09-14'),
        }),
      ).resolves.toEqual({
        data: resultArr,
        total: 1,
      });

      expect(query.where).toBeCalledTimes(1);
      expect(query.where).toBeCalledWith(
        'CAST (application.updatedAt AS DATE) >= :updatedFrom',
        {
          updatedFrom: new Date('2020-09-09'),
        },
      );

      expect(query.andWhere).toBeCalledTimes(1);
      expect(query.andWhere).toBeCalledWith(
        'CAST (application.updatedAt AS DATE) <= :updatedTo',
        {
          updatedTo: new Date('2020-09-14'),
        },
      );
    });

    it('should be able to filter applications by substring of the name', async () => {
      await expect(
        service.find(<FindDtoType>{ search: 'some name' }),
      ).resolves.toEqual({
        data: resultArr,
        total: 1,
      });

      expect(query.where).toBeCalledTimes(1);
      expect(query.where).toBeCalledWith('application.name LIKE :search', {
        search: '%some name%',
      });
    });

    it('should skip the given amount on entities if offset is set', async () => {
      await expect(
        service.find(<FindDtoType>{ search: 'some name', offset: 300 }),
      ).resolves.toEqual({
        data: resultArr,
        total: 1,
      });

      expect(query.offset).toBeCalledTimes(1);
      expect(query.offset).toBeCalledWith(300);
    });

    it('should sort entities by given params', async () => {
      await expect(
        service.find(<FindDtoType>{
          sortBy: 'name',
          sortDirection: 'asc',
        }),
      ).resolves.toEqual({
        data: resultArr,
        total: 1,
      });

      expect(query.orderBy).toBeCalledTimes(1);
      expect(query.orderBy).toBeCalledWith('application.name', 'ASC');
    });

    it('should return the given amount of entities if limit is set', async () => {
      await expect(
        service.find(<FindDtoType>{
          limit: 200,
          sortBy: 'name',
          sortDirection: 'asc',
        }),
      ).resolves.toEqual({
        data: resultArr,
        total: 1,
      });

      expect(query.limit).toBeCalledTimes(1);
      expect(query.limit).toBeCalledWith(200);
    });
  });
});
