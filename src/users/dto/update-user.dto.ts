import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\d@$!%*#?&]{5,}$/)
  @ApiProperty({
    example: 'somePassword',
    description: 'User password',
  })
  readonly password: string;
}
