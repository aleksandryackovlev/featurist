import { ApiProperty } from '@nestjs/swagger';

import { Feature } from '../feature.entity';

export class FeaturesListResponse {
  constructor(data: Feature[], total: number) {
    this.data = data;
    this.total = total;
  }

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
