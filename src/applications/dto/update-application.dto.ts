import { IsString, IsNotEmpty, ValidateIf } from 'class-validator';

export class UpdateApplicationDto {
  @ValidateIf(o => !o.description || o.name !== undefined)
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ValidateIf(o => !o.name || o.description !== undefined)
  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
