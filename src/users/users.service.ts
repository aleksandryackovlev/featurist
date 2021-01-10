import { CrudService } from '../crud/crud.service';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';

export class UsersService extends CrudService({
  Entity: User,
  name: 'user',
  searchBy: 'username',
  CreateDto: CreateUserDto,
  UpdateDto: UpdateUserDto,
  FindDto: FindUsersDto,
}) {
  findByUsername(username: string): Promise<User | null> {
    return this.repository.findOne({ username });
  }
}
