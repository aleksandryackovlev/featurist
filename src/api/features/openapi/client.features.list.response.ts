import { CrudListResponse } from '../../../admin/crud/responses/crud.list.response';

import { ClientFeature } from './client.feature';

export class ClientFeaturesListResponse extends CrudListResponse(
  ClientFeature,
) {}
