import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { EtcdModule } from './etcd/etcd.module';
import { FeaturesModule } from './features/features.module';

import config from './config';

console.log(`${process.env.ETCD_HOST}:${process.env.ETCD_PORT}`);
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => (<TypeOrmModuleOptions>{
        type: configService.get('db.client'),
        host: configService.get('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get('db.username'),
        password: configService.get('db.password'),
        database: configService.get('db.database'),
        schema: configService.get('db.schema'),
        ssl: configService.get<boolean>('db.ssl'),
        entities: ["dist/**/*.entity{.ts,.js}"],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    EtcdModule.forRoot({ hosts: `http://${process.env.ETCD_HOST}:${process.env.ETCD_PORT}`}),
    UsersModule,
    FeaturesModule,
  ],
  providers: [],
})
export class AppModule {}
