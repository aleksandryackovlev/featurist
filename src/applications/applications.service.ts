import { Get } from '@nestjs/common';
import { CrudService } from '../crud/crud.service';

import { Application } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { FindApplicationsDto } from './dto/find-applications.dto';

export class ApplicationsService extends CrudService({
  Entity: Application,
  CreateDto: CreateApplicationDto,
  UpdateDto: UpdateApplicationDto,
}) {
  @Get()
  async find(findApplicationsDto: FindApplicationsDto): Promise<Application[]> {
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

    const query = this.repository.createQueryBuilder('application');

    if (createdFrom) {
      query.where('CAST (application.createdAt AS DATE) >= :createdFrom', {
        createdFrom,
      });
    }

    if (createdTo) {
      query.where('CAST (application.createdAt AS DATE) <= :createdTo', {
        createdTo,
      });
    }

    if (updatedFrom) {
      query.where('CAST (application.updatedAt AS DATE) >= :updatedFrom', {
        updatedFrom,
      });
    }

    if (updatedTo) {
      query.where('CAST (application.updatedAt AS DATE) <= :updatedTo', {
        updatedTo,
      });
    }

    if (search) {
      query.where('application.name LIKE :search', { search: `%${search}%` });
    }

    if (offset) {
      query.offset(offset);
    }

    return query
      .orderBy(
        `application.${sortBy}`,
        <'ASC' | 'DESC'>sortDirection.toUpperCase(),
      )
      .limit(limit)
      .getMany();
  }
}
