import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionsAbilityFactory } from './permissions-ability.factory';
import { PermissionsService } from './permissions.service';
import { Permission } from './permission.entity';

@Module({
  providers: [PermissionsAbilityFactory, PermissionsService],
  imports: [TypeOrmModule.forFeature([Permission])],
  exports: [PermissionsAbilityFactory],
})
export class PermissionsModule {}
