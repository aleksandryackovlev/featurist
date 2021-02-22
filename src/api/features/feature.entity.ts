import { Exclude, Expose } from 'class-transformer';
import { Feature } from '../../admin/features/feature.entity';

@Exclude()
export class ClientFeature extends Feature {
  @Expose()
  name: string;

  @Expose()
  isEnabled: boolean;
}
