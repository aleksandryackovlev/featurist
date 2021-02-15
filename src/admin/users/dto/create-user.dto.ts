import {
  IsString,
  IsNotEmpty,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(150)
  @Matches(/^[a-zA-Z][-._a-zA-Z\d]{3,}[a-zA-Z\d]$/)
  @ApiProperty({
    example: 'username',
    description: 'The username of a new user',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @Matches(/^[A-Za-z\d@$!%*#?&]{5,}$/)
  @ApiProperty({
    example: 'somePassword',
    description: 'The password of a new user',
  })
  password: string;
}
