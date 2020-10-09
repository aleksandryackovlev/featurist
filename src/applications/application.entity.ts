import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { CrudEntity } from '../crud/crud.entity';
import { Feature } from '../features/feature.entity';

@Entity()
export class Application extends CrudEntity {
  @Column({
    type: 'varchar',
    length: 150,
  })
  @ApiProperty({
    example: 'Application name',
    description: 'The name of the application',
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
  @ApiProperty({
    example: 'Application description',
    description: 'The description of the application',
  })
  description: string;
}
