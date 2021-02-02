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
  @MinLength(3, {
    message: 'Name should contain at least 3 symbols',
  })
  @MaxLength(150, {
    message: 'Name should contain no more than 150 symbols',
  })
  @ApiProperty({
    example: 'Application name',
    description: 'The name of the application',
    required: false,
  })
  readonly name: string;

  @ValidateIf((o) => !o.name || o.description !== undefined)
  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'Description should contain at least 3 symbols',
  })
  @MaxLength(1000, {
    message: 'Description should contian no more than 1000 symbols',
  })
  @ApiProperty({
    example: 'Application description',
    description: 'The description of the application',
    required: false,
  })
  readonly description: string;
}
