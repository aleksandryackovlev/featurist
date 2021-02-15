import { Repository, DeepPartial } from 'typeorm';

export interface ICrudService<T, K> {
  readonly repository: Repository<T>;
  find(findDto: K): Promise<{ data: T[]; total: number }>;
  findOne(id: string): Promise<T>;
  remove(id: string): Promise<T>;
  create(createDto: DeepPartial<T>): Promise<T>;
  update(id: string, updateDto: DeepPartial<T>): Promise<T>;
}
