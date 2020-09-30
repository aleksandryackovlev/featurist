import { Entity, Column, OneToMany } from 'typeorm';

import { CrudEntity } from '../crud/crud.entity';
import { Feature } from '../features/feature.entity';

@Entity()
export class Application extends CrudEntity {
  @Column({
    type: 'varchar',
    length: 150,
  })
  name: string;

  @OneToMany(
    () => Feature,
    feature => feature.application,
    {
      onDelete: 'RESTRICT',
    },
  )
  features: Feature[];

  @Column('text')
  description: string;
}
