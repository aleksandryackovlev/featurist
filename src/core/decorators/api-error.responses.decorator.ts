/* istanbul ignore file */

import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { CrudErrorResponse } from '../../admin/crud/responses/crud.error.response';

export type HttpErrorStatusCode = 400 | 401 | 403 | 404 | 500;

export function ApiErrorResponses(...statusCodes: HttpErrorStatusCode[]) {
  return applyDecorators(
    ...statusCodes.map((code) => {
      switch (code) {
        case 400:
          return ApiResponse({
            status: 400,
            description: 'Invalid request',
            type: CrudErrorResponse,
          });
        case 401:
          return ApiResponse({
            status: 401,
            description: 'Unauthorized access',
            content: {
              'application/json': {
                example: {
                  statusCode: 401,
                  message: 'Unauthorized',
                },
                schema: {
                  $ref: '#/components/schemas/CrudErrorResponse',
                },
              },
            },
          });
        case 403:
          return ApiResponse({
            status: 403,
            description: 'Forbidden',
            content: {
              'application/json': {
                example: {
                  statusCode: 403,
                  error: 'Forbidden',
                  message: 'Forbidden resource',
                },
                schema: {
                  $ref: '#/components/schemas/CrudErrorResponse',
                },
              },
            },
          });
        case 404:
          return ApiResponse({
            status: 404,
            description: 'Not found',
            content: {
              'application/json': {
                example: {
                  statusCode: 404,
                  message: 'Entity does not exist',
                  error: 'Not Found',
                },
                schema: {
                  $ref: '#/components/schemas/CrudErrorResponse',
                },
              },
            },
          });
        case 500:
          return ApiResponse({
            status: 500,
            description: 'Internal server error',
            content: {
              'application/json': {
                example: {
                  statusCode: 500,
                  message: 'Internal server error',
                },
                schema: {
                  $ref: '#/components/schemas/CrudErrorResponse',
                },
              },
            },
          });
      }
    }),
  );
}
