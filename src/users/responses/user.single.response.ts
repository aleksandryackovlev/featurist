import { ApiProperty } from '@nestjs/swagger';

import { User } from '../user.entity';

export class UserSingleResponse {
  @ApiProperty({
    description: 'The user',
    type: User,
  })
  data: User;
}
