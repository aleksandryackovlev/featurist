import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

import { CrudEntity } from '../../core/crud/crud.entity';
import { Role } from '../roles/role.entity';

@Entity()
@Exclude()
export class Permission extends CrudEntity {
  @Column({
    type: 'varchar',
    length: 150,
  })
  @ApiProperty(<ApiPropertyOptions>{
    description: 'Action',
    enum: ['create', 'read', 'update', 'delete'],
    example: 'read',
  })
  @Expose()
  action: string;

  @Column({
    type: 'varchar',
    length: 150,
  })
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The subject',
  })
  @Expose()
  subject: string;

  @Column({
    name: 'is_allowed',
  })
  @ApiProperty(<ApiPropertyOptions>{
    description: 'Is the action allowed with the subject',
  })
  @Expose()
  isAllowed: boolean;

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

export class SwaggerPermission {
  @ApiProperty(<ApiPropertyOptions>{
    description: 'Action',
    enum: ['create', 'read', 'update', 'delete'],
    example: 'read',
  })
  action: string;

  @ApiProperty(<ApiPropertyOptions>{
    description: 'The subject',
  })
  subject: string;

  @ApiProperty(<ApiPropertyOptions>{
    description: 'Is the action allowed with the subject',
  })
  isAllowed: boolean;
}
