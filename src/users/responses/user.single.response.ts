import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { User } from '../user.entity';

export class UserSingleResponse {
  constructor(data: User) {
    this.data = data;
  }

  @ApiProperty({
    type: User,
  })
  @Type(() => User)
  data: User;
}
