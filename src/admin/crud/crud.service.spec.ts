import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Repository,
} from 'typeorm';
import { IsString, IsNotEmpty } from 'class-validator';

import { CrudService } from './crud.service';

import { IFindEntitiesDto as FindDtoType } from './interfaces';

import { CrudFindEntitiesDto } from './dto/find-entities.dto';

const FindDto = CrudFindEntitiesDto();

@Entity()
class CustomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  name: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  constructor(name: string, description?: string);
  constructor(name: string, description: string);
  constructor(name?: string, description?: string) {
    this.name = name || '';
    this.description = description || '';
  }
}

export class CreateCustomEntityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

class CustomEntityService extends CrudService({
  Entity: CustomEntity,
  name: 'application',
  CreateDto: CreateCustomEntityDto,
  UpdateDto: CreateCustomEntityDto,
  FindDto,
}) {}

const entitiesArray = [
  new CustomEntity('Test Entity 1', 'Test Desc 1'),
  new CustomEntity('Test Entity 2', 'Test Desc 2'),
  new CustomEntity('Test Entity 3', 'Test Desc 3'),
];

const oneEntity = new CustomEntity('Test Entity 1', 'Test Desc 1');

const query = {
  where: jest.fn(),
  andWhere: jest.fn(),
  offset: jest.fn(),
  limit: jest.fn(),
  orderBy: jest.fn(),
  getManyAndCount: jest.fn().mockReturnValue([entitiesArray, 3]),
};

describe('CrudService Factory', () => {
  let service: CustomEntityService;
  let repo: Repository<CustomEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomEntityService,
        {
          provide: getRepositoryToken(CustomEntity),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(query),
            findAndCount: jest.fn().mockResolvedValue([entitiesArray, 10]),
            findOne: jest.fn().mockResolvedValue(oneEntity),
            create: jest.fn().mockReturnValue(oneEntity),
            save: jest.fn(),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    jest.clearAllMocks();

    service = module.get<CustomEntityService>(CustomEntityService);
    repo = module.get<Repository<CustomEntity>>(
      getRepositoryToken(CustomEntity),
    );
  });

  describe('find', () => {
    it('should query the repository with the default params if no args are given', async () => {
      await expect(service.find(<FindDtoType>{})).resolves.toEqual({
        data: entitiesArray,
        total: 3,
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

    it('should be able to filter entities by the creation date range', async () => {
      await expect(
        service.find(<FindDtoType>{
          createdFrom: new Date('2020-09-09'),
          createdTo: new Date('2020-09-14'),
        }),
      ).resolves.toEqual({
        data: entitiesArray,
        total: 3,
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

    it('should be able to filter entities by the update date range', async () => {
      await expect(
        service.find(<FindDtoType>{
          updatedFrom: new Date('2020-09-09'),
          updatedTo: new Date('2020-09-14'),
        }),
      ).resolves.toEqual({
        data: entitiesArray,
        total: 3,
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

    it('should be able to filter entities by substring of the name', async () => {
      await expect(
        service.find(<FindDtoType>{ search: 'some name' }),
      ).resolves.toEqual({
        data: entitiesArray,
        total: 3,
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
        data: entitiesArray,
        total: 3,
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
        data: entitiesArray,
        total: 3,
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
        data: entitiesArray,
        total: 3,
      });

      expect(query.limit).toBeCalledTimes(1);
      expect(query.limit).toBeCalledWith(200);
    });
  });

  describe('findOne', () => {
    it('should get a single entity', async () => {
      const repoSpy = jest.spyOn(repo, 'findOne');
      await expect(service.findOne('a uuid')).resolves.toEqual(oneEntity);
      expect(repoSpy).toBeCalledWith('a uuid');
    });

    it('should throw an error if a entity does not exist', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);

      await expect(service.findOne('a uuid')).rejects.toThrow(
        'Entity does not exist',
      );
    });
  });

  describe('create', () => {
    it('should successfully insert an entity', async () => {
      await expect(
        service.create({
          name: 'Test Entity 1',
          description: 'Test Desc 1',
        }),
      ).resolves.toEqual(oneEntity);
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
      expect(entity).toEqual(oneEntity);
      expect(repo.update).toBeCalledTimes(1);
      expect(repo.update).toBeCalledWith('a uuid', {
        name: 'Test Entity 1',
        description: 'Test Desc 1',
      });
    });

    it('should throw an error if a entity does not exist', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.update('a uuid', {
          name: 'Test Entity 1',
          description: 'Test Desc 1',
        }),
      ).rejects.toThrow('Entity does not exist');
    });
  });

  describe('remove', () => {
    it('should return a deleted entity', () => {
      expect(service.remove('a uuid')).resolves.toEqual(oneEntity);
    });

    it('should throw an error if an entity with a given id does not exit', async () => {
      const repoSpy = jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);

      const repoDelSpy = jest.spyOn(repo, 'delete').mockResolvedValueOnce(null);

      await expect(service.remove('a bad uuid')).rejects.toThrow(
        'Entity does not exist',
      );
      expect(repoSpy).toBeCalledTimes(1);
      expect(repoDelSpy).toBeCalledTimes(0);
    });
  });
});
