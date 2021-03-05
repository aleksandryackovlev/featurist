import { CrudSingleResponse } from '../../../core/crud/responses/crud.single.response';

import { User } from '../user.entity';

export class UserSingleResponse extends CrudSingleResponse(User) {}
