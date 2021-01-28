import { Injectable } from '@nestjs/common';
import { Ability, RawRuleOf } from '@casl/ability';

import { User } from '../users/user.entity';
import { Permission } from './permission.entity';
import { PermissionsService } from './permissions.service';

export type Action = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type Subjects =
  | 'Application'
  | 'Feature'
  | 'User'
  | 'Role'
  | 'Permission'
  | 'all';

export type Abilities = [Action, Subjects];

export type AppAbility = Ability<Abilities>;

@Injectable()
export class PermissionsAbilityFactory {
  constructor(private readonly service: PermissionsService) {}

  async createForUser(user: User) {
    const permissions: Pick<
      Permission,
      'action' | 'subject'
    >[] = await this.service.getPermissionsByRoleId(user.roleId);

    return new Ability<Abilities>(permissions as RawRuleOf<AppAbility>[]);
  }
}
