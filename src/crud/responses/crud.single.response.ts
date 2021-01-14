import { ApiProperty } from '@nestjs/swagger';

export const CrudSingleResponse = <T extends unknown>(
  Entity: T,
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
    data: T;
  }

  return CrudSingleResponseBase;
};
