import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import { CrudEntity } from '../crud/crud.entity';
import { User } from '../users/user.entity';

@Entity()
export class Role extends CrudEntity {
  @Column({
    type: 'varchar',
    length: 150,
  })
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The name of the application',
    'x-faker': 'git.branch',
  })
  name: string;

  @OneToMany(() => User, (user) => user.role, {
    onDelete: 'RESTRICT',
  })
  users: User[];

  @Column('text')
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The description of the application',
    'x-faker': 'hacker.phrase',
  })
  description: string;
}
