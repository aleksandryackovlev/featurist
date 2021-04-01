/* istanbul ignore file */

import { Injectable } from '@nestjs/common';
import { Ability, RawRuleOf } from '@casl/ability';

import { User } from '../users/user.entity';
import { PermissionsService } from './permissions.service';

export type Action = 'create' | 'read' | 'update' | 'delete';

export type Subjects = 'Application' | 'Feature' | 'User' | 'Role';

export type Abilities = [Action, Subjects];

export type AppAbility = Ability<Abilities>;

@Injectable()
export class PermissionsAbilityFactory {
  constructor(private readonly service: PermissionsService) {}

  async createForUser(user: User) {
    return new Ability<Abilities>(user.permissions as RawRuleOf<AppAbility>[]);
  }
}
