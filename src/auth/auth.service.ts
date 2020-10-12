import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, pwd: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (!user || !(await bcrypt.compare(pwd, user.password))) {
      return null;
    }

    const { password, ...result } = user;

    return result;
  }
}
