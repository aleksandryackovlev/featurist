import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntitySchema, DeepPartial } from 'typeorm';

export interface ICrudService<T> {
  readonly repository: Repository<T>;
  find(findDto: any): Promise<{ data: T[]; total: number }>; // any is because of https://github.com/microsoft/TypeScript/issues/30071
  findOne(id: string): Promise<T>;
  remove(id: string): Promise<T>;
  create(createDto: DeepPartial<T>): Promise<T>;
  update(id: string, updateDto: DeepPartial<T>): Promise<T>;
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

    async find(): Promise<{ data: T[]; total: number }> {
      const [data, total] = await this.repository.findAndCount();
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
        throw new BadRequestException('Entity does not exist');
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
        throw new BadRequestException('Entity does not exist');
      }

      await this.repository.delete(id);

      return entity;
    }
  }

  return CrudBaseService;
};
