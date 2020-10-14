import { ApiProperty } from '@nestjs/swagger';

import { Application } from '../application.entity';

export class ApplicationSingleResponse {
  @ApiProperty({
    description: 'The applications',
    type: Application,
  })
  data: Application;
}
