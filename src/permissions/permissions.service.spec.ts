import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PermissionsService } from './permissions.service';
import { Permission } from './permission.entity';

const permission = new Permission();
permission.id = '935a38e8-ec14-41b8-8066-2bc5c818577a';
permission.action = 'read';
permission.subject = 'Application';
permission.roleId = '935a38e8-ec14-41b8-8066-2bc5c818577a';

const resultArr = [permission];

describe('PermissionsService', () => {
  let service: PermissionsService;
  let repo: Repository<Permission>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getRepositoryToken(Permission),
          useValue: {
            find: jest.fn().mockResolvedValue(resultArr),
          },
        },
      ],
    }).compile();

    jest.clearAllMocks();

    service = module.get<PermissionsService>(PermissionsService);
    repo = module.get<Repository<Permission>>(getRepositoryToken(Permission));
  });

  describe('getPermissionsByRoleId', () => {
    it('should return permissions by the given role id', async () => {
      await expect(
        service.getPermissionsByRoleId('some-role-id'),
      ).resolves.toEqual(resultArr);

      expect(repo.find).toBeCalledTimes(1);
      expect(repo.find).toBeCalledWith({
        select: ['action', 'subject'],
        where: {
          roleId: 'some-role-id',
        },
      });
    });
  });
});
