import { ApiProperty } from '@nestjs/swagger';

import { Feature } from '../interfaces/feature';

export class FeatureSingleResponse {
  constructor(data: Feature) {
    this.data = data;
  }

  @ApiProperty({
    type: Feature,
  })
  data: Feature;
}
