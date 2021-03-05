import {
  IsString,
  IsNotEmpty,
  Matches,
  MinLength,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(150)
  @Matches(/^[a-zA-Z][-._a-zA-Z\d]{3,}[a-zA-Z\d]$/, {
    message: 'username contains illegal characters',
  })
  @ApiProperty({
    example: 'someusername',
    description: 'The username of a new user',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @Matches(/^[-A-Za-z\d@$!%*_#?&]{5,}$/, {
    message: 'password contains illegal characters',
  })
  @ApiProperty({
    example: 'somePassword',
    description: 'The password of a new user',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @ApiProperty({
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    description: 'The role id of a new user',
  })
  roleId: string;
}
