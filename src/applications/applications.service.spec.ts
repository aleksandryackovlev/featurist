import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ApplicationsService } from './applications.service';
import { Application } from './application.entity';

const query = {
  where: jest.fn().mockReturnValue(this),
  offset: jest.fn().mockReturnValue(this),
  limit: jest.fn().mockReturnValue(this),
  orderBy: jest.fn().mockReturnValue(this),
  getMany: jest.fn().mockReturnValue([]),
};

describe('FeaturesService', () => {
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

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
