import { CrudSingleResponse } from '../../../core/crud/responses/crud.single.response';

import { Application } from '../application.entity';

export class ApplicationSingleResponse extends CrudSingleResponse(
  Application,
) {}
