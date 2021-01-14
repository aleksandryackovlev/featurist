import { CrudListResponse } from '../../crud/responses/crud.list.response';

import { Feature } from '../interfaces/feature';

export class FeaturesListResponse extends CrudListResponse(Feature) {}
