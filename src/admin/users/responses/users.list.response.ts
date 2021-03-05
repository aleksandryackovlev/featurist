import { CrudListResponse } from '../../../core/crud/responses/crud.list.response';

import { User } from '../user.entity';

export class UsersListResponse extends CrudListResponse(User) {}
