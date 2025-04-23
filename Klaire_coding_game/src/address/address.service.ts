import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(Address)
        private addressRepository: Repository<Address>,
        private httpService: HttpService,
    ) { }
    async create(query: string): Promise<Address | null> {
        const response = await firstValueFrom(
            this.httpService.get(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=1`),
        );

        if (!response.data.features?.length) return null; // No address found
        
        const feature = response.data.features[0];
        const properties = feature.properties;
        const geometry = feature.geometry;

        const address = this.addressRepository.create({
            label: properties.label,
            housenumber: properties.housenumber,
            street: properties.street,
            postcode: properties.postcode,
            citycode: properties.citycode,
            latitude: geometry.coordinates[1],
            longitude: geometry.coordinates[0],
        });
        return this.addressRepository.save(address);
    }

    async getRisks(id: number): Promise<any> {
        const address = await this.addressRepository.findOne({ where: { id } });
        if (!address) return null; // Address not found

        const response = await firstValueFrom(
            this.httpService.get(`https://www.georisques.gouv.fr/api/v3/v1/resultats_rapport_risque?latlon=${address.longitude},${address.latitude}`),
        );

        return response.data;

    }

}
