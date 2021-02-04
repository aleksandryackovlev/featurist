import { NotFoundException, BadRequestException } from '@nestjs/common';

import { CrudService } from '../crud/crud.service';

import { Application } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { FindApplicationsDto } from './dto/find-applications.dto';

export class ApplicationsService extends CrudService({
  name: 'application',
  Entity: Application,
  CreateDto: CreateApplicationDto,
  UpdateDto: UpdateApplicationDto,
  FindDto: FindApplicationsDto,
}) {
  async isApplicationExists(id: string): Promise<boolean> {
    const entity = await this.repository.findOne(id);

    return !!entity;
  }

  async remove(id: string): Promise<Application> {
    const result = await this.repository.findOne(id, {
      relations: ['features'],
    });

    if (!result) {
      throw new NotFoundException('Entity does not exist');
    }

    const { features, ...entity } = result;

    if (features && features.length) {
      throw new BadRequestException('Related entities should be deleted first');
    }

    await this.repository.delete(id);

    return entity as Application;
  }
}
