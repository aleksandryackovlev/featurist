import { ApiProperty } from '@nestjs/swagger';

import { Feature } from '../feature.entity';

export class FeatureSingleResponse {
  @ApiProperty({
    description: 'The feature',
    type: Feature,
  })
  data: Feature;
}
