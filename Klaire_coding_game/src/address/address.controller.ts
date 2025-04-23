import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';


@Controller('api/addresses')
export class AddressController {
    constructor(private readonly addressService: AddressService) { }
    @Post()
    async create(@Body() createAddressDto: CreateAddressDto) {
        try {
            const address = await this.addressService.create(createAddressDto.q);
            if (!address) {
                throw new HttpException('Adresse non trouvée. Aucun résultat ne correspond à votre recherche.', HttpStatus.NOT_FOUND);
            }
            return address;
        } catch (error) {
            if (error instanceof HttpException) throw error; // Rethrow known HTTP exceptions
            throw new HttpException("Erreur serveur : impossible de contacter l'API externe.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id/risks')
    async getRisks(@Param('id') id: string) {
        try {
            const risks = await this.addressService.getRisks(+id);
            if (!risks) {
                throw new HttpException('Adresse non trouvée.', HttpStatus.NOT_FOUND);
            }
            return risks;
        } catch (error) {
            if (error instanceof HttpException) throw error; // Rethrow known HTTP exceptions
            throw new HttpException("Erreur serveur : échec de la récupération des données de Géorisques.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
