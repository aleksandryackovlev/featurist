import { Type, Exclude, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { CrudSingleResponse } from '../../../core/crud/responses/crud.single.response';
import { Permission } from '../../permissions/permission.entity';

@Exclude()
export class UserCurrent {
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The username of the user',
    'x-faker': 'internet.userName',
  })
  @Expose()
  username: string;

  @ApiProperty(<ApiPropertyOptions>{
    description: 'Permissions',
    type: () => [Permission],
    'x-featurist': 'permissions',
  })
  @Expose()
  @Type(() => Permission)
  permissions: Permission[];
}

export class UserCurrentResponse extends CrudSingleResponse(UserCurrent) {}
