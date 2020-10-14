import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import { CrudEntity } from '../crud/crud.entity';
import { Feature } from '../features/feature.entity';

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

  @OneToMany(
    () => Feature,
    feature => feature.application,
    {
      onDelete: 'RESTRICT',
    },
  )
  features: Feature[];

  @Column('text')
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The description of the application',
    'x-faker': 'hacker.phrase',
  })
  description: string;
}
