import { IProcessor } from 'typeorm-fixtures-cli';

import { Etcd3 } from 'etcd3';
import * as dotenv from 'dotenv';

import { Feature } from '../../src/features/feature.entity';

dotenv.config();

export default class FeatureProcessor implements IProcessor<Feature> {
  async postProcess(name: string, feature: { [key: string]: any }): Promise<void> {
    const etcdClient = new Etcd3({
      hosts: JSON.parse(process.env.ETCD_HOSTS),
    });

    await etcdClient.put(`${feature.application.id}/${feature.name}`).value(Math.round(Math.random()) ? '1' : '0');
  }
}
