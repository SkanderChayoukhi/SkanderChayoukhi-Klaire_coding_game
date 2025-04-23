import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('api/addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(@Body() createAddressDto: CreateAddressDto) {
    const address = await this.addressService.create(createAddressDto.q);
    if (!address) {
      throw new NotFoundException({
        error: "Adresse non trouvée. Aucun résultat ne correspond à votre recherche.",
      });
    }
    return address;
  }

  @Get(':id/risks')
  async getRisks(@Param('id') id: string) {
    const risks = await this.addressService.getRisks(+id);
    if (!risks) {
      throw new NotFoundException({
        error: "Adresse non trouvée.",
      });
    }
    return risks;
  }
}