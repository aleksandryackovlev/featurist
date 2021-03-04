/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from 'express';
import {
  Body,
  Query,
  Controller,
  Req,
  Delete,
  Get,
  Param,
  Post,
  Put,
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

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';

import { UsersListResponse } from './responses/users.list.response';
import { UserSingleResponse } from './responses/user.single.response';
import {
  UserCurrentResponse,
  UserCurrent,
} from './responses/user.current.response';

import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthJwtGuard)
@Controller('admin/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get current user',
    operationId: 'getCurrentUser',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user',
    type: UserCurrentResponse,
  })
  @ApiErrorResponses(401, 500)
  getCurrentUser(@Req() req: Request): { data: UserCurrent } {
    // const { password, ...currentUser } = <User>req.user;
    return new UserCurrentResponse(<UserCurrent>req.user);
  }

  @Get()
  @ApiOperation({
    summary: 'Find users by params',
    operationId: 'getUsers',
  })
  @ApiResponse({
    status: 200,
    description: 'List of found users',
    type: UsersListResponse,
  })
  @ApiErrorResponses(400, 401, 403, 500)
  @IsAllowed(['read', 'User'])
  async find(@Query() findUsersDto: FindUsersDto): Promise<UsersListResponse> {
    const { data, total } = await this.usersService.find(findUsersDto);

    return new UsersListResponse(data, total);
  }

  @Post()
  @ApiOperation({
    summary: 'Create user',
    operationId: 'createUser',
  })
  @ApiResponse({
    status: 201,
    description: 'Created user',
    type: UserSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 500)
  @IsAllowed(['create', 'User'])
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserSingleResponse> {
    return new UserSingleResponse(
      await this.usersService.create(createUserDto),
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id',
    operationId: 'getUser',
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
    description: 'User',
    type: UserSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 404, 500)
  @IsAllowed(['read', 'User'])
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserSingleResponse> {
    return new UserSingleResponse(await this.usersService.findOne(id));
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update user',
    operationId: 'updateUser',
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
    description: 'Updated user',
    type: UserSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 404, 500)
  @IsAllowed(['update', 'User'])
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserSingleResponse> {
    return new UserSingleResponse(
      await this.usersService.update(id, updateUserDto),
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user',
    operationId: 'deleteUser',
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
    description: 'Deleted user',
    type: UserSingleResponse,
  })
  @ApiErrorResponses(400, 401, 403, 404, 500)
  @IsAllowed(['delete', 'User'])
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserSingleResponse> {
    return new UserSingleResponse(await this.usersService.remove(id));
  }
}
