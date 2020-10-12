import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthJwtGuard } from '../auth/guards/auth.jwt.guard';

import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FindFeaturesDto } from './dto/find-features.dto';
import { Feature } from './interfaces/feature';
import { FeaturesService } from './features.service';

@ApiTags('features')
@ApiBearerAuth()
@UseGuards(AuthJwtGuard)
@Controller('applications/:appId/features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Get()
  @ApiOperation({ summary: 'Find features by params' })
  @ApiResponse({
    status: 200,
    description: 'The list of found features',
    type: [Feature],
  })
  @ApiResponse({ status: 400, description: 'Invalid search parameters' })
  find(
    @Param('appId') appId: string,
    @Query() findFeaturesDto: FindFeaturesDto,
  ): Promise<Feature[]> {
    return this.featuresService.find(appId, findFeaturesDto);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new feature' })
  @ApiResponse({
    status: 201,
    description: 'The created feature',
    type: Feature,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  create(
    @Param('appId') appId: string,
    @Body() createFeatureDto: CreateFeatureDto,
  ): Promise<Feature> {
    return this.featuresService.create(appId, createFeatureDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get feature by id' })
  @ApiResponse({
    status: 200,
    description: 'The feature',
    type: Feature,
  })
  findOne(
    @Param('appId') appId: string,
    @Param('id') id: string,
  ): Promise<Feature> {
    return this.featuresService.findOne(appId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update the feature' })
  @ApiResponse({
    status: 200,
    description: 'The updated feature',
    type: Feature,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  update(
    @Param('appId') appId: string,
    @Param('id') id: string,
    @Body() updateFeatureDto: UpdateFeatureDto,
  ): Promise<Feature> {
    return this.featuresService.update(appId, id, updateFeatureDto);
  }

  @Post(':id/enable')
  @ApiOperation({ summary: 'Enable the feature' })
  @ApiResponse({
    status: 200,
    description: 'The enabled feature',
    type: Feature,
  })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  enable(
    @Param('appId') appId: string,
    @Param('id') id: string,
  ): Promise<Feature> {
    return this.featuresService.enable(appId, id);
  }

  @Post(':id/disable')
  @ApiOperation({ summary: 'Disable the feature' })
  @ApiResponse({
    status: 200,
    description: 'The disabled feature',
    type: Feature,
  })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  disable(
    @Param('appId') appId: string,
    @Param('id') id: string,
  ): Promise<Feature> {
    return this.featuresService.disable(appId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the feature' })
  @ApiResponse({
    status: 200,
    description: 'The deleted feature',
    type: Feature,
  })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  remove(
    @Param('appId') appId: string,
    @Param('id') id: string,
  ): Promise<Feature> {
    return this.featuresService.remove(appId, id);
  }
}
