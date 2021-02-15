import { IsString, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @Matches(/^[A-Za-z\d@$!%*#?&]{5,}$/)
  @ApiProperty({
    example: 'somePassword',
    description: 'User password',
  })
  readonly password: string;
}
