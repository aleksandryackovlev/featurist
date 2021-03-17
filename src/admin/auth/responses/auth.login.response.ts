import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import { CrudSingleResponse } from '../../../core/crud/responses/crud.single.response';

export class LoginResponse {
  @ApiProperty(<ApiPropertyOptions>{
    description: 'Access token',
    'x-faker': 'internet.password',
  })
  access_token: string;
}

export class AuthLoginResponse extends CrudSingleResponse(LoginResponse) {}
