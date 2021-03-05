import { CrudFindEntitiesDto } from '../../../core/crud/dto/find-entities.dto';

export class FindUsersDto extends CrudFindEntitiesDto([
  'id',
  'username',
  'createdAt',
  'updatedAt',
]) {}
