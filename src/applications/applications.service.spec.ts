import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FindApplicationsDto } from './dto/find-applications.dto';

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
  getMany: jest.fn().mockReturnValue(resultArr),
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
      const repoSpy = jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);

      expect(service.isApplicationExists('uid')).resolves.toEqual(false);
      expect(repoSpy).toBeCalledTimes(1);
      expect(repoSpy).toBeCalledWith('uid');
    });

    it('should return true if an application with the given id does not exist', () => {
      const repoSpy = jest
        .spyOn(repo, 'findOne')
        .mockResolvedValueOnce(<Application>{ name: 'name' });

      expect(service.isApplicationExists('uid')).resolves.toEqual(true);
      expect(repoSpy).toBeCalledTimes(1);
      expect(repoSpy).toBeCalledWith('uid');
    });
  });

  describe('find', () => {
    it('should query the repository with the default params if no args are given', () => {
      expect(service.find(<FindApplicationsDto>{})).resolves.toEqual(resultArr);

      expect(query.where).toBeCalledTimes(0);
      expect(query.andWhere).toBeCalledTimes(0);
      expect(query.offset).toBeCalledTimes(0);

      expect(query.orderBy).toBeCalledTimes(1);
      expect(query.orderBy).toBeCalledWith('application.createdAt', 'DESC');

      expect(query.limit).toBeCalledTimes(1);
      expect(query.limit).toBeCalledWith(10);

      expect(query.getMany).toBeCalledTimes(1);
    });

    it('should be able to filter applications by the creation date range', () => {
      expect(
        service.find(<FindApplicationsDto>{
          createdFrom: new Date('2020-09-09'),
          createdTo: new Date('2020-09-14'),
        }),
      ).resolves.toEqual(resultArr);

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

    it('should be able to filter applications by the update date range', () => {
      expect(
        service.find(<FindApplicationsDto>{
          updatedFrom: new Date('2020-09-09'),
          updatedTo: new Date('2020-09-14'),
        }),
      ).resolves.toEqual(resultArr);

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

    it('should be able to filter applications by substring of the name', () => {
      expect(
        service.find(<FindApplicationsDto>{ search: 'some name' }),
      ).resolves.toEqual(resultArr);

      expect(query.where).toBeCalledTimes(1);
      expect(query.where).toBeCalledWith('application.name LIKE :search', {
        search: '%some name%',
      });
    });

    it('should skip the given amount on entities if offset is set', () => {
      expect(
        service.find(<FindApplicationsDto>{ search: 'some name', offset: 300 }),
      ).resolves.toEqual(resultArr);

      expect(query.offset).toBeCalledTimes(1);
      expect(query.offset).toBeCalledWith(300);
    });

    it('should sort entities by given params', () => {
      expect(
        service.find(<FindApplicationsDto>{
          sortBy: 'name',
          sortDirection: 'asc',
        }),
      ).resolves.toEqual(resultArr);

      expect(query.orderBy).toBeCalledTimes(1);
      expect(query.orderBy).toBeCalledWith('application.name', 'ASC');
    });

    it('should return the given amount of entities if limit is set', () => {
      expect(
        service.find(<FindApplicationsDto>{
          limit: 200,
          sortBy: 'name',
          sortDirection: 'asc',
        }),
      ).resolves.toEqual(resultArr);

      expect(query.limit).toBeCalledTimes(1);
      expect(query.limit).toBeCalledWith(200);
    });
  });
});
