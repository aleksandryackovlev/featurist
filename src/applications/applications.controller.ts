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
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthJwtGuard } from '../auth/guards/auth.jwt.guard';

import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { FindApplicationsDto } from './dto/find-applications.dto';

import { ApplicationsService } from './applications.service';

import { Application } from './application.entity';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(AuthJwtGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly service: ApplicationsService) {}

  @Get()
  @ApiOperation({ summary: 'Find applications by params' })
  @ApiResponse({
    status: 200,
    description: 'The list of found applications',
    type: [Application],
  })
  @ApiResponse({ status: 400, description: 'Invalid search parameters' })
  find(
    @Query() findApplicationsDto: FindApplicationsDto,
  ): Promise<Application[]> {
    return this.service.find(findApplicationsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application by id' })
  @ApiResponse({
    status: 200,
    description: 'The application',
    type: Application,
  })
  findOne(@Param('id') id: string): Promise<Application> {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new application' })
  @ApiResponse({
    status: 201,
    description: 'The created application',
    type: Application,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  create(
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    return this.service.create(createApplicationDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update the application' })
  @ApiResponse({
    status: 200,
    description: 'The updated application',
    type: Application,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ): Promise<Application> {
    return this.service.update(id, updateApplicationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the application' })
  @ApiResponse({
    status: 200,
    description: 'The deleted application',
    type: Application,
  })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  remove(@Param('id') id: string): Promise<Application> {
    return this.service.remove(id);
  }
}
