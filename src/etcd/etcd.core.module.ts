import { DynamicModule, Module, Global } from '@nestjs/common';
import { Etcd3 } from 'etcd3';

import { EtcdModuleOptions } from './interfaces/etcd-options.interface';
import { ETCD_CONNECTION } from './etcd.constants';

@Global()
@Module({})
export class EtcdCoreModule {
  static forRoot(options: EtcdModuleOptions = { hosts: '127.0.0.1:2379'}): DynamicModule {
    const connectionProvider = {
      provide: ETCD_CONNECTION,
      useValue: new Etcd3(options),
    };

    return {
      module: EtcdCoreModule,
      providers: [connectionProvider],
      exports: [connectionProvider],
    };
  }
}
