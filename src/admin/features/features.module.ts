import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Feature } from './feature.entity';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';
import { ApplicationsModule } from '../applications/applications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feature]), ApplicationsModule],
  controllers: [FeaturesController],
  providers: [FeaturesService],
  exports: [FeaturesService],
})
export class FeaturesModule {}
