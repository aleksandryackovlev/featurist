import {
  Entity,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';

import { Role } from '../roles/role.entity';
import { Application } from '../applications/application.entity';
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

  @Column({
    type: 'uuid',
    name: 'role_id',
  })
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The id of the role the user belongs to',
    'x-faker': 'random.uuid',
  })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: false,
    eager: true,
  })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: Role;

  @ManyToMany(() => Application, (application) => application.users)
  applications: Application[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
