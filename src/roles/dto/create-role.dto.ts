import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Role name',
    description: 'The name of a new role',
  })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Role description',
    description: 'The description of a new role',
  })
  readonly description: string;
}
