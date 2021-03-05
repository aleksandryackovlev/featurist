import { CrudListResponse } from '../../../core/crud/responses/crud.list.response';

import { Feature } from '../feature.entity';

export class FeaturesListResponse extends CrudListResponse(Feature) {}
