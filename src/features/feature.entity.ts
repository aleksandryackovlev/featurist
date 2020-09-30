import {
  Entity,
  Index,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Application } from '../applications/application.entity';

@Index(['id', 'applicationId'], { unique: true })
@Entity()
export class Feature {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
