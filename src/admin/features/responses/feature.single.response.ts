import { CrudSingleResponse } from '../../../core/crud/responses/crud.single.response';

import { Feature } from '../feature.entity';

export class FeatureSingleResponse extends CrudSingleResponse(Feature) {}
