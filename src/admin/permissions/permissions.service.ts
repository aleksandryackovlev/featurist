import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from './permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly repository: Repository<Permission>,
  ) {}

  async getPermissionsByRoleId(
    id: string,
  ): Promise<Pick<Permission, 'action' | 'subject'>[]> {
    return this.repository.find({
      select: ['action', 'subject'],
      where: {
        roleId: id,
        isAllowed: true,
      },
    });
  }
}
