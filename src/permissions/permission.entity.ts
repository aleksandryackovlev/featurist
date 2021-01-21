import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import { CrudEntity } from '../crud/crud.entity';
import { Role } from '../roles/role.entity';

@Entity()
export class Permission extends CrudEntity {
  @Column({
    type: 'varchar',
    length: 150,
  })
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The action',
  })
  action: string;

  @Column({
    type: 'varchar',
    length: 150,
  })
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The subject',
  })
  subject: string;

  @Column({
    type: 'uuid',
    name: 'role_id',
  })
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The id of the role the permission belongs to',
    'x-faker': 'random.uuid',
  })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: false,
  })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: Role;
}
