import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IFindEntitiesDto as FindDtoType } from '../crud/interfaces';
import { User } from '../users/user.entity';

import { ApplicationsService } from './applications.service';
import { Application } from './application.entity';

const app = new Application();
app.id = '935a38e8-ec14-41b8-8066-2bc5c818577a';
app.name = 'John Doe';
app.features = [];
app.description = 'Description';

const resultArr = [app];

const user = {
  id: 'some-id',
  username: 'testuser',
};

const query = {
  where: jest.fn(),
  andWhere: jest.fn(),
  offset: jest.fn(),
  limit: jest.fn(),
  orderBy: jest.fn(),
  getManyAndCount: jest.fn().mockReturnValue([resultArr, 1]),
  getOne: jest.fn().mockResolvedValue({ ...app }),
  innerJoin: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  innerJoinAndSelect: jest.fn(),
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
            findOne: jest.fn().mockResolvedValue({ ...app }),
            create: jest.fn().mockReturnValue({ ...app }),
            save: jest.fn(),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true),
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

  describe('create', () => {
    it('should successfully insert an entity', async () => {
      const result = await service.create(
        {
          name: 'Test Entity 1',
          description: 'Test Desc 1',
        },
        user as User,
      );

      await expect(result).toEqual(app);
      expect(repo.create).toBeCalledTimes(1);
      expect(repo.create).toBeCalledWith({
        name: 'Test Entity 1',
        description: 'Test Desc 1',
      });
      expect(repo.save).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should call the update method', async () => {
      const entity = await service.update('a uuid', {
        name: 'Test Entity 1',
        description: 'Test Desc 1',
      });

      expect(entity).toEqual({
        ...app,
        name: 'Test Entity 1',
        description: 'Test Desc 1',
      });

      expect(repo.update).toBeCalledTimes(1);
      expect(repo.update).toBeCalledWith('a uuid', {
        name: 'Test Entity 1',
        description: 'Test Desc 1',
      });
    });

    it('should throw an error if a entity does not exist', async () => {
      const error = new Error('Entity does not exist!');

      jest.spyOn(service, 'findOne').mockRejectedValueOnce(error);

      await expect(
        service.update('a uuid', {
          name: 'Test Entity 1',
          description: 'Test Desc 1',
        }),
      ).rejects.toThrow('Entity does not exist!');
    });
  });

  describe('findOne', () => {
    it('should get a single entity', async () => {
      await expect(service.findOne('a uuid', 'userId')).resolves.toEqual(app);
      expect(query.innerJoin).toBeCalledWith(
        'application.users',
        'user',
        'application_user.user_id = :userId',
        { userId: 'userId' },
      );

      expect(query.where).toBeCalledWith('application.id = :id', {
        id: 'a uuid',
      });
    });

    it('should throw an error if a entity does not exist', async () => {
      jest.spyOn(query, 'getOne').mockResolvedValueOnce(null);

      await expect(service.findOne('a uuid')).rejects.toThrow(
        'Entity does not exist',
      );
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

  describe('remove', () => {
    it('should remove an enitity and return it', async () => {
      const result = await service.remove('a uuid', 'userId');
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const { users, features, ...expected } = app;
      /* eslint-enable @typescript-eslint/no-unused-vars */
      expect(result).toEqual(expected);
    });

    it('should throw an error if an entity with a given id does not exit', async () => {
      jest.spyOn(query, 'getOne').mockResolvedValueOnce(null);

      await expect(service.remove('a bad uuid')).rejects.toThrow(
        'Entity does not exist',
      );
    });
  });
});
