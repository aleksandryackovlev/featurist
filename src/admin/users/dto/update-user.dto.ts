import {
  IsString,
  IsNotEmpty,
  Matches,
  MinLength,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ValidateIf((o) => !o.roleId || o.password !== undefined)
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @Matches(/^[-A-Za-z\d@$!%*_#?&]{5,}$/, {
    message: 'password contains illegal characters',
  })
  @ApiProperty({
    example: 'somePassword',
    description: 'User password',
  })
  readonly password: string;

  @ValidateIf((o) => !o.password || o.roleId !== undefined)
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @ApiProperty({
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    description: 'The role id of a new user',
  })
  roleId: string;
}
