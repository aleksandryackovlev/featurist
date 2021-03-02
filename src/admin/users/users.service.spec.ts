import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FindUsersDto } from './dto/find-users.dto';

import { UsersService } from './users.service';
import { User } from './user.entity';

const user = new User();
user.id = '935a38e8-ec14-41b8-8066-2bc5c818577a';
user.username = 'John Doe';
user.password = 'Description';

const resultArr = [user];

const query = {
  where: jest.fn(),
  andWhere: jest.fn(),
  offset: jest.fn(),
  limit: jest.fn(),
  orderBy: jest.fn(),
  getManyAndCount: jest.fn().mockReturnValue([resultArr, 10]),
};

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(query),
            findOne: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    jest.clearAllMocks();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findByUsername', () => {
    it('should return a user by its username', async () => {
      const repoSpy = jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findByUsername('uid')).resolves.toEqual(null);
      expect(repoSpy).toBeCalledTimes(1);
      expect(repoSpy).toBeCalledWith({ username: 'uid' });
    });
  });

  describe('find', () => {
    it('should query the repository with the default params if no args are given', async () => {
      await expect(service.find(<FindUsersDto>{})).resolves.toEqual({
        data: resultArr,
        total: 10,
      });

      expect(query.where).toBeCalledTimes(0);
      expect(query.andWhere).toBeCalledTimes(0);
      expect(query.offset).toBeCalledTimes(0);

      expect(query.orderBy).toBeCalledTimes(1);
      expect(query.orderBy).toBeCalledWith('user.updatedAt', 'DESC');

      expect(query.limit).toBeCalledTimes(1);
      expect(query.limit).toBeCalledWith(10);

      expect(query.getManyAndCount).toBeCalledTimes(1);
    });

    it('should be able to filter users by the creation date range', async () => {
      await expect(
        service.find(<FindUsersDto>{
          createdFrom: new Date('2020-09-09'),
          createdTo: new Date('2020-09-14'),
        }),
      ).resolves.toEqual({
        data: resultArr,
        total: 10,
      });

      expect(query.where).toBeCalledTimes(1);
      expect(query.where).toBeCalledWith(
        'CAST (user.createdAt AS DATE) >= :createdFrom',
        {
          createdFrom: new Date('2020-09-09'),
        },
      );

      expect(query.andWhere).toBeCalledTimes(1);
      expect(query.andWhere).toBeCalledWith(
        'CAST (user.createdAt AS DATE) <= :createdTo',
        {
          createdTo: new Date('2020-09-14'),
        },
      );
    });

    it('should be able to filter users by the update date range', async () => {
      await expect(
        service.find(<FindUsersDto>{
          updatedFrom: new Date('2020-09-09'),
          updatedTo: new Date('2020-09-14'),
        }),
      ).resolves.toEqual({
        data: resultArr,
        total: 10,
      });

      expect(query.where).toBeCalledTimes(1);
      expect(query.where).toBeCalledWith(
        'CAST (user.updatedAt AS DATE) >= :updatedFrom',
        {
          updatedFrom: new Date('2020-09-09'),
        },
      );

      expect(query.andWhere).toBeCalledTimes(1);
      expect(query.andWhere).toBeCalledWith(
        'CAST (user.updatedAt AS DATE) <= :updatedTo',
        {
          updatedTo: new Date('2020-09-14'),
        },
      );
    });

    it('should be able to filter users by substring of the name', async () => {
      await expect(
        service.find(<FindUsersDto>{ search: 'some name' }),
      ).resolves.toEqual({
        data: resultArr,
        total: 10,
      });

      expect(query.where).toBeCalledTimes(1);
      expect(query.where).toBeCalledWith('user.username LIKE :search', {
        search: '%some name%',
      });
    });

    it('should skip the given amount on entities if offset is set', async () => {
      await expect(
        service.find(<FindUsersDto>{ search: 'some name', offset: 300 }),
      ).resolves.toEqual({
        data: resultArr,
        total: 10,
      });

      expect(query.offset).toBeCalledTimes(1);
      expect(query.offset).toBeCalledWith(300);
    });

    it('should sort entities by given params', async () => {
      await expect(
        service.find(<FindUsersDto>{
          sortBy: 'name',
          sortDirection: 'asc',
        }),
      ).resolves.toEqual({
        data: resultArr,
        total: 10,
      });

      expect(query.orderBy).toBeCalledTimes(1);
      expect(query.orderBy).toBeCalledWith('user.name', 'ASC');
    });

    it('should return the given amount of entities if limit is set', async () => {
      await expect(
        service.find(<FindUsersDto>{
          limit: 200,
          sortBy: 'name',
          sortDirection: 'asc',
        }),
      ).resolves.toEqual({
        data: resultArr,
        total: 10,
      });

      expect(query.limit).toBeCalledTimes(1);
      expect(query.limit).toBeCalledWith(200);
    });
  });
});
