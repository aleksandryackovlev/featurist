import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Feature } from './feature.entity';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FindFeaturesDto } from './dto/find-features.dto';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Feature)
    private readonly repository: Repository<Feature>,
  ) {}

  async create(
    appId: string,
    createFeatureDto: CreateFeatureDto,
  ): Promise<Feature> {
    if (await this.isFeatureExists(appId, createFeatureDto.name)) {
      throw new BadRequestException('Feature already exists');
    }

    const entity = this.repository.create({
      ...createFeatureDto,
      applicationId: appId,
    });

    await this.repository.save(entity);

    return entity;
  }

  async isFeatureExists(appId: string, name: string) {
    const feature = await this.repository.findOne({ name });

    if (!feature) {
      return false;
    }

    return true;
  }

  async find(
    appId: string,
    findFeaturesDto: FindFeaturesDto,
  ): Promise<{ data: Feature[]; total: number }> {
    const {
      createdFrom,
      createdTo,
      updatedFrom,
      updatedTo,
      search,
      sortBy = 'updatedAt',
      sortDirection = 'desc',
      offset,
      limit = 10,
    } = findFeaturesDto;

    const query = this.repository.createQueryBuilder('feature');

    query.where('feature.applicationId = :appId', { appId });

    if (createdFrom) {
      query.andWhere('CAST (feature.createdAt AS DATE) >= :createdFrom', {
        createdFrom,
      });
    }

    if (createdTo) {
      query.andWhere('CAST (feature.createdAt AS DATE) <= :createdTo', {
        createdTo,
      });
    }

    if (updatedFrom) {
      query.andWhere('CAST (feature.updatedAt AS DATE) >= :updatedFrom', {
        updatedFrom,
      });
    }

    if (updatedTo) {
      query.andWhere('CAST (feature.updatedAt AS DATE) <= :updatedTo', {
        updatedTo,
      });
    }

    if (search) {
      query.andWhere('feature.name LIKE :search', { search: `%${search}%` });
    }

    if (offset) {
      query.offset(offset);
    }

    query.orderBy(
      `feature.${sortBy}`,
      <'ASC' | 'DESC'>sortDirection.toUpperCase(),
    );
    query.limit(limit);

    const [features, total] = await query.getManyAndCount();

    return {
      data: features,
      total,
    };
  }

  async findOne(appId: string, featureId: string): Promise<Feature> {
    const feature = await this.repository.findOne({
      id: featureId,
      applicationId: appId,
    });

    if (!feature) {
      throw new NotFoundException('Entity does not exist');
    }

    return feature;
  }

  async enable(appId: string, featureId: string): Promise<Feature> {
    const feature = await this.repository.findOne({
      id: featureId,
      applicationId: appId,
    });

    if (!feature) {
      throw new NotFoundException('Entity does not exist');
    }

    feature.isEnabled = true;
    feature.updatedAt = new Date();
    await this.repository.save(feature);

    return feature;
  }

  async disable(appId: string, featureId: string): Promise<Feature> {
    const feature = await this.repository.findOne({
      id: featureId,
      applicationId: appId,
    });

    if (!feature) {
      throw new NotFoundException('Entity does not exist');
    }

    feature.isEnabled = false;
    feature.updatedAt = new Date();
    await this.repository.save(feature);

    return feature;
  }

  async remove(appId: string, featureId: string): Promise<Feature> {
    const feature = await this.findOne(appId, featureId);

    await this.repository.delete(feature.id);

    return feature;
  }

  async update(
    appId: string,
    featureId: string,
    updateFeatureDto: UpdateFeatureDto,
  ): Promise<Feature> {
    const feature = await this.findOne(appId, featureId);

    await this.repository.update(featureId, updateFeatureDto);

    return { ...feature, ...updateFeatureDto };
  }
}
