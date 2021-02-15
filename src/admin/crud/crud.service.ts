import { Injectable, NotFoundException, Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntitySchema, DeepPartial } from 'typeorm';

import { CrudFindEntitiesDto } from './dto/find-entities.dto';
import { ICrudService, IFindEntitiesDto as FindDtoType } from './interfaces';

const FindEntitiesDto = CrudFindEntitiesDto();

/* eslint-disable @typescript-eslint/no-unused-vars */
export const CrudService = <
  T,
  CreateDtoType = DeepPartial<T>,
  UpdateDtoType = DeepPartial<T>
>({
  Entity,
  name,
  searchBy = 'name',
  CreateDto,
  UpdateDto,
  FindDto = FindEntitiesDto,
}: {
  Entity: Type<T>;
  name: string;
  searchBy?: string;
  CreateDto: Type<CreateDtoType>;
  UpdateDto: Type<UpdateDtoType>;
  FindDto?: Type<FindDtoType>;
}): new () => ICrudService<T, FindDtoType> => {
  @Injectable()
  class CrudBaseService {
    @InjectRepository(<EntitySchema>(<unknown>Entity))
    readonly repository: Repository<T>;

    async find(
      findEntitiesDto: FindDtoType,
    ): Promise<{ data: T[]; total: number }> {
      const {
        createdFrom,
        createdTo,
        updatedFrom,
        updatedTo,
        search,
        sortBy = 'createdAt',
        sortDirection = 'desc',
        offset,
        limit = 10,
      } = findEntitiesDto;

      const query = this.repository.createQueryBuilder(name);
      let method: 'where' | 'andWhere' = 'where';

      if (createdFrom) {
        query[method](`CAST (${name}.createdAt AS DATE) >= :createdFrom`, {
          createdFrom,
        });

        method = 'andWhere';
      }

      if (createdTo) {
        query[method](`CAST (${name}.createdAt AS DATE) <= :createdTo`, {
          createdTo,
        });

        method = 'andWhere';
      }

      if (updatedFrom) {
        query[method](`CAST (${name}.updatedAt AS DATE) >= :updatedFrom`, {
          updatedFrom,
        });

        method = 'andWhere';
      }

      if (updatedTo) {
        query[method](`CAST (${name}.updatedAt AS DATE) <= :updatedTo`, {
          updatedTo,
        });

        method = 'andWhere';
      }

      if (search) {
        query[method](`${name}.${searchBy} LIKE :search`, {
          search: `%${search}%`,
        });

        method = 'andWhere';
      }

      if (offset) {
        query.offset(offset);
      }

      query.orderBy(
        `${name}.${sortBy}`,
        <'ASC' | 'DESC'>sortDirection.toUpperCase(),
      );

      query.limit(limit);

      const [data, total] = await query.getManyAndCount();

      return {
        total,
        data,
      };
    }

    async create(createDto: CreateDtoType): Promise<T> {
      const entity = this.repository.create(createDto);

      await this.repository.save(entity);

      return entity;
    }

    async update(id: string, updateDto: UpdateDtoType): Promise<T> {
      const entity = await this.repository.findOne(id);

      if (!entity) {
        throw new NotFoundException('Entity does not exist');
      }

      await this.repository.update(id, updateDto);

      return { ...entity, ...updateDto };
    }

    async findOne(id: string): Promise<T> {
      const entity = await this.repository.findOne(id);

      if (!entity) {
        throw new NotFoundException('Entity does not exist');
      }

      return entity;
    }

    async remove(id: string): Promise<T> {
      const entity = await this.repository.findOne(id);

      if (!entity) {
        throw new NotFoundException('Entity does not exist');
      }

      await this.repository.delete(id);

      return entity;
    }
  }

  return CrudBaseService;
};
