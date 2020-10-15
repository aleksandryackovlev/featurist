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
  CreateDto: CreateCustomEntityDto,
  UpdateDto: CreateCustomEntityDto,
}) {}

const entitiesArray = [
  new CustomEntity('Test Entity 1', 'Test Desc 1'),
  new CustomEntity('Test Entity 2', 'Test Desc 2'),
  new CustomEntity('Test Entity 3', 'Test Desc 3'),
];

const oneEntity = new CustomEntity('Test Entity 1', 'Test Desc 1');

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

    service = module.get<CustomEntityService>(CustomEntityService);
    repo = module.get<Repository<CustomEntity>>(
      getRepositoryToken(CustomEntity),
    );
  });

  describe('find', () => {
    it('should return an array of entities', async () => {
      const entities = await service.find({});
      expect(entities).toEqual({
        data: entitiesArray,
        total: 10,
      });
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
