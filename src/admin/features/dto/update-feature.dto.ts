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
  @MinLength(3)
  @MaxLength(1000)
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
