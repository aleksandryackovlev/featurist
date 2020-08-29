import { Injectable, BadRequestException } from '@nestjs/common';

import { CreateFeatureDto } from './dto/create-feature.dto';

import { Etcd3, EtcdClient } from '../etcd';


@Injectable()
export class FeaturesService {
  constructor(
    @EtcdClient()
    private readonly etcdClient: Etcd3,
  ) {}

  async create(createFeatureDto: CreateFeatureDto): Promise<void> {
    const isExist = await this.findOne(createFeatureDto.name);

    if (isExist) {
      throw new BadRequestException('Feature already exists');
    }

    await this.etcdClient.put(createFeatureDto.name).value('0');
  }

  async enable(name: string): Promise<void> {
    const isExist = await this.findOne(name);

    if (!isExist) {
      throw new BadRequestException('Feature does not exist');
    }

    await this.etcdClient.put(name).value('1');
  }

  async disable(name: string): Promise<void> {
    const isExist = await this.findOne(name);

    if (!isExist) {
      throw new BadRequestException('Feature does not exist');
    }

    await this.etcdClient.put(name).value('0');
  }

  findAll(): Promise<string[]> {
    return this.etcdClient.getAll().keys();
  }

  findOne(name: string): Promise<string | null> {
    return this.etcdClient.get(name).string();
  }

  async remove(name: string): Promise<void> {
    await this.etcdClient.delete().key(name);
  }
}
