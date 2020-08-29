import { DynamicModule, Module } from '@nestjs/common';

import { EtcdModuleOptions } from './interfaces/etcd-options.interface';
import { EtcdCoreModule } from './etcd.core.module';

@Module({})
export class EtcdModule {
  static forRoot(options?: EtcdModuleOptions): DynamicModule {
    return {
      module: EtcdModule,
      imports: [EtcdCoreModule.forRoot(options)],
    };
  }
}
