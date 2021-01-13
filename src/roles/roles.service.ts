import { CrudService } from '../crud/crud.service';

import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FindRolesDto } from './dto/find-roles.dto';

export class RolesService extends CrudService({
  name: 'role',
  Entity: Role,
  CreateDto: CreateRoleDto,
  UpdateDto: UpdateRoleDto,
  FindDto: FindRolesDto,
}) {
  async isRoleExists(id: string): Promise<boolean> {
    const entity = await this.repository.findOne(id);

    return !!entity;
  }
}
