import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { plainToClass, ClassConstructor } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export const getHeaders = async (
  value: ClassConstructor<any>,
  ctx: ExecutionContext,
) => {
  const headers = ctx.switchToHttp().getRequest().headers;

  const dto = plainToClass(value, headers, { excludeExtraneousValues: true });

  try {
    await validateOrReject(dto);
  } catch (errors) {
    throw new BadRequestException({
      statusCode: 400,
      error: 'Bad Request',
      message: errors.reduce(
        (acc, error) => [
          ...acc,
          ...(error.constraints ? Object.values(error.constraints) : []),
        ],
        [],
      ),
    });
  }

  return dto;
};

export const Headers = createParamDecorator(getHeaders);
