import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ExecutionContext, BadRequestException } from '@nestjs/common';

import { getHeaders } from './headers.decorator';

class HeadersDto {
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'x-application-id' })
  'appId': string;
}

describe('MaxDate validator', () => {
  it('should return strip extraneous values from dto', async () => {
    const result = await getHeaders(HeadersDto, <ExecutionContext>{
      switchToHttp() {
        return {
          getRequest() {
            return {
              headers: {
                'x-application-id': 'test',
                'x-some-id': 'test2',
              },
            };
          },
        };
      },
    });

    expect(result).toEqual({ appId: 'test' });
  });

  it('should throw an error if headers are not valid', async () => {
    try {
      await getHeaders(HeadersDto, <ExecutionContext>{
        switchToHttp() {
          return {
            getRequest() {
              return {
                headers: {
                  'content-type': 'application/json',
                },
              };
            },
          };
        },
      });
      throw new Error('Catch run through');
    } catch (error) {
      expect(error instanceof BadRequestException).toEqual(true);
      expect(error.response).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: ['appId should not be empty', 'appId must be a string'],
      });
    }
  });
});
