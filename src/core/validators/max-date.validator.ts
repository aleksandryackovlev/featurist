import {
  registerDecorator,
  buildMessage,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function MaxDate(date: Date, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'maxDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [date],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }
          let date: Date;

          try {
            date = new Date(value);
          } catch (e) {
            return false;
          }

          return (
            date instanceof Date &&
            date.getTime() <= (<Date>args.constraints[0]).getTime()
          );
        },
        defaultMessage: buildMessage(
          (eachPrefix) =>
            'maximal allowed date for ' +
            eachPrefix +
            '$property is $constraint1',
          validationOptions,
        ),
      },
    });
  };
}
