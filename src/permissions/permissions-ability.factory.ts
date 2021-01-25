import { Injectable } from '@nestjs/common';
import { Ability } from '@casl/ability';

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

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class PermissionsAbilityFactory {
  constructor(private readonly service: PermissionsService) {}

  async createForUser(user: User) {
    const permissions: Pick<
      Permission,
      'action' | 'subject'
    >[] = await this.service.getPermissionsByRoleId(user.roleId);

    return new Ability(permissions);
  }
}
