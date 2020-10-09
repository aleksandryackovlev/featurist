import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Find users by params' })
  @ApiResponse({
    status: 200,
    description: 'The list of found users',
    type: [User],
  })
  @ApiResponse({ status: 400, description: 'Invalid search parameters' })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The created user',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: 200,
    description: 'The user',
    type: User,
  })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the user' })
  @ApiResponse({
    status: 200,
    description: 'The deleted user',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
