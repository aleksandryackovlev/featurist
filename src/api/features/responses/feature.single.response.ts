import { CrudSingleResponse } from '../../../admin/crud/responses/crud.single.response';

import { ClientFeature } from '../feature.entity';

export class FeatureSingleResponse extends CrudSingleResponse(ClientFeature) {}
