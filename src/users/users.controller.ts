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
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthJwtGuard } from '../auth/guards/auth.jwt.guard';

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
@Controller('users')
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
    return new UserSingleResponse(<User>req.user);
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
  async findOne(@Param('id') id: string): Promise<UserSingleResponse> {
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
  async update(
    @Param('id') id: string,
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
  async remove(@Param('id') id: string): Promise<UserSingleResponse> {
    return new UserSingleResponse(await this.usersService.remove(id));
  }
}
