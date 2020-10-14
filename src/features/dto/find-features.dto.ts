import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsIn,
  Min,
  MaxDate,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class FindFeaturesDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    default: 10,
    example: 10,
    minimum: 1,
    format: 'int32',
    description: 'The number of items to skip',
    required: false,
  })
  readonly offset: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    default: 10,
    example: 10,
    minimum: 1,
    format: 'int32',
    description: 'The number of items to return',
    required: false,
  })
  readonly limit: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Search string',
    description: 'The search string by which items should be searched',
    required: false,
  })
  readonly search: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @MaxDate(new Date(new Date().toISOString().split('T')[0]))
  @ApiProperty({
    example: '2020-09-09',
    description: 'The start of the creation date range',
    required: false,
    format: 'date',
  })
  readonly createdFrom: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @MaxDate(new Date(new Date().toISOString().split('T')[0]))
  @ApiProperty({
    example: '2020-09-09',
    description: 'The end of the creation date range',
    required: false,
    format: 'date',
  })
  readonly createdTo: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @MaxDate(new Date(new Date().toISOString().split('T')[0]))
  @ApiProperty({
    example: '2020-09-09',
    description: 'The start of the updating date range',
    required: false,
    format: 'date',
  })
  readonly updatedFrom: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @MaxDate(new Date(new Date().toISOString().split('T')[0]))
  @ApiProperty({
    example: '2020-09-09',
    description: 'The end of the updating date range',
    required: false,
    format: 'date',
  })
  readonly updatedTo: Date;

  @IsOptional()
  @IsString()
  @IsIn(['id', 'name', 'createdAt', 'updatedAt'])
  @ApiProperty({
    example: 'createdAt',
    default: 'createdAt',
    description: 'The field by which the result should be ordered',
    required: false,
    enum: ['id', 'name', 'createdAt', 'updatedAt'],
  })
  sortBy: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  @ApiProperty({
    example: 'desc',
    default: 'desc',
    description: 'The sort derection',
    required: false,
    enum: ['asc', 'desc'],
  })
  sortDirection: string;
}
