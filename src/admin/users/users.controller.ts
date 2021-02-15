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
} from '@nestjs/swagger';

import { AuthJwtGuard } from '../auth/guards/auth.jwt.guard';

import { PoliciesGuard } from '../permissions/guards/permissions.policies.guard';
import { CheckPolicies } from '../permissions/decorators/permissions.check-policies';
import { AppAbility } from '../permissions/permissions-ability.factory';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';

import { UsersListResponse } from './responses/users.list.response';
import { UserSingleResponse } from './responses/user.single.response';

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
    type: UserSingleResponse,
  })
  getCurrentUser(@Req() req: Request): { data: User } {
    const { password, ...currentUser } = <User>req.user;
    return new UserSingleResponse(<User>currentUser);
  }

  @Get()
  @ApiOperation({
    summary: 'Find users by params',
    operationId: 'getUsers',
  })
  @ApiResponse({
    status: 200,
    description: 'The list of found users',
    type: UsersListResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid search parameters' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can('read', 'User'))
  async find(@Query() findUsersDto: FindUsersDto): Promise<UsersListResponse> {
    const { data, total } = await this.usersService.find(findUsersDto);

    return new UsersListResponse(data, total);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    operationId: 'createUser',
  })
  @ApiResponse({
    status: 201,
    description: 'The created user',
    type: UserSingleResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can('create', 'User'))
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
  @ApiResponse({
    status: 200,
    description: 'The user',
    type: UserSingleResponse,
  })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can('read', 'User'))
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserSingleResponse> {
    return new UserSingleResponse(await this.usersService.findOne(id));
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update the user',
    operationId: 'updateUser',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated user',
    type: UserSingleResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can('update', 'User'))
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
    summary: 'Delete the user',
    operationId: 'deleteUser',
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted user',
    type: UserSingleResponse,
  })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can('delete', 'User'))
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserSingleResponse> {
    return new UserSingleResponse(await this.usersService.remove(id));
  }
}
