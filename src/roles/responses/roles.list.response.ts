import { ApiProperty } from '@nestjs/swagger';

import { Role } from '../role.entity';

export class RolesListResponse {
  constructor(data: Role[], total: number) {
    this.data = data;
    this.total = total;
  }

  @ApiProperty({
    example: 10,
    description: 'The total amount of entities',
  })
  total: number;

  @ApiProperty({
    description: 'The list of roles',
    type: () => [Role],
  })
  data: Role[];
}
