import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeatureDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z][-._a-zA-Z\d]{3,}[a-zA-Z\d]$/)
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
