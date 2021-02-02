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
  @MinLength(3, {
    message: 'Name should contain at least 3 symbols',
  })
  @MaxLength(150, {
    message: 'Name should contain no more than 150 symbols',
  })
  @Matches(/^[a-zA-Z][-._a-zA-Z\d]{3,}[a-zA-Z\d]$/)
  @ApiProperty({
    example: 'Feature name',
    description: 'The name of a new feature',
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
    example: 'Feature description',
    description: 'The description of a new feature',
  })
  readonly description: string;
}
