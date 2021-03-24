import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import { CrudSingleResponse } from '../../../core/crud/responses/crud.single.response';
import {
  Permission,
  SwaggerPermission,
} from '../../permissions/permission.entity';

import { Role as RoleEntity } from '../role.entity';

class Role extends RoleEntity {
  @ApiProperty(<ApiPropertyOptions>{
    description: 'Permissions',
    type: () => [SwaggerPermission],
    'x-featurist': 'permissions',
  })
  permissions: Permission[];
}

export class RoleSingleResponse extends CrudSingleResponse(Role) {}
