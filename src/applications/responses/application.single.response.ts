import { ApiProperty } from '@nestjs/swagger';

import { Application } from '../application.entity';

export class ApplicationSingleResponse {
  @ApiProperty({
    type: Application,
  })
  data: Application;
}
