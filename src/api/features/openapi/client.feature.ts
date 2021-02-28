import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export class ClientFeature {
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The name of the feature',
    'x-faker': 'git.branch',
  })
  name: string;

  @ApiProperty({
    description: 'Is feature enabled',
  })
  isEnabled: boolean;
}
