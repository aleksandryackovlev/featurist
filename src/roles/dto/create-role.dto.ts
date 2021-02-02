import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'Name should contain at least 3 symbols',
  })
  @MaxLength(150, {
    message: 'Name should contain no more than 150 symbols',
  })
  @ApiProperty({
    example: 'Role name',
    description: 'The name of a new role',
  })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'Description should contain at least 3 symbols',
  })
  @MaxLength(1000, {
    message: 'Description should contian no more than 1000 symbols',
  })
  @ApiProperty({
    example: 'Role description',
    description: 'The description of a new role',
  })
  readonly description: string;
}
