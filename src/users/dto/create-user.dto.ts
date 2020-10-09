import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'username',
    description: 'The username of a new user',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'somePassword',
    description: 'The password of a new user',
  })
  password: string;
}
