import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFeatureDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
