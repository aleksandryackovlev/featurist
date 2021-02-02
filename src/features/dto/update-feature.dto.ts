import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFeatureDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'Description should contain at least 3 symbols',
  })
  @MaxLength(1000, {
    message: 'Description should contian no more than 1000 symbols',
  })
  @ApiProperty({
    example: 'Feature description',
    description: 'The description of the feature',
  })
  readonly description: string;

  @IsBoolean()
  @IsNotEmpty()
  @Type(() => Boolean)
  @ApiProperty({
    example: 'Is feature enabled',
    description: 'Is feature enabled',
  })
  readonly isEnabled: boolean;
}
