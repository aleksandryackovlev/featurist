import {
  IsString,
  IsNotEmpty,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeatureDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(150)
  @Matches(/^[a-zA-Z][-._a-zA-Z\d]{3,}[a-zA-Z\d]$/, {
    message: 'name should contain only letters digits and -._ symbols',
  })
  @ApiProperty({
    example: 'Feature name',
    description: 'The name of a new feature',
  })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  @ApiProperty({
    example: 'Feature description',
    description: 'The description of a new feature',
  })
  readonly description: string;
}
