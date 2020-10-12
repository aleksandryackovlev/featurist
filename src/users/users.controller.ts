import {
  Body,
  Query,
  Controller,
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
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthJwtGuard)
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
  find(@Query() findUsersDto: FindUsersDto): Promise<User[]> {
    return this.usersService.find(findUsersDto);
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

  @Put(':id')
  @ApiOperation({ summary: 'Update the user' })
  @ApiResponse({
    status: 200,
    description: 'The updated user',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the user' })
  @ApiResponse({
    status: 200,
    description: 'The deleted user',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }
}
