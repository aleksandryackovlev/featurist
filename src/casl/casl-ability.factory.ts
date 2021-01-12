import { Injectable } from '@nestjs/common';
import { AbilityBuilder, Ability, AbilityClass } from '@casl/ability';

import { Application } from '../applications/application.entity';
import { Feature } from '../features/feature.entity';
import { User } from '../users/user.entity';

import { Action } from './casl.action';

type Subjects =
  | typeof Application
  | typeof Feature
  | typeof User
  | Application
  | Feature
  | User
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    can(Action.Manage, 'all'); // read-write access to everything

    return build();
  }
}
