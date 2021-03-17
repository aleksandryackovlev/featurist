import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

import { ApiErrorResponses } from '../../core/decorators/api-error.responses.decorator';

import { AuthLocalGuard } from './guards/auth.local.guard';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AuthLoginResponse } from './responses/auth.login.response';

@ApiTags('Auth')
@Controller('admin/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthLocalGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Login',
    operationId: 'login',
  })
  @ApiBody({
    type: AuthLoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Access token',
    type: AuthLoginResponse,
  })
  @ApiErrorResponses(401, 500)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
