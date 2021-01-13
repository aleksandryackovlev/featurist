import { IsString, IsNotEmpty, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ValidateIf((o) => !o.description || o.name !== undefined)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Role name',
    description: 'The name of the role',
    required: false,
  })
  readonly name: string;

  @ValidateIf((o) => !o.name || o.description !== undefined)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Role description',
    description: 'The description of the role',
    required: false,
  })
  readonly description: string;
}
