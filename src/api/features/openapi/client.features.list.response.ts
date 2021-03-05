import { CrudListResponse } from '../../../core/crud/responses/crud.list.response';

import { ClientFeature } from './client.feature';

export class ClientFeaturesListResponse extends CrudListResponse(
  ClientFeature,
) {}
