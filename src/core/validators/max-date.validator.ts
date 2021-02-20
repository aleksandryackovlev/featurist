import {
  registerDecorator,
  buildMessage,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function maxDate(value: unknown, max: Date): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  const date = new Date(value);

  return !isNaN(date.getTime()) && date.getTime() <= max.getTime();
}

export function MaxDate(date: Date, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'maxDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [date],
      options: validationOptions,
      validator: {
        /* istanbul ignore next */
        validate(value: any, args: ValidationArguments) {
          return maxDate(value, <Date>args.constraints[0]);
        },
        defaultMessage: buildMessage(
          /* istanbul ignore next */
          (eachPrefix) =>
            `maximal allowed date for${eachPrefix} $property is $constraint1`,
          validationOptions,
        ),
      },
    });
  };
}
