import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeatureDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Feature name',
    description: 'The name of a new feature',
  })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Feature description',
    description: 'The description of a new feature',
  })
  readonly description: string;
}
