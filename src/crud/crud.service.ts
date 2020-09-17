import { Injectable, BadRequestException, Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntitySchema, DeepPartial } from 'typeorm';

export interface ICrudService<T> {
  readonly repository: Repository<T>;
  findAll: () => Promise<T[]>;
  findOne: (id: string) => Promise<T>;
  remove: (id: string) => Promise<T>;
  create: (createDto: DeepPartial<T>) => Promise<T>;
  update: (id: string, updateDto: DeepPartial<T>) => Promise<T>;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export const CrudService = <
  T,
  CreateDtoType = DeepPartial<T>,
  UpdateDtoType = DeepPartial<T>
>({
  Entity,
  CreateDto,
  UpdateDto,
}: {
  Entity: Type<T>;
  CreateDto: Type<CreateDtoType>;
  UpdateDto: Type<UpdateDtoType>;
}): new () => ICrudService<T> => {
  @Injectable()
  class CrudBaseService {
    @InjectRepository(<EntitySchema>(<unknown>Entity))
    readonly repository: Repository<T>;

    findAll(): Promise<T[]> {
      return this.repository.find();
    }

    async create(createDto: CreateDtoType): Promise<T> {
      const entity = this.repository.create(createDto);

      await this.repository.save(entity);

      return entity;
    }

    async update(id: string, updateDto: UpdateDtoType): Promise<T> {
      const entity = await this.findOne(id);

      if (!entity) {
        throw new BadRequestException('Entity does not exist');
      }

      await this.repository.update(id, updateDto);

      return entity;
    }

    findOne(id: string): Promise<T> {
      return this.repository.findOne(id);
    }

    async remove(id: string): Promise<T> {
      const entity = await this.findOne(id);

      if (!entity) {
        throw new BadRequestException('Entity does not exist');
      }

      await this.repository.delete(id);

      return entity;
    }
  }

  return CrudBaseService;
};
