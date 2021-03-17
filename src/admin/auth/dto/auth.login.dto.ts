import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({
    example: 'admin',
    description: 'Username',
  })
  readonly username: string;

  @ApiProperty({
    example: 'test',
    description: 'Password',
  })
  readonly password: string;
}
