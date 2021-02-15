import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type as TypeTransform } from 'class-transformer';

export const CrudSingleResponse = <T extends unknown>(
  Entity: Type<T>,
): new (data: T) => {
  data: T;
} => {
  class CrudSingleResponseBase {
    constructor(data: T) {
      this.data = data;
    }

    @ApiProperty({
      type: Entity,
    })
    @TypeTransform(() => Entity)
    data: T;
  }

  return CrudSingleResponseBase;
};
