import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

import { AuthLocalGuard } from './guards/auth.local.guard';
import { AuthService } from './auth.service';

@Controller('admin/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiExcludeEndpoint()
  @UseGuards(AuthLocalGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
