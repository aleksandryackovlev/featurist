import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApplicationsService } from '../applications/applications.service';

import { FindFeaturesDto } from './dto/find-features.dto';

import { FeaturesService } from './features.service';
import { Feature } from './feature.entity';

const feature = {
  id: '935a38e8-ec14-41b8-8066-2bc5c818577a',
  description: 'John Doe',
  name: 'feature_name',
  isEnabled: true,
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

describe('FeaturesService', () => {
  let service: FeaturesService;
  let applicationsService: ApplicationsService;
  let repo: Repository<Feature>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeaturesService,
        {
          provide: getRepositoryToken(Feature),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(query),
            findOne: jest.fn().mockResolvedValue({ ...feature }),
            findAndCount: jest.fn().mockResolvedValue([[feature], 1]),
            create: jest.fn().mockReturnValue({ ...feature }),
            save: jest.fn(),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: ApplicationsService,
          useValue: {
            isApplicationExists: jest.fn().mockResolvedValue(query),
          },
        },
      ],
    }).compile();

    jest.clearAllMocks();

    service = module.get<FeaturesService>(FeaturesService);
    applicationsService = module.get<ApplicationsService>(ApplicationsService);
    repo = module.get<Repository<Feature>>(getRepositoryToken(Feature));
  });

  describe('create', () => {
    it('should successfully create a feature', async () => {
      jest.spyOn(service, 'isFeatureExists').mockResolvedValueOnce(false);
      await expect(
        service.create('appId', {
          name: 'Test Entity 1',
          description: 'Test Desc 1',
        }),
      ).resolves.toEqual(feature);

      expect(repo.create).toBeCalledTimes(1);
      expect(repo.create).toBeCalledWith({
        name: 'Test Entity 1',
        description: 'Test Desc 1',
        applicationId: 'appId',
      });
      expect(repo.save).toBeCalledTimes(1);
    });

    it('should throw an error if feature already exists', async () => {
      jest
        .spyOn(applicationsService, 'isApplicationExists')
        .mockResolvedValueOnce(true);

      await expect(
        service.create('appId', {
          name: 'Test Entity 1',
          description: 'Test Desc 1',
        }),
      ).rejects.toThrow('Feature already exists');
    });
  });

  describe('isFeatureExists', () => {
    it('should return false if feature with the given name does not exist', async () => {
      const repoSpy = jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);

      await expect(service.isFeatureExists('appId', 'someName')).resolves.toBe(
        false,
      );

      expect(repoSpy).toBeCalledTimes(1);
      expect(repoSpy).toBeCalledWith({ name: 'someName' });
    });

    it('should return true if feature with the given name exists', async () => {
      const repoSpy = jest
        .spyOn(repo, 'findOne')
        .mockResolvedValueOnce(<Feature>feature);

      await expect(service.isFeatureExists('appId', 'someName')).resolves.toBe(
        true,
      );

      expect(repoSpy).toBeCalledTimes(1);
      expect(repoSpy).toBeCalledWith({ name: 'someName' });
    });
  });

  describe('findAll', () => {
    it('should return all the features of the given app sorted by name', async () => {
      await expect(service.findAll('appId')).resolves.toEqual({
        data: [feature],
        total: 1,
      });

      expect(repo.findAndCount).toBeCalledTimes(1);
      expect(repo.findAndCount).toBeCalledWith({
        where: {
          applicationId: 'appId',
        },
        order: {
          name: 'DESC',
        },
      });
    });
  });

  describe('find', () => {
    it('should query the repository with the default params if no args are given', async () => {
      await expect(service.find('appId', <FindFeaturesDto>{})).resolves.toEqual(
        {
          data: [feature],
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
      expect(query.orderBy).toBeCalledWith('feature.updatedAt', 'DESC');

      expect(query.limit).toBeCalledTimes(1);
      expect(query.limit).toBeCalledWith(10);

      expect(query.getManyAndCount).toBeCalledTimes(1);
    });

    it('should be able to filter features by the creation date range', async () => {
      await expect(
        service.find('appId', <FindFeaturesDto>{
          createdFrom: new Date('2020-09-09'),
          createdTo: new Date('2020-09-14'),
        }),
      ).resolves.toEqual({
        data: [feature],
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
        data: [feature],
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
        data: [feature],
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
        data: [feature],
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
        data: [feature],
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
        data: [feature],
        total: 10,
      });

      expect(query.limit).toBeCalledTimes(1);
      expect(query.limit).toBeCalledWith(200);
    });
  });

  describe('findOne', () => {
    it('should get a single entity', async () => {
      await expect(service.findOne('appId', 'featureId')).resolves.toEqual(
        feature,
      );

      expect(repo.findOne).toBeCalledWith({
        id: 'featureId',
        applicationId: 'appId',
      });
    });

    it('should throw an error if a entity does not exist', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne('appId', 'featureId')).rejects.toThrow(
        'Entity does not exist',
      );
    });
  });

  describe('findOneByName', () => {
    it('should get a single entity', async () => {
      await expect(
        service.findOneByName('appId', 'featureName'),
      ).resolves.toEqual(feature);

      expect(repo.findOne).toBeCalledWith({
        name: 'featureName',
        applicationId: 'appId',
      });
    });

    it('should throw an error if a entity does not exist', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.findOneByName('appId', 'featureName'),
      ).rejects.toThrow('Entity does not exist');
    });
  });

  describe('enable', () => {
    it('should enable the feature', async () => {
      const entity = await service.enable('appId', 'a uuid');

      expect(entity).toEqual({
        ...feature,
        isEnabled: true,
      });

      expect(repo.update).toBeCalledTimes(1);
      expect(repo.update).toBeCalledWith('a uuid', {
        isEnabled: true,
      });
    });

    it('should throw an error if a entity does not exist', async () => {
      const error = new Error('Entity does not exist!');

      jest.spyOn(service, 'findOne').mockRejectedValueOnce(error);

      await expect(service.enable('appId', 'a uuid')).rejects.toThrow(
        'Entity does not exist!',
      );
    });
  });

  describe('disable', () => {
    it('should disable the feature', async () => {
      const entity = await service.disable('appId', 'a uuid');

      expect(entity).toEqual({
        ...feature,
        isEnabled: false,
      });

      expect(repo.update).toBeCalledTimes(1);
      expect(repo.update).toBeCalledWith('a uuid', {
        isEnabled: false,
      });
    });

    it('should throw an error if a entity does not exist', async () => {
      const error = new Error('Entity does not exist!');

      jest.spyOn(service, 'findOne').mockRejectedValueOnce(error);

      await expect(service.disable('appId', 'a uuid')).rejects.toThrow(
        'Entity does not exist!',
      );
    });
  });

  describe('remove', () => {
    it('should remove an enitity and return it', async () => {
      const result = await service.remove('appId', 'featureId');
      /* eslint-disable @typescript-eslint/no-unused-vars */
      /* eslint-enable @typescript-eslint/no-unused-vars */
      expect(result).toEqual(feature);
    });

    it('should throw an error if an entity with a given id does not exit', async () => {
      const error = new Error('Entity does not exist!');

      jest.spyOn(service, 'findOne').mockRejectedValueOnce(error);

      await expect(service.remove('appId', 'featureId')).rejects.toThrow(
        'Entity does not exist!',
      );
    });
  });

  describe('update', () => {
    it('should update the feature', async () => {
      const entity = await service.update('appId', 'a uuid', {
        description: 'Test Desc 1',
        isEnabled: true,
      });

      expect(entity).toEqual({
        ...feature,
        description: 'Test Desc 1',
        isEnabled: true,
      });

      expect(repo.update).toBeCalledTimes(1);
      expect(repo.update).toBeCalledWith('a uuid', {
        description: 'Test Desc 1',
        isEnabled: true,
      });
    });

    it('should throw an error if a entity does not exist', async () => {
      const error = new Error('Entity does not exist!');

      jest.spyOn(service, 'findOne').mockRejectedValueOnce(error);

      await expect(
        service.update('appId', 'a uuid', {
          description: 'Test Desc 1',
          isEnabled: true,
        }),
      ).rejects.toThrow('Entity does not exist!');
    });
  });
});
