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
  ParseUUIDPipe,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthJwtGuard } from '../auth/guards/auth.jwt.guard';

import { PoliciesGuard } from '../permissions/guards/permissions.policies.guard';
import { CheckPolicies } from '../permissions/decorators/permissions.check-policies';
import { AppAbility } from '../permissions/permissions-ability.factory';

import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FindFeaturesDto } from './dto/find-features.dto';

import { FeaturesListResponse } from './responses/features.list.response';
import { FeatureSingleResponse } from './responses/feature.single.response';

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
  @UseGuards(PoliciesGuard)
  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can('read', 'Application') && ability.can('read', 'Feature'),
  )
  async find(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Query() findFeaturesDto: FindFeaturesDto,
  ): Promise<FeaturesListResponse> {
    const { data, total } = await this.featuresService.find(
      appId,
      findFeaturesDto,
    );

    return new FeaturesListResponse(data, total);
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
  @UseGuards(PoliciesGuard)
  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can('read', 'Application') && ability.can('create', 'Feature'),
  )
  async create(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Body() createFeatureDto: CreateFeatureDto,
  ): Promise<FeatureSingleResponse> {
    return new FeatureSingleResponse(
      await this.featuresService.create(appId, createFeatureDto),
    );
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
  @UseGuards(PoliciesGuard)
  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can('read', 'Application') && ability.can('read', 'Feature'),
  )
  async findOne(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FeatureSingleResponse> {
    return new FeatureSingleResponse(
      await this.featuresService.findOne(appId, id),
    );
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
  @UseGuards(PoliciesGuard)
  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can('read', 'Application') && ability.can('update', 'Feature'),
  )
  async update(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFeatureDto: UpdateFeatureDto,
  ): Promise<FeatureSingleResponse> {
    return new FeatureSingleResponse(
      await this.featuresService.update(appId, id, updateFeatureDto),
    );
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
  @UseGuards(PoliciesGuard)
  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can('read', 'Application') && ability.can('update', 'Feature'),
  )
  async enable(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FeatureSingleResponse> {
    return new FeatureSingleResponse(
      await this.featuresService.enable(appId, id),
    );
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
  @UseGuards(PoliciesGuard)
  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can('read', 'Application') && ability.can('update', 'Feature'),
  )
  async disable(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FeatureSingleResponse> {
    return new FeatureSingleResponse(
      await this.featuresService.disable(appId, id),
    );
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
  @UseGuards(PoliciesGuard)
  @CheckPolicies(
    (ability: AppAbility) =>
      ability.can('read', 'Application') && ability.can('delete', 'Feature'),
  )
  async remove(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FeatureSingleResponse> {
    return new FeatureSingleResponse(
      await this.featuresService.remove(appId, id),
    );
  }
}
