/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/user.entity';

import { Application } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { FindApplicationsDto } from './dto/find-applications.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly repository: Repository<Application>,
  ) {}

  async isApplicationExists(id: string, userId?: string): Promise<boolean> {
    const query = this.repository.createQueryBuilder('application');

    if (userId) {
      query.innerJoin(
        'application.users',
        'user',
        'application_user.user_id = :userId',
        { userId },
      );
    }

    query.where('application.id = :id', { id });
    const entity = await query.getOne();

    return !!entity;
  }

  async create(
    createApplicationDto: CreateApplicationDto,
    user: User,
  ): Promise<Application> {
    const entity = this.repository.create(createApplicationDto);
    entity.users = [user];

    await this.repository.save(entity);

    const { users, ...application } = entity;
    return application as Application;
  }

  async update(
    id: string,
    updateApplicationDto: UpdateApplicationDto,
    userId?: string,
  ): Promise<Application> {
    const entity = await this.findOne(id, userId);

    await this.repository.update(id, updateApplicationDto);

    return { ...entity, ...updateApplicationDto };
  }

  async findOne(id: string, userId?: string): Promise<Application> {
    const query = this.repository.createQueryBuilder('application');

    if (userId) {
      query.innerJoin(
        'application.users',
        'user',
        'application_user.user_id = :userId',
        { userId },
      );
    }

    query.where('application.id = :id', { id });
    const entity = await query.getOne();

    if (!entity) {
      throw new NotFoundException('Entity does not exist');
    }

    return entity;
  }

  async find(
    findApplicationsDto: FindApplicationsDto,
    userId?: string,
  ): Promise<{ data: Application[]; total: number }> {
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
    } = findApplicationsDto;

    let method = 'where';

    const query = this.repository.createQueryBuilder('application');

    if (userId) {
      query.innerJoin(
        'application.users',
        'user',
        'application_user.user_id = :userId',
        { userId },
      );
    }

    if (createdFrom) {
      query[method]('CAST (application.createdAt AS DATE) >= :createdFrom', {
        createdFrom,
      });

      method = 'andWhere';
    }

    if (createdTo) {
      query[method]('CAST (application.createdAt AS DATE) <= :createdTo', {
        createdTo,
      });
      method = 'andWhere';
    }

    if (updatedFrom) {
      query[method]('CAST (application.updatedAt AS DATE) >= :updatedFrom', {
        updatedFrom,
      });
      method = 'andWhere';
    }

    if (updatedTo) {
      query[method]('CAST (application.updatedAt AS DATE) <= :updatedTo', {
        updatedTo,
      });
      method = 'andWhere';
    }

    if (search) {
      query[method]('application.name LIKE :search', { search: `%${search}%` });
      method = 'andWhere';
    }

    if (offset) {
      query.offset(offset);
    }

    query.orderBy(
      `application.${sortBy}`,
      <'ASC' | 'DESC'>sortDirection.toUpperCase(),
    );
    query.limit(limit);

    const [applications, total] = await query.getManyAndCount();

    return {
      data: applications,
      total,
    };
  }

  async remove(id: string, userId?: string): Promise<Application> {
    const query = this.repository.createQueryBuilder('application');

    if (userId) {
      query.innerJoinAndSelect(
        'application.users',
        'user',
        'application_user.user_id = :userId',
        { userId },
      );
    }

    const result = await query
      .leftJoinAndSelect('application.features', 'feature')
      .where('application.id = :id', { id })
      .getOne();

    if (!result) {
      throw new NotFoundException('Entity does not exist');
    }

    const { features, users, ...entity } = result;

    if (features && features.length) {
      throw new BadRequestException('Related entities should be deleted first');
    }

    result.users = [];
    await this.repository.save(result);

    await this.repository.delete(id);

    return entity as Application;
  }
}
