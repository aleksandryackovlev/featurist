import { Entity, Index, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({
    example: 'Feature name',
    description: 'The name of the feature',
  })
  name: string;

  @Column('text')
  @ApiProperty({
    example: 'Feature description',
    description: 'The description of the feature',
  })
  description: string;

  @Column({
    type: 'uuid',
    name: 'application_id',
  })
  @ApiProperty({
    example: '29d1c242-a6ec-4de6-bc2a-ff4654c91262',
    description: 'The id of the application the feature belongs to',
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
