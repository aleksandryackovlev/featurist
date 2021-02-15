import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty({
    example: 'Role name',
    description: 'The name of a new role',
  })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  @ApiProperty({
    example: 'Role description',
    description: 'The description of a new role',
  })
  readonly description: string;
}
