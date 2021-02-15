import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsISO8601,
  Matches,
  IsNotEmpty,
  IsOptional,
  IsIn,
  Min,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { IFindEntitiesDto } from '../interfaces';

import { MaxDate } from '../../../utils/validators/max-date';

export const CrudFindEntitiesDto = (
  sortFields = ['id', 'name', 'createdAt', 'updatedAt'],
): new () => IFindEntitiesDto => {
  class FindEntitiesDto {
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
    @IsISO8601()
    @Matches(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/, {
      message: 'createdFrom should in the YYYY-MM-DD format',
    })
    @MaxDate(new Date(new Date().toISOString().split('T')[0]))
    @ApiProperty({
      example: '2020-09-09',
      description: 'The start of the creation date range',
      required: false,
      type: 'string',
      format: 'date',
    })
    readonly createdFrom: Date;

    @IsOptional()
    @IsISO8601()
    @Matches(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/, {
      message: 'createdTo should in the YYYY-MM-DD format',
    })
    @MaxDate(new Date(new Date().toISOString().split('T')[0]))
    @ApiProperty({
      example: '2020-09-09',
      description: 'The end of the creation date range',
      required: false,
      type: 'string',
      format: 'date',
    })
    readonly createdTo: Date;

    @IsOptional()
    @IsISO8601()
    @Matches(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/, {
      message: 'updatedFrom should in the YYYY-MM-DD format',
    })
    @MaxDate(new Date(new Date().toISOString().split('T')[0]))
    @ApiProperty({
      example: '2020-09-09',
      description: 'The start of the updating date range',
      required: false,
      type: 'string',
      format: 'date',
    })
    readonly updatedFrom: Date;

    @IsOptional()
    @IsISO8601()
    @Matches(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/, {
      message: 'updatedTo should in the YYYY-MM-DD format',
    })
    @MaxDate(new Date(new Date().toISOString().split('T')[0]))
    @ApiProperty({
      example: '2020-09-09',
      description: 'The end of the updating date range',
      required: false,
      type: 'string',
      format: 'date',
    })
    readonly updatedTo: Date;

    @IsOptional()
    @IsString()
    @IsIn(sortFields)
    @ApiProperty({
      example: 'createdAt',
      default: 'createdAt',
      description: 'The field by which the result should be ordered',
      required: false,
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

  return FindEntitiesDto;
};
