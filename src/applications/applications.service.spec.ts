import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { FindApplicationsDto } from './dto/find-applications.dto';

import { ApplicationsService } from './applications.service';
import { Application } from './application.entity';

const app = new Application();
app.id = '935a38e8-ec14-41b8-8066-2bc5c818577a';
app.name = 'John Doe';
app.features = [];
app.description = 'Description';

const resultArr = [app];

const query = {
  where: jest.fn(),
  andWhere: jest.fn(),
  offset: jest.fn(),
  limit: jest.fn(),
  orderBy: jest.fn(),
  getMany: jest.fn().mockReturnValue(resultArr),
};

describe('ApplicationsService', () => {
  let service: ApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getRepositoryToken(Application),
          // define all the methods that you use from the catRepo
          // give proper return values as expected or mock implementations, your choice
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(query),
          },
        },
      ],
    }).compile();

    jest.clearAllMocks();

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  describe('find', () => {
    it('should query the repository with the default params if no args are given', () => {
      expect(service.find(<FindApplicationsDto>{})).resolves.toEqual(resultArr);

      expect(query.where).toBeCalledTimes(0);
      expect(query.andWhere).toBeCalledTimes(0);
      expect(query.offset).toBeCalledTimes(0);

      expect(query.orderBy).toBeCalledTimes(1);
      expect(query.orderBy).toBeCalledWith('application.createdAt', 'DESC');

      expect(query.limit).toBeCalledTimes(1);
      expect(query.limit).toBeCalledWith(10);

      expect(query.getMany).toBeCalledTimes(1);
    });
  });
});
