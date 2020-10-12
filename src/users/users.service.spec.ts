import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { FindUsersDto } from './dto/find-users.dto';

import { UsersService } from './users.service';
import { User } from './user.entity';

const user = new User();
user.id = '935a38e8-ec14-41b8-8066-2bc5c818577a';
user.username = 'John Doe';
user.password = 'Description';

const resultArr = [user];

const query = {
  where: jest.fn(),
  andWhere: jest.fn(),
  offset: jest.fn(),
  limit: jest.fn(),
  orderBy: jest.fn(),
  getMany: jest.fn().mockReturnValue(resultArr),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          // define all the methods that you use from the catRepo
          // give proper return values as expected or mock implementations, your choice
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(query),
          },
        },
      ],
    }).compile();

    jest.clearAllMocks();

    service = module.get<UsersService>(UsersService);
  });

  describe('find', () => {
    it('should query the repository with the default params if no args are given', () => {
      expect(service.find(<FindUsersDto>{})).resolves.toEqual(resultArr);

      expect(query.where).toBeCalledTimes(0);
      expect(query.andWhere).toBeCalledTimes(0);
      expect(query.offset).toBeCalledTimes(0);

      expect(query.orderBy).toBeCalledTimes(1);
      expect(query.orderBy).toBeCalledWith('user.createdAt', 'DESC');

      expect(query.limit).toBeCalledTimes(1);
      expect(query.limit).toBeCalledWith(10);

      expect(query.getMany).toBeCalledTimes(1);
    });
  });
});
