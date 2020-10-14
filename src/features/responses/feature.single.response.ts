import { ApiProperty } from '@nestjs/swagger';

import { Feature } from '../feature.entity';

export class FeatureSingleResponse {
  @ApiProperty({
    type: Feature,
  })
  data: Feature;
}
