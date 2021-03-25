import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import { CrudSingleResponse } from '../../../core/crud/responses/crud.single.response';
import {
  Permission,
  SwaggerPermission,
} from '../../permissions/permission.entity';

import { Role } from '../role.entity';

class RoleSingle extends Role {
  @ApiProperty(<ApiPropertyOptions>{
    description: 'Permissions',
    type: () => [SwaggerPermission],
    'x-featurist': 'permissions',
  })
  permissions: Permission[];
}

export class RoleSingleResponse extends CrudSingleResponse(RoleSingle) {}
