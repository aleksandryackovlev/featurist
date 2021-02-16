import { Controller, Get, Param, NotFoundException } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApplicationsService } from '../../admin/applications/applications.service';
import { FeaturesService } from '../../admin/features/features.service';
import { Headers } from '../../utils/decorators/headers.decorator';

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
