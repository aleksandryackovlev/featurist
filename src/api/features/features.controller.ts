import { Controller, Get, Param, NotFoundException } from '@nestjs/common';

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiParamOptions,
} from '@nestjs/swagger';

import { ApiErrorResponses } from '../../core/decorators/api-error.responses.decorator';
import { ApplicationsService } from '../../admin/applications/applications.service';
import { FeaturesService } from '../../admin/features/features.service';
import { Headers } from '../../core/decorators/headers.decorator';

import { FeaturesListResponse } from './responses/features.list.response';
import { FeatureSingleResponse } from './responses/feature.single.response';
import { ClientFeaturesListResponse } from './openapi/client.features.list.response';
import { ClientFeatureSingleResponse } from './openapi/client.feature.single.response';
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
    summary: 'Find all features',
    operationId: 'getClientFeatures',
  })
  @ApiResponse({
    status: 200,
    description: 'The list of found features',
    type: ClientFeaturesListResponse,
  })
  @ApiParam({
    name: 'X-Application-ID',
    in: 'header',
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    required: true,
    schema: {
      type: 'string',
    },
  } as ApiParamOptions)
  @ApiErrorResponses(500)
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
    summary: 'Get feature by name',
    operationId: 'getClientFeature',
  })
  @ApiParam({
    name: 'X-Application-ID',
    in: 'header',
    example: '977a3934-ee5f-4a6f-beed-42a7529ce648',
    required: true,
    schema: {
      type: 'string',
    },
  } as ApiParamOptions)
  @ApiParam({
    name: 'name',
    example: 'feature_dredd_2',
    schema: {
      type: 'string',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Feature',
    type: ClientFeatureSingleResponse,
  })
  @ApiErrorResponses(404, 500)
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
