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

export class FindFeaturesDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly offset: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly limit: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly search: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @MaxDate(new Date(new Date().toISOString().split('T')[0]))
  readonly createdFrom: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @MaxDate(new Date(new Date().toISOString().split('T')[0]))
  readonly createdTo: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @MaxDate(new Date(new Date().toISOString().split('T')[0]))
  readonly updatedFrom: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @MaxDate(new Date(new Date().toISOString().split('T')[0]))
  readonly updatedTo: Date;

  @IsOptional()
  @IsString()
  @IsIn(['id', 'name', 'createdAt', 'updatedAt'])
  sortBy: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortDirection: string;
}
