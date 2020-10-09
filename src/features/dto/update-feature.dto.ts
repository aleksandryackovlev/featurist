import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateFeatureDto {
  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
