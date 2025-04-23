import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);

  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    private httpService: HttpService,
  ) {}

  async create(query: string): Promise<Address | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=1`,
          { timeout: 5000 }, // set a request timeout
        ),
      );

      if (!response.data.features?.length) return null;

      const feature = response.data.features[0];
      const address = this.addressRepository.create({
        label: feature.properties.label,
        housenumber: feature.properties.housenumber,
        street: feature.properties.street,
        postcode: feature.properties.postcode,
        citycode: feature.properties.citycode,
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
      });

      return this.addressRepository.save(address);
    } catch (error) {
      this.logger.error(`BAN API Error: ${error.message}`);
      throw new InternalServerErrorException({
        error: "Erreur serveur : impossible de contacter l'API externe.",
      });
    }
  }

  async getRisks(id: number): Promise<any> {
    try {
      const address = await this.addressRepository.findOne({ where: { id } });
      if (!address) return null;

      const response = await firstValueFrom(
        this.httpService.get(
          `https://www.georisques.gouv.fr/api/v3/v1/resultats_rapport_risque?latlon=${address.longitude},${address.latitude}`,
          { timeout: 5000 },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Géorisques API Error: ${error.message}`);
      throw new InternalServerErrorException({
        error: "Erreur serveur : échec de la récupération des données de Géorisques.",
      });
    }
  }
}