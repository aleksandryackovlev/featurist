import { ApiProperty } from '@nestjs/swagger';

import { Feature as FeatureEntity } from '../feature.entity';

export class Feature extends FeatureEntity {
  @ApiProperty({
    example: true,
    description: 'Is the feature enabled',
  })
  isEnabled: boolean;
}
