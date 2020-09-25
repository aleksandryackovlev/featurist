import { IsString, IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
