import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApplicationsService } from '../applications/applications.service';

import { Feature } from './feature.entity';
import { Feature as IFeature } from './interfaces/feature';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FindFeaturesDto } from './dto/find-features.dto';

import { Etcd3, EtcdClient } from '../etcd';

@Injectable()
export class FeaturesService {
  constructor(
    @EtcdClient()
    private readonly etcdClient: Etcd3,
    @InjectRepository(Feature)
    private readonly repository: Repository<Feature>,
    private readonly applicationsService: ApplicationsService,
  ) {}

  async create(
    appId: string,
    createFeatureDto: CreateFeatureDto,
  ): Promise<IFeature> {
    if (!(await this.applicationsService.isApplicationExists(appId))) {
      throw new BadRequestException('Application does not exist');
    }

    if (await this.isFeatureExists(appId, createFeatureDto.name)) {
      throw new BadRequestException('Feature already exists');
    }

    const entity = this.repository.create({
      ...createFeatureDto,
      applicationId: appId,
    });

    await this.etcdClient.put(`${appId}/${createFeatureDto.name}`).value('0');

    await this.repository.save(entity);

    return {
      ...entity,
      isEnabled: false,
    };
  }

  async isFeatureExists(appId: string, name: string) {
    const feature = await this.repository.findOne({ name });

    if (!feature) {
      return false;
    }

    const value = await this.etcdClient.get(`${appId}/${name}`).string();

    if (!value) {
      return false;
    }

    return true;
  }

  async find(
    appId: string,
    findFeaturesDto: FindFeaturesDto,
  ): Promise<IFeature[]> {
    const {
      createdFrom,
      createdTo,
      updatedFrom,
      updatedTo,
      search,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      offset,
      limit = 10,
    } = findFeaturesDto;

    if (!(await this.applicationsService.isApplicationExists(appId))) {
      throw new NotFoundException();
    }

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

    const features = await query
      .orderBy(`feature.${sortBy}`, <'ASC' | 'DESC'>sortDirection.toUpperCase())
      .limit(limit)
      .getMany();

    const featuresValues = await this.etcdClient
      .getAll()
      .prefix(`${appId}/`)
      .strings();

    return features.map(feature => ({
      ...feature,
      isEnabled: featuresValues[`${appId}/${feature.name}`] === '1',
    }));
  }

  async findOne(appId: string, featureId: string): Promise<IFeature> {
    const feature = await this.repository.findOne({
      id: featureId,
      applicationId: appId,
    });

    if (!feature) {
      throw new NotFoundException();
    }

    const value = await this.etcdClient
      .get(`${appId}/${feature.name}`)
      .string();

    return {
      ...feature,
      isEnabled: !!value && value === '1',
    };
  }

  async enable(appId: string, featureId: string): Promise<IFeature> {
    const feature = await this.repository.findOne({
      id: featureId,
      applicationId: appId,
    });

    if (!feature) {
      throw new NotFoundException();
    }

    await this.etcdClient.put(`${appId}/${feature.name}`).value('1');

    feature.updatedAt = new Date();
    await this.repository.save(feature);

    return {
      ...feature,
      isEnabled: true,
    };
  }

  async disable(appId: string, featureId: string): Promise<IFeature> {
    const feature = await this.repository.findOne({
      id: featureId,
      applicationId: appId,
    });

    if (!feature) {
      throw new NotFoundException();
    }

    await this.etcdClient.put(`${appId}/${feature.name}`).value('0');

    feature.updatedAt = new Date();
    await this.repository.save(feature);

    return {
      ...feature,
      isEnabled: false,
    };
  }

  async remove(appId: string, featureId: string): Promise<IFeature> {
    const feature = await this.findOne(appId, featureId);

    await this.etcdClient.delete().key(`${appId}/${feature.name}`);

    await this.repository.delete(feature.id);

    return feature;
  }

  async update(
    appId: string,
    featureId: string,
    updateFeatureDto: UpdateFeatureDto,
  ): Promise<IFeature> {
    const feature = await this.findOne(appId, featureId);

    await this.repository.update(featureId, updateFeatureDto);

    return { ...feature, ...updateFeatureDto };
  }
}
