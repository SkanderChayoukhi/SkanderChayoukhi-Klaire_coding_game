import { Inject, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './address/entities/address.entity';
import { AddressModule } from './address/address.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';


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
        database: config.get<string>('app.databasePath'), // Use the database path from the configuration
        entities: [Address],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        timeout: 5000,
        baseURL: config.get<string>('app.banApiUrl'), // Use the base URL from the configuration
      }),
      inject: [ConfigService],  }),
    AddressModule,
  ],
})
export class AppModule {}
