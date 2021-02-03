import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty({
    example: 'Application name',
    description: 'The name of a new application',
  })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  @ApiProperty({
    example: 'Application description',
    description: 'The description of a new application',
  })
  readonly description: string;
}
