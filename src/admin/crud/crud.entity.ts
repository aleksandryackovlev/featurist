import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export class CrudEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The unique identifier',
    'x-faker': 'random.uuid',
  })
  id: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The date of the creation',
    'x-faker': 'date.past',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  @ApiProperty(<ApiPropertyOptions>{
    description: 'The date of the last update',
    'x-faker': 'date.recent',
  })
  updatedAt: Date;
}
