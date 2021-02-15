import { CrudFindEntitiesDto } from '../../crud/dto/find-entities.dto';

export class FindUsersDto extends CrudFindEntitiesDto([
  'id',
  'username',
  'createdAt',
  'updatedAt',
]) {}
