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
import { ApiErrorResponses } from '../../core/decorators/api-error.responses.decorator';

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
  @ApiErrorResponses(400, 401, 403, 500)
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
    description: 'Role',
    type: RoleSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 404, 500)
  @IsAllowed(['read', 'Role'])
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RoleSingleResponse> {
    return new RoleSingleResponse(await this.service.findOne(id));
  }

  @Post()
  @ApiOperation({
    summary: 'Create role',
    operationId: 'createRole',
  })
  @ApiResponse({
    status: 201,
    description: 'Created role',
    type: RoleSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 500)
  @IsAllowed(['create', 'Role'])
  async create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<RoleSingleResponse> {
    return new RoleSingleResponse(await this.service.create(createRoleDto));
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update role',
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
    description: 'Updated role',
    type: RoleSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 404, 500)
  @IsAllowed(['update', 'Role'])
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleSingleResponse> {
    return new RoleSingleResponse(await this.service.update(id, updateRoleDto));
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete role',
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
    description: 'Deleted role',
    type: RoleSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 404, 500)
  @IsAllowed(['delete', 'Role'])
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RoleSingleResponse> {
    return new RoleSingleResponse(await this.service.remove(id));
  }
}
