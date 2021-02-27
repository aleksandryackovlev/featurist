import { ApiProperty } from '@nestjs/swagger';

export class CrudErrorResponse {
  @ApiProperty({
    example: 400,
    description: 'HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    description: 'The list of error messages',
    oneOf: [
      {
        type: 'string',
      },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
  })
  message: string[];

  @ApiProperty({
    description: 'Error message',
  })
  error: 'Bad Request';
}
