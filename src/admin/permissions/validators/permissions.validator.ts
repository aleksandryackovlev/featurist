import {
  registerDecorator,
  buildMessage,
  ValidationOptions,
} from 'class-validator';

import { differenceWith, isEqual } from 'lodash';

import { Action, Subjects } from '../permissions-ability.factory';

const actions: Action[] = ['create', 'read', 'update', 'delete'];
const subjects: Subjects[] = ['Application', 'Feature', 'User', 'Role'];

export function isPermissions(value: unknown): boolean {
  if (!Array.isArray(value)) {
    return false;
  }

  const permissions = actions.reduce((acc, action) => {
    return [...acc, ...subjects.map((subject) => ({ subject, action }))];
  }, []);

  if (
    value.length !== permissions.length ||
    differenceWith(
      value.map(({ isAllowed, ...rest }) => rest),
      permissions,
      isEqual,
    ).length
  ) {
    return false;
  }

  if (
    value.some(
      ({ isAllowed, action, subject, ...rest }) =>
        typeof isAllowed !== 'boolean' || Object.keys(rest).length,
    )
  ) {
    return false;
  }

  return true;
}

export function IsPermissions(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isPermissions',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        /* istanbul ignore next */
        validate(value: any) {
          return isPermissions(value);
        },
        defaultMessage: buildMessage(
          /* istanbul ignore next */
          (eachPrefix) =>
            `value in${eachPrefix} is not a full permissions list`,
          validationOptions,
        ),
      },
    });
  };
}
