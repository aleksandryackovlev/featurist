import { CrudListResponse } from '../../../admin/crud/responses/crud.list.response';

import { ClientFeature } from '../feature.entity';

export class FeaturesListResponse extends CrudListResponse(ClientFeature) {}
