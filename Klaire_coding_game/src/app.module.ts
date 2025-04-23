import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './address/entities/address.entity';
import { AddressModule } from './address/address.module';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.TYPEORM_DATABASE || './data/db.sqlite',
      entities: [Address],
      synchronize: true, // Set to false in production
    }),
    HttpModule,
    AddressModule,
  ],
})
export class AppModule {}
