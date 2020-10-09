import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FindFeaturesDto } from './dto/find-features.dto';
import { Feature } from './interfaces/feature';
import { FeaturesService } from './features.service';

@Controller('applications/:appId/features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post()
  create(
    @Param('appId') appId: string,
    @Body() createFeatureDto: CreateFeatureDto,
  ): Promise<Feature> {
    return this.featuresService.create(appId, createFeatureDto);
  }

  @Get()
  findAll(
    @Param('appId') appId: string,
    @Query() findFeaturesDto: FindFeaturesDto,
  ): Promise<Feature[]> {
    return this.featuresService.find(appId, findFeaturesDto);
  }

  @Get(':id')
  findOne(
    @Param('appId') appId: string,
    @Param('id') id: string,
  ): Promise<Feature | null> {
    return this.featuresService.findOne(appId, id);
  }

  @Put(':id')
  update(
    @Param('appId') appId: string,
    @Param('id') id: string,
    @Body() updateFeatureDto: UpdateFeatureDto,
  ): Promise<Feature> {
    return this.featuresService.update(appId, id, updateFeatureDto);
  }

  @Put(':id/enable')
  enable(
    @Param('appId') appId: string,
    @Param('id') id: string,
  ): Promise<Feature> {
    return this.featuresService.enable(appId, id);
  }

  @Put(':id/disable')
  disable(
    @Param('appId') appId: string,
    @Param('id') id: string,
  ): Promise<Feature> {
    return this.featuresService.disable(appId, id);
  }

  @Delete(':id')
  remove(
    @Param('appId') appId: string,
    @Param('id') id: string,
  ): Promise<Feature> {
    return this.featuresService.remove(appId, id);
  }
}
