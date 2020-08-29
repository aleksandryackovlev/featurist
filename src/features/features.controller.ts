import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { CreateFeatureDto } from './dto/create-feature.dto';
import { FeaturesService } from './features.service';

@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post()
  create(@Body() createFeatureDto: CreateFeatureDto): Promise<void> {
    return this.featuresService.create(createFeatureDto);
  }

  @Get()
  findAll(): Promise<string[]> {
    return this.featuresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<string | null> {
    return this.featuresService.findOne(id);
  }

  @Put(':id/enable')
  enable(@Param('id') id: string): Promise<void> {
    return this.featuresService.enable(id);
  }

  @Put(':id/disable')
  disable(@Param('id') id: string): Promise<void> {
    return this.featuresService.disable(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.featuresService.remove(id);
  }
}
