import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFeatureDto {
  @IsString()
  @IsNotEmpty()
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
