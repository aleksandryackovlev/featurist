import { ApiProperty } from '@nestjs/swagger';

import { Feature } from '../feature.entity';

export class FeaturesListResponse {
  @ApiProperty({
    example: 10,
    description: 'The total amount of entities',
  })
  total: number;

  @ApiProperty({
    description: 'The list of features',
    type: () => [Feature],
  })
  data: Feature[];
}
