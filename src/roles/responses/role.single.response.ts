import { ApiProperty } from '@nestjs/swagger';

import { Role } from '../role.entity';

export class RoleSingleResponse {
  constructor(data: Role) {
    this.data = data;
  }

  @ApiProperty({
    type: Role,
  })
  data: Role;
}
