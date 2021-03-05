import { CrudSingleResponse } from '../../../core/crud/responses/crud.single.response';

import { ClientFeature } from '../feature.entity';

export class FeatureSingleResponse extends CrudSingleResponse(ClientFeature) {}
