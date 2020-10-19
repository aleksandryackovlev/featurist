import { Entity, Column, BeforeInsert } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

import { CrudEntity } from '../crud/crud.entity';

@Entity()
export class User extends CrudEntity {
  @Column({
    type: 'varchar',
    length: 150,
    update: false,
    unique: true,
  })
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The username of the user',
    'x-faker': 'internet.userName',
  })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    default: true,
    name: 'active',
  })
  @ApiProperty({
    description: 'Is user active',
  })
  isActive: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
