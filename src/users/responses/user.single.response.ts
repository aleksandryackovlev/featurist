import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { User } from '../user.entity';

export class UserSingleResponse {
  constructor(data: User) {
    this.data = data;
  }

  @ApiProperty({
    description: 'The user',
    type: User,
  })
  @Type(() => User)
  data: User;
}
