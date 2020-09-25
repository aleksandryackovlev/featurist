import {
  IsString,
  IsInt,
  IsDate,
  IsNotEmpty,
  IsOptional,
  Min,
  MaxDate,
} from 'class-validator';

export class FindApplicationsDto {
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
  @MaxDate(new Date(new Date().toISOString().split('T')[0]))
  readonly createdFrom: Date;

  @IsOptional()
  @IsDate()
  @MaxDate(new Date(new Date().toISOString().split('T')[0]))
  readonly createdTo: Date;

  @IsOptional()
  @IsDate()
  @MaxDate(new Date(new Date().toISOString().split('T')[0]))
  readonly updatedFrom: Date;

  @IsOptional()
  @IsDate()
  @MaxDate(new Date(new Date().toISOString().split('T')[0]))
  readonly updatedTo: Date;
}
