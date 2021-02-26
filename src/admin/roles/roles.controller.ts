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

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FindRolesDto } from './dto/find-roles.dto';

import { RolesListResponse } from './responses/roles.list.response';
import { RoleSingleResponse } from './responses/role.single.response';

import { RolesService } from './roles.service';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(AuthJwtGuard)
@Controller('admin/v1/roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Get()
  @ApiOperation({
    summary: 'Find roles by params',
    operationId: 'getRoles',
  })
  @ApiResponse({
    status: 200,
    description: 'The list of found roles',
    type: RolesListResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid search parameters' })
  @IsAllowed(['read', 'Role'])
  async find(@Query() findRolesDto: FindRolesDto): Promise<RolesListResponse> {
    const { data, total } = await this.service.find(findRolesDto);

    return new RolesListResponse(data, total);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get role by id',
    operationId: 'getRole',
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
    description: 'The role',
    type: RoleSingleResponse,
  })
  @IsAllowed(['read', 'Role'])
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RoleSingleResponse> {
    return new RoleSingleResponse(await this.service.findOne(id));
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new role',
    operationId: 'createRole',
  })
  @ApiResponse({
    status: 201,
    description: 'The created role',
    type: RoleSingleResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @IsAllowed(['create', 'Role'])
  async create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<RoleSingleResponse> {
    return new RoleSingleResponse(await this.service.create(createRoleDto));
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update the role',
    operationId: 'updateRole',
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
    description: 'The updated role',
    type: RoleSingleResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @IsAllowed(['update', 'Role'])
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleSingleResponse> {
    return new RoleSingleResponse(await this.service.update(id, updateRoleDto));
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete the role',
    operationId: 'deleteRole',
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
    description: 'The deleted role',
    type: RoleSingleResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  @IsAllowed(['delete', 'Role'])
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RoleSingleResponse> {
    return new RoleSingleResponse(await this.service.remove(id));
  }
}
