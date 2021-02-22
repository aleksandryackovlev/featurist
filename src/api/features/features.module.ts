import { Module } from '@nestjs/common';

import { ApplicationsModule } from '../../admin/applications/applications.module';
import { FeaturesModule } from '../../admin/features/features.module';

import { ClientFeaturesController } from './features.controller';

@Module({
  imports: [ApplicationsModule, FeaturesModule],
  controllers: [ClientFeaturesController],
  providers: [],
})
export class ClientFeaturesModule {}
