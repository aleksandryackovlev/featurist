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
  async isApplicationExists(id: string): Promise<boolean> {
    const entity = await this.repository.findOne(id);

    return !!entity;
  }

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
    let method: 'where' | 'andWhere' = 'where';

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

    return query.getMany();
  }
}
