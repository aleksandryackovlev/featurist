import { ApiProperty } from '@nestjs/swagger';

import { Application } from '../application.entity';

export class ApplicationsListResponse {
  constructor(data: Application[], total: number) {
    this.data = data;
    this.total = total;
  }

  @ApiProperty({
    example: 10,
    description: 'The total amount of entities',
  })
  total: number;

  @ApiProperty({
    description: 'The list of applications',
    type: () => [Application],
  })
  data: Application[];
}
