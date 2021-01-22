import { Injectable } from '@nestjs/common';
import { Ability } from '@casl/ability';

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
    const permissions: Permission[] = await this.service.getPermissionsByRoleId(
      user.roleId,
    );

    return new Ability<AppAbilities>(JSON.stringify(permissions));
  }
}
