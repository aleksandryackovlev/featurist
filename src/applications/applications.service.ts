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
}
