import { ApiProperty } from '@nestjs/swagger';

export const CrudListResponse = <T extends unknown>(Entity: T) => {
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
    data: T[];
  }

  return CrudListResponseBase;
};
