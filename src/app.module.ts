import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from './admin/users/users.module';
import { FeaturesModule } from './admin/features/features.module';
import { ApplicationsModule } from './admin/applications/applications.module';
import { AuthModule } from './admin/auth/auth.module';
import { RolesModule } from './admin/roles/roles.module';
import { PermissionsModule } from './admin/permissions/permissions.module';

import { ClientFeaturesModule } from './client/features/features.module';

import config from './core/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        <TypeOrmModuleOptions>{
          type: configService.get('db.client'),
          host: configService.get('db.host'),
          port: configService.get<number>('db.port'),
          username: configService.get('db.username'),
          password: configService.get('db.password'),
          database: configService.get('db.database'),
          schema: configService.get('db.schema'),
          ssl: configService.get<boolean>('db.ssl'),
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: false,
          logging: process.env.NODE_ENV === 'development',
        },
      inject: [ConfigService],
    }),
    UsersModule,
    FeaturesModule,
    ApplicationsModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    ClientFeaturesModule,
  ],
  providers: [],
})
export class AppModule {}
