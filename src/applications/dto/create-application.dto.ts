import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'Name should contain at least 3 symbols',
  })
  @MaxLength(150, {
    message: 'Name should contain no more than 150 symbols',
  })
  @ApiProperty({
    example: 'Application name',
    description: 'The name of a new application',
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
    example: 'Application description',
    description: 'The description of a new application',
  })
  readonly description: string;
}
