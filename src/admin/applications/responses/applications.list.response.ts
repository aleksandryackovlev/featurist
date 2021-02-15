import { CrudListResponse } from '../../crud/responses/crud.list.response';

import { Application } from '../application.entity';

export class ApplicationsListResponse extends CrudListResponse(Application) {}
