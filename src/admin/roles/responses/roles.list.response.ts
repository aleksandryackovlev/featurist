import { CrudListResponse } from '../../../core/crud/responses/crud.list.response';

import { Role } from '../role.entity';

export class RolesListResponse extends CrudListResponse(Role) {}
