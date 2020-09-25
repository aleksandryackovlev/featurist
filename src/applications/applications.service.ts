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
  async find(
    findApplicationsDto: FindApplicationsDto,
  ): Promise<FindApplicationsDto> {
    return findApplicationsDto;
  }
}
