import { IsNotEmpty, IsUUID, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class HeadersDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @Expose({ name: 'x-application-id' })
  'appId': string;
}
