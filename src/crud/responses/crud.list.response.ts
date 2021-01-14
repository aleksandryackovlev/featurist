import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type as TypeTransform } from 'class-transformer';

export const CrudListResponse = <T extends unknown>(
  Entity: Type<T>,
): new (data: T[], total: number) => {
  total: number;
  data: T[];
} => {
  class CrudListResponseBase {
    constructor(data: T[], total: number) {
      this.data = data;
      this.total = total;
    }

    @ApiProperty({
      example: 10,
      description: 'The total amount of entities',
    })
    total: number;

    @ApiProperty({
      description: 'The list of entitites',
      type: () => [Entity],
    })
    @TypeTransform(() => Entity)
    data: T[];
  }

  return CrudListResponseBase;
};
