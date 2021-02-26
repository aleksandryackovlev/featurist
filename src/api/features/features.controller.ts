import { Controller, Get, Param, NotFoundException } from '@nestjs/common';

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';

import { ApplicationsService } from '../../admin/applications/applications.service';
import { FeaturesService } from '../../admin/features/features.service';
import { Headers } from '../../core/decorators/headers.decorator';

import { FeaturesListResponse } from './responses/features.list.response';
import { FeatureSingleResponse } from './responses/feature.single.response';
import { HeadersDto } from './dto/headers.dto';

@ApiTags('Client features')
@Controller('api/v1/features')
export class ClientFeaturesController {
  constructor(
    private readonly featuresService: FeaturesService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Find features all features',
    operationId: 'getClientFeatures',
  })
  @ApiResponse({
    status: 200,
    description: 'The list of found features',
    type: FeaturesListResponse,
  })
  @ApiHeader({
    name: 'X-Application-ID',
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    schema: {
      type: 'string',
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid search parameters' })
  async find(
    @Headers(HeadersDto) headers: HeadersDto,
  ): Promise<FeaturesListResponse> {
    if (!(await this.applicationsService.isApplicationExists(headers.appId))) {
      throw new NotFoundException('Entity does not exist');
    }

    const { data, total } = await this.featuresService.findAll(headers.appId);

    return new FeaturesListResponse(data, total);
  }

  @Get(':name')
  @ApiOperation({
    summary: 'Get feature by id',
    operationId: 'getClientFeature',
  })
  @ApiHeader({
    name: 'X-Application-ID',
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    schema: {
      type: 'string',
    },
  })
  @ApiParam({
    name: 'name',
    example: 'feature_dredd_2',
    schema: {
      type: 'string',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The feature',
    type: FeatureSingleResponse,
  })
  async findOne(
    @Headers(HeadersDto) headers: HeadersDto,
    @Param('name') name: string,
  ): Promise<FeatureSingleResponse> {
    if (!(await this.applicationsService.isApplicationExists(headers.appId))) {
      throw new NotFoundException('Entity does not exist');
    }

    return new FeatureSingleResponse(
      await this.featuresService.findOneByName(headers.appId, name),
    );
  }
}
