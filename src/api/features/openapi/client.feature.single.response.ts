import { CrudSingleResponse } from '../../../admin/crud/responses/crud.single.response';

import { ClientFeature } from './client.feature';

export class ClientFeatureSingleResponse extends CrudSingleResponse(
  ClientFeature,
) {}
