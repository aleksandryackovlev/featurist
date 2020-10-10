import { CrudService } from '../crud/crud.service';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';

export class UsersService extends CrudService({
  Entity: User,
  CreateDto: CreateUserDto,
  UpdateDto: UpdateUserDto,
}) {
  async find(findUsersDto: FindUsersDto): Promise<User[]> {
    const {
      createdFrom,
      createdTo,
      updatedFrom,
      updatedTo,
      search,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      offset,
      limit = 10,
    } = findUsersDto;

    const query = this.repository.createQueryBuilder('user');
    let method: 'where' | 'andWhere' = 'where';

    if (createdFrom) {
      query[method]('CAST (user.createdAt AS DATE) >= :createdFrom', {
        createdFrom,
      });

      method = 'andWhere';
    }

    if (createdTo) {
      query[method]('CAST (user.createdAt AS DATE) <= :createdTo', {
        createdTo,
      });

      method = 'andWhere';
    }

    if (updatedFrom) {
      query[method]('CAST (user.updatedAt AS DATE) >= :updatedFrom', {
        updatedFrom,
      });

      method = 'andWhere';
    }

    if (updatedTo) {
      query[method]('CAST (user.updatedAt AS DATE) <= :updatedTo', {
        updatedTo,
      });

      method = 'andWhere';
    }

    if (search) {
      query[method]('user.username LIKE :search', { search: `%${search}%` });

      method = 'andWhere';
    }

    if (offset) {
      query.offset(offset);
    }

    return query
      .orderBy(
        `application.${sortBy}`,
        <'ASC' | 'DESC'>sortDirection.toUpperCase(),
      )
      .limit(limit)
      .getMany();
  }
}
