import { CrudSingleResponse } from '../../crud/responses/crud.single.response';

import { Feature } from '../feature.entity';

export class FeatureSingleResponse extends CrudSingleResponse(Feature) {}
