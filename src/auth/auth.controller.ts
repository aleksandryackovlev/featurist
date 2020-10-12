import { Controller, Request, Post, UseGuards } from '@nestjs/common';

import { AuthLocalGuard } from './guards/auth.local.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthLocalGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }
}
