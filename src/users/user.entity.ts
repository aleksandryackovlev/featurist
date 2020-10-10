import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { CrudEntity } from '../crud/crud.entity';

@Entity()
export class User extends CrudEntity {
  @Column({
    type: 'varchar',
    length: 150,
    update: false,
    unique: true,
  })
  @ApiProperty({
    example: 'username',
    description: 'The username of the user',
  })
  username: string;

  @Column()
  password: string;

  @Column({
    default: true,
    name: 'active',
  })
  @ApiProperty({
    example: true,
    description: 'Is user active',
  })
  isActive: boolean;
}
