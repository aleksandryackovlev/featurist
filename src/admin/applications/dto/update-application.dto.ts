import {
  IsString,
  IsNotEmpty,
  ValidateIf,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateApplicationDto {
  @ValidateIf((o) => !o.description || o.name !== undefined)
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty({
    example: 'Application name',
    description: 'The name of the application',
    required: false,
  })
  readonly name: string;

  @ValidateIf((o) => !o.name || o.description !== undefined)
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(1000)
  @ApiProperty({
    example: 'Application description',
    description: 'The description of the application',
    required: false,
  })
  readonly description: string;
}
