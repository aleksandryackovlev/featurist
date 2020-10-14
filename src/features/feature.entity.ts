import { Entity, Index, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

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
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The name of the feature',
    'x-faker': 'git.branch',
  })
  name: string;

  @Column('text')
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The description of the feature',
    'x-faker': 'hacker.phrase',
  })
  description: string;

  @Column({
    type: 'uuid',
    name: 'application_id',
  })
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The id of the application the feature belongs to',
    'x-faker': 'random.uuid',
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
