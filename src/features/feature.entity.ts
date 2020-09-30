import { Entity, Index, Column, ManyToOne, JoinColumn } from 'typeorm';

import { Application } from '../applications/application.entity';
import { CrudEntity } from '../crud/crud.entity';

@Index(['id', 'applicationId'], { unique: true })
@Entity()
export class Feature extends CrudEntity {
  @Column({
    type: 'varchar',
    length: 150,
    update: false,
    unique: true,
  })
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'uuid',
    name: 'application_id',
  })
  applicationId: string;

  @ManyToOne(
    () => Application,
    application => application.features,
    {
      nullable: false,
    },
  )
  @JoinColumn([{ name: 'application_id', referencedColumnName: 'id' }])
  application: Application;
}
