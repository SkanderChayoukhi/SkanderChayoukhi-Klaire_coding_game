import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { HttpModule } from '@nestjs/axios';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address]),
    HttpModule,
  ],
  controllers: [AddressController],
  providers: [AddressService]
})
export class AddressModule {}
