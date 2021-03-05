import { CrudListResponse } from '../../../core/crud/responses/crud.list.response';

import { ClientFeature } from '../feature.entity';

export class FeaturesListResponse extends CrudListResponse(ClientFeature) {}
