import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

/* eslint-disable @typescript-eslint/no-unused-vars */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pwd: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (!user || !(await bcrypt.compare(pwd, user.password))) {
      return null;
    }

    const { password, ...result } = user;

    return result;
  }

  async login(user: any) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }
}
