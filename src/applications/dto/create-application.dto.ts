import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Application name',
    description: 'The name of a new application',
  })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Application description',
    description: 'The description of a new application',
  })
  readonly description: string;
}
