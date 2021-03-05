import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import { CrudEntity } from '../../core/crud/crud.entity';
import { Feature } from '../features/feature.entity';
import { User } from '../users/user.entity';

@Entity()
export class Application extends CrudEntity {
  @Column({
    type: 'varchar',
    length: 150,
  })
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The name of the application',
    'x-faker': 'git.branch',
  })
  name: string;

  @OneToMany(() => Feature, (feature) => feature.application, {
    onDelete: 'RESTRICT',
  })
  features: Feature[];

  @Column('text')
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The description of the application',
    'x-faker': 'hacker.phrase',
  })
  description: string;

  @ManyToMany(() => User, (user) => user.applications)
  @JoinTable({
    name: 'application_users_user',
    joinColumn: {
      name: 'application_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];
}
