import { Injectable, BadRequestException } from '@nestjs/common';

import { CreateFeatureDto } from './dto/create-feature.dto';
import { Feature } from './interfaces/feature';

import { Etcd3, EtcdClient } from '../etcd';

@Injectable()
export class FeaturesService {
  constructor(
    @EtcdClient()
    private readonly etcdClient: Etcd3,
  ) {}

  async create(
    appId: string,
    createFeatureDto: CreateFeatureDto,
  ): Promise<Feature> {
    const isExist = await this.findOne(appId, createFeatureDto.name);

    if (isExist) {
      throw new BadRequestException('Feature already exists');
    }

    await this.etcdClient.put(`${appId}/${createFeatureDto.name}`).value('0');

    return {
      name: createFeatureDto.name,
      isEnabled: false,
    };
  }

  async enable(appId: string, name: string): Promise<Feature> {
    const isExist = await this.findOne(appId, name);

    if (!isExist) {
      throw new BadRequestException('Feature does not exist');
    }

    await this.etcdClient.put(`${appId}/${name}`).value('1');

    return {
      name,
      isEnabled: true,
    };
  }

  async disable(appId: string, name: string): Promise<Feature> {
    const isExist = await this.findOne(appId, name);

    if (!isExist) {
      throw new BadRequestException('Feature does not exist');
    }

    await this.etcdClient.put(`${appId}/${name}`).value('0');

    return {
      name,
      isEnabled: false,
    };
  }

  async findAll(appId: string): Promise<Feature[]> {
    const features = await this.etcdClient
      .getAll()
      .prefix(`${appId}/`)
      .strings();

    return Object.keys(features).map(feature => ({
      name: feature.split(`${appId}/`)[1],
      isEnabled: features[feature] === '1',
    }));
  }

  async findOne(appId: string, name: string): Promise<Feature | null> {
    const value = await this.etcdClient.get(`${appId}/${name}`).string();

    return value
      ? {
          name,
          isEnabled: value === '1',
        }
      : null;
  }

  async remove(appId: string, name: string): Promise<Feature> {
    const value = await this.findOne(appId, name);

    if (!value) {
      throw new BadRequestException('Feature does not exist');
    }

    await this.etcdClient.delete().key(`${appId}/${name}`);

    return value;
  }
}
