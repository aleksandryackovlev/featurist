import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

import { AuthJwtGuard } from '../auth/guards/auth.jwt.guard';

import { IsAllowed } from '../permissions/decorators/permissions.is-allowed';
import { ApiErrorResponses } from '../../core/decorators/api-error.responses.decorator';

import { ApplicationsService } from '../applications/applications.service';
import { User } from '../users/user.entity';

import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FindFeaturesDto } from './dto/find-features.dto';

import { FeaturesListResponse } from './responses/features.list.response';
import { FeatureSingleResponse } from './responses/feature.single.response';

import { FeaturesService } from './features.service';

@ApiTags('Features')
@ApiBearerAuth()
@UseGuards(AuthJwtGuard)
@Controller('admin/v1/applications/:appId/features')
export class FeaturesController {
  constructor(
    private readonly featuresService: FeaturesService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Find features by params',
    operationId: 'getFeatures',
  })
  @ApiParam({
    name: 'appId',
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    schema: {
      type: 'string',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The list of found features',
    type: FeaturesListResponse,
  })
  @ApiErrorResponses(400, 401, 403, 404, 500)
  @IsAllowed(['read', 'Application'], ['read', 'Feature'])
  async find(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Query() findFeaturesDto: FindFeaturesDto,
    @Req() req,
  ): Promise<FeaturesListResponse> {
    /* istanbul ignore if */
    if (
      !(await this.applicationsService.isApplicationExists(
        appId,
        (<User>req.user).id,
      ))
    ) {
      throw new NotFoundException('Entity does not exist');
    }

    const { data, total } = await this.featuresService.find(
      appId,
      findFeaturesDto,
    );

    return new FeaturesListResponse(data, total);
  }

  @Post()
  @ApiOperation({
    summary: 'Create feature',
    operationId: 'createFeature',
  })
  @ApiParam({
    name: 'appId',
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    schema: {
      type: 'string',
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Created feature',
    type: FeatureSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 404, 500)
  @IsAllowed(['read', 'Application'], ['create', 'Feature'])
  async create(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Body() createFeatureDto: CreateFeatureDto,
    @Req() req,
  ): Promise<FeatureSingleResponse> {
    /* istanbul ignore if */
    if (
      !(await this.applicationsService.isApplicationExists(
        appId,
        (<User>req.user).id,
      ))
    ) {
      throw new NotFoundException('Entity does not exist');
    }

    return new FeatureSingleResponse(
      await this.featuresService.create(appId, createFeatureDto),
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get feature by id',
    operationId: 'getFeature',
  })
  @ApiParam({
    name: 'appId',
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    schema: {
      type: 'string',
    },
  })
  @ApiParam({
    name: 'id',
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    schema: {
      type: 'string',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Feature',
    type: FeatureSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 404, 500)
  @IsAllowed(['read', 'Application'], ['read', 'Feature'])
  async findOne(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
  ): Promise<FeatureSingleResponse> {
    /* istanbul ignore if */
    if (
      !(await this.applicationsService.isApplicationExists(
        appId,
        (<User>req.user).id,
      ))
    ) {
      throw new NotFoundException('Entity does not exist');
    }

    return new FeatureSingleResponse(
      await this.featuresService.findOne(appId, id),
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update feature',
    operationId: 'updateFeature',
  })
  @ApiParam({
    name: 'appId',
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    schema: {
      type: 'string',
    },
  })
  @ApiParam({
    name: 'id',
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    schema: {
      type: 'string',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Updated feature',
    type: FeatureSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 404, 500)
  @IsAllowed(['read', 'Application'], ['update', 'Feature'])
  async update(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFeatureDto: UpdateFeatureDto,
    @Req() req,
  ): Promise<FeatureSingleResponse> {
    /* istanbul ignore if */
    if (
      !(await this.applicationsService.isApplicationExists(
        appId,
        (<User>req.user).id,
      ))
    ) {
      throw new NotFoundException('Entity does not exist');
    }

    return new FeatureSingleResponse(
      await this.featuresService.update(appId, id, updateFeatureDto),
    );
  }

  @Post(':id/enable')
  @ApiOperation({
    summary: 'Enable feature',
    operationId: 'enableFeature',
  })
  @ApiParam({
    name: 'appId',
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    schema: {
      type: 'string',
    },
  })
  @ApiParam({
    name: 'id',
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    schema: {
      type: 'string',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Enabled feature',
    type: FeatureSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 404, 500)
  @IsAllowed(['read', 'Application'], ['update', 'Feature'])
  async enable(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
  ): Promise<FeatureSingleResponse> {
    /* istanbul ignore if */
    if (
      !(await this.applicationsService.isApplicationExists(
        appId,
        (<User>req.user).id,
      ))
    ) {
      throw new NotFoundException('Entity does not exist');
    }

    return new FeatureSingleResponse(
      await this.featuresService.enable(appId, id),
    );
  }

  @Post(':id/disable')
  @ApiOperation({
    summary: 'Disable feature',
    operationId: 'disableFeature',
  })
  @ApiParam({
    name: 'appId',
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    schema: {
      type: 'string',
    },
  })
  @ApiParam({
    name: 'id',
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    schema: {
      type: 'string',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Disabled feature',
    type: FeatureSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 404, 500)
  @IsAllowed(['read', 'Application'], ['update', 'Feature'])
  async disable(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
  ): Promise<FeatureSingleResponse> {
    /* istanbul ignore if */
    if (
      !(await this.applicationsService.isApplicationExists(
        appId,
        (<User>req.user).id,
      ))
    ) {
      throw new NotFoundException('Entity does not exist');
    }

    return new FeatureSingleResponse(
      await this.featuresService.disable(appId, id),
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete feature',
    operationId: 'deleteFeature',
  })
  @ApiParam({
    name: 'appId',
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    schema: {
      type: 'string',
    },
  })
  @ApiParam({
    name: 'id',
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    schema: {
      type: 'string',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted feature',
    type: FeatureSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 404, 500)
  @IsAllowed(['read', 'Application'], ['delete', 'Feature'])
  async remove(
    @Param('appId', ParseUUIDPipe) appId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
  ): Promise<FeatureSingleResponse> {
    /* istanbul ignore if */
    if (
      !(await this.applicationsService.isApplicationExists(
        appId,
        (<User>req.user).id,
      ))
    ) {
      throw new NotFoundException('Entity does not exist');
    }

    return new FeatureSingleResponse(
      await this.featuresService.remove(appId, id),
    );
  }
}
