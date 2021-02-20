import { applyDecorators, UseGuards } from '@nestjs/common';

import { PoliciesGuard } from '../guards/permissions.policies.guard';
import { AppAbility, Action, Subjects } from '../permissions-ability.factory';

import { CheckPolicies } from './permissions.check-policies';

export type PermissionsCheck = [action: Action, resource: Subjects];

export function IsAllowed(...checks: PermissionsCheck[]) {
  return applyDecorators(
    UseGuards(PoliciesGuard),
    CheckPolicies((ability: AppAbility) =>
      checks.every(([action, resource]) => ability.can(action, resource)),
    ),
  );
}
