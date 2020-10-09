import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFeatureDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Feature description',
    description: 'The description of the feature',
    required: false,
  })
  readonly description: string;
}
