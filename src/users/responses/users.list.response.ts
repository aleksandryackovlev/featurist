import { ApiProperty } from '@nestjs/swagger';

import { User } from '../user.entity';

export class UsersListResponse {
  @ApiProperty({
    example: 10,
    description: 'The total amount of entities',
  })
  total: number;

  @ApiProperty({
    description: 'The list of users',
    type: () => [User],
  })
  data: User[];
}
