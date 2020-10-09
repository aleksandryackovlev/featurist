import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

export class CrudEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '8e9ee753-b46d-4241-9518-6731e7d844e9',
    description: 'The unique identifier',
  })
  id: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  @ApiProperty({
    example: '2020-10-09T06:48:59.993Z',
    description: 'The date of the creation',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  @ApiProperty({
    example: '2020-10-09T06:48:59.993Z',
    description: 'The date of the last update',
  })
  updatedAt: Date;
}
