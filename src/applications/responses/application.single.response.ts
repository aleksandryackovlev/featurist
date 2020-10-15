import { ApiProperty } from '@nestjs/swagger';

import { Application } from '../application.entity';

export class ApplicationSingleResponse {
  constructor(data: Application) {
    this.data = data;
  }

  @ApiProperty({
    type: Application,
  })
  data: Application;
}
