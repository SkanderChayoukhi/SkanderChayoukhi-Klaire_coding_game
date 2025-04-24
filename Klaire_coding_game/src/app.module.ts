import { Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './address/entities/address.entity';
import { AddressModule } from './address/address.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { HealthModule } from './health/health.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get<string>('app.databasePath'), 
        entities: [Address],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        timeout: 5000,
        baseURL: config.get<string>('app.banApiUrl'), 
      }),
      inject: [ConfigService],  }),
    AddressModule,
    HealthModule,
  ],
})
export class AppModule {}
