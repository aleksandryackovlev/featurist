import { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Req,
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

import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { FindApplicationsDto } from './dto/find-applications.dto';

import { ApplicationsListResponse } from './responses/applications.list.response';
import { ApplicationSingleResponse } from './responses/application.single.response';

import { ApplicationsService } from './applications.service';
import { User } from '../users/user.entity';

@ApiTags('Applications')
@ApiBearerAuth()
@UseGuards(AuthJwtGuard)
@Controller('admin/v1/applications')
export class ApplicationsController {
  constructor(private readonly service: ApplicationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Find applications by params',
    operationId: 'getApplications',
  })
  @ApiResponse({
    status: 200,
    description: 'The list of found applications',
    type: ApplicationsListResponse,
  })
  @ApiErrorResponses(400, 401, 403, 500)
  @IsAllowed(['read', 'Application'])
  async find(
    @Query() findApplicationsDto: FindApplicationsDto,
    @Req() req: Request,
  ): Promise<ApplicationsListResponse> {
    const { data, total } = await this.service.find(
      findApplicationsDto,
      (<User>req.user).id,
    );

    return new ApplicationsListResponse(data, total);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get application by id',
    operationId: 'getApplication',
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
    description: 'Application',
    type: ApplicationSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 404, 500)
  @IsAllowed(['read', 'Application'])
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<ApplicationSingleResponse> {
    return new ApplicationSingleResponse(
      await this.service.findOne(id, (<User>req.user).id),
    );
  }

  @Post()
  @ApiOperation({
    summary: 'Create application',
    operationId: 'createApplication',
  })
  @ApiResponse({
    status: 201,
    description: 'Created application',
    type: ApplicationSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 500)
  @IsAllowed(['create', 'Application'])
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
    @Req() req: Request,
  ): Promise<ApplicationSingleResponse> {
    return new ApplicationSingleResponse(
      await this.service.create(createApplicationDto, <User>req.user),
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update application',
    operationId: 'updateApplication',
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
    description: 'Updated application',
    type: ApplicationSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 404, 500)
  @IsAllowed(['update', 'Application'])
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Req() req: Request,
  ): Promise<ApplicationSingleResponse> {
    return new ApplicationSingleResponse(
      await this.service.update(id, updateApplicationDto, (<User>req.user).id),
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete application',
    operationId: 'deleteApplication',
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
    description: 'Deleted application',
    type: ApplicationSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 404, 500)
  @IsAllowed(['delete', 'Application'])
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<ApplicationSingleResponse> {
    return new ApplicationSingleResponse(
      await this.service.remove(id, (<User>req.user).id),
    );
  }
}
