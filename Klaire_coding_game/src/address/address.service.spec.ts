import { Test } from '@nestjs/testing';
import { AddressService } from './address.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { ConfigService } from '@nestjs/config';

describe('AddressService', () => {
  let service: AddressService;
  let httpService: jest.Mocked<HttpService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    httpService = {
      get: jest.fn(),
    } as any;

    configService = {
      get: jest.fn().mockImplementation((key: string) => {
        switch (key) {
          case 'app.banApiUrl':
            return 'https://api-adresse.data.gouv.fr/search';
          case 'app.georisquesApiUrl':
            return 'https://georisques.gouv.fr/api';
          default:
            return null;
        }
      }),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        AddressService,
        { provide: HttpService, useValue: httpService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
  });

  describe('create', () => {
    it('should return null if no results from BAN API', async () => {
      httpService.get.mockReturnValue(of({ data: { features: [] } } as any));
      expect(await service.create('test')).toBeNull();
      expect(httpService.get).toHaveBeenCalledWith(
        'https://api-adresse.data.gouv.fr/search/?q=test&limit=1',
        { timeout: 5000 },
      );
    });
  });
});