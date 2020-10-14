import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { User } from '../user.entity';

export class UsersListResponse {
  constructor(data: User[], total: number) {
    this.data = data;
    this.total = total;
  }

  @ApiProperty({
    example: 10,
    description: 'The total amount of entities',
  })
  total: number;

  @ApiProperty({
    description: 'The list of users',
    type: () => [User],
  })
  @Type(() => User)
  data: User[];
}
