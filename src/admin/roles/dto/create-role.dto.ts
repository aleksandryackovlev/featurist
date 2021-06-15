import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IsPermissions } from '../../permissions/validators/permissions.validator';
import {
  SwaggerPermission,
  Permission,
} from '../../permissions/permission.entity';

const permissions = ['create', 'read', 'update', 'delete'].reduce(
  (acc, action) => {
    return [
      ...acc,
      ...['Application', 'Feature', 'User', 'Role'].map((subject) => ({
        subject,
        action,
        isAllowed: true,
      })),
    ];
  },
  [],
);

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty({
    example: 'Role name',
    description: 'The name of a new role',
  })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  @ApiProperty({
    example: 'Role description',
    description: 'The description of a new role',
  })
  readonly description: string;

  @IsPermissions()
  @Type(() => Permission)
  @ApiProperty({
    example: permissions,
    description: 'Permissions',
    type: [SwaggerPermission],
  })
  permissions: Permission[];
}
