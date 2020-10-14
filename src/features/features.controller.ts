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

import { FeaturesListResponse } from './responses/features.list.response';
import { FeatureSingleResponse } from './responses/feature.single.response';

import { Feature } from './interfaces/feature';
import { FeaturesService } from './features.service';

@ApiTags('Features')
@ApiBearerAuth()
@UseGuards(AuthJwtGuard)
@Controller('applications/:appId/features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Get()
  @ApiOperation({
    summary: 'Find features by params',
    operationId: 'getFeatures',
  })
  @ApiResponse({
    status: 200,
    description: 'The list of found features',
    type: FeaturesListResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid search parameters' })
  find(
    @Param('appId') appId: string,
    @Query() findFeaturesDto: FindFeaturesDto,
  ): Promise<{ data: Feature[]; total: number }> {
    return this.featuresService.find(appId, findFeaturesDto);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new feature',
    operationId: 'createFeature',
  })
  @ApiResponse({
    status: 201,
    description: 'The created feature',
    type: FeatureSingleResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async create(
    @Param('appId') appId: string,
    @Body() createFeatureDto: CreateFeatureDto,
  ): Promise<{ data: Feature }> {
    return {
      data: await this.featuresService.create(appId, createFeatureDto),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get feature by id',
    operationId: 'getFeature',
  })
  @ApiResponse({
    status: 200,
    description: 'The feature',
    type: FeatureSingleResponse,
  })
  async findOne(
    @Param('appId') appId: string,
    @Param('id') id: string,
  ): Promise<{ data: Feature }> {
    return {
      data: await this.featuresService.findOne(appId, id),
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update the feature',
    operationId: 'updateFeature',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated feature',
    type: FeatureSingleResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async update(
    @Param('appId') appId: string,
    @Param('id') id: string,
    @Body() updateFeatureDto: UpdateFeatureDto,
  ): Promise<{ data: Feature }> {
    return {
      data: await this.featuresService.update(appId, id, updateFeatureDto),
    };
  }

  @Post(':id/enable')
  @ApiOperation({
    summary: 'Enable the feature',
    operationId: 'enableFeature',
  })
  @ApiResponse({
    status: 200,
    description: 'The enabled feature',
    type: FeatureSingleResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  async enable(
    @Param('appId') appId: string,
    @Param('id') id: string,
  ): Promise<{ data: Feature }> {
    return {
      data: await this.featuresService.enable(appId, id),
    };
  }

  @Post(':id/disable')
  @ApiOperation({
    summary: 'Disable the feature',
    operationId: 'disableFeature',
  })
  @ApiResponse({
    status: 200,
    description: 'The disabled feature',
    type: FeatureSingleResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  async disable(
    @Param('appId') appId: string,
    @Param('id') id: string,
  ): Promise<{ data: Feature }> {
    return {
      data: await this.featuresService.disable(appId, id),
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete the feature',
    operationId: 'deleteFeature',
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted feature',
    type: FeatureSingleResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  async remove(
    @Param('appId') appId: string,
    @Param('id') id: string,
  ): Promise<{ data: Feature }> {
    return {
      data: await this.featuresService.remove(appId, id),
    };
  }
}
