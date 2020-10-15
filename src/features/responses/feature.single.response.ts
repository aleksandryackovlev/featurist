import { ApiProperty } from '@nestjs/swagger';

import { Feature } from '../feature.entity';

export class FeatureSingleResponse {
  constructor(data: Feature) {
    this.data = data;
  }

  @ApiProperty({
    type: Feature,
  })
  data: Feature;
}
