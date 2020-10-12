import { Controller, Request, Post, UseGuards } from '@nestjs/common';

import { AuthLocalGuard } from './guards/auth.local.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthLocalGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
