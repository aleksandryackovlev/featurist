export interface IFindEntitiesDto {
  readonly offset: number;
  readonly limit: number;
  readonly search: string;
  readonly createdFrom: Date;
  readonly createdTo: Date;
  readonly updatedFrom: Date;
  readonly updatedTo: Date;
  readonly sortBy: string;
  readonly sortDirection: string;
}
