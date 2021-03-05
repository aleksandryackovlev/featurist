import { CrudSingleResponse } from '../../../core/crud/responses/crud.single.response';

import { Role } from '../role.entity';

export class RoleSingleResponse extends CrudSingleResponse(Role) {}
