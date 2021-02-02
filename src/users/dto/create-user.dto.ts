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
  @MinLength(3, {
    message: 'Username should contain at least 3 symbols',
  })
  @MaxLength(150, {
    message: 'Username should contain no more than 150 symbols',
  })
  @Matches(/^[a-zA-Z][-._a-zA-Z\d]{3,}[a-zA-Z\d]$/)
  @ApiProperty({
    example: 'username',
    description: 'The username of a new user',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5, {
    message: 'Password should contain at least 5 symbols',
  })
  @Matches(/^[A-Za-z\d@$!%*#?&]{5,}$/)
  @ApiProperty({
    example: 'somePassword',
    description: 'The password of a new user',
  })
  password: string;
}
