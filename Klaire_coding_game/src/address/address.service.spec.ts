import { Test } from '@nestjs/testing';
import { AddressService } from './address.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';

describe('AddressService', () => {
  let service: AddressService;
  let httpService: jest.Mocked<HttpService>;
  
  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn()
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(() => of({ data: { features: [] } }))
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(key => {
              if (key === 'app.banApiUrl') return 'https://api-adresse.data.gouv.fr/search';
              if (key === 'app.georisquesApiUrl') return 'https://georisques.gouv.fr/api';
              return null;
            })
          }
        },
        {
          provide: getRepositoryToken(Address),
          useValue: mockRepo
        }
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    httpService = module.get(HttpService);
  });

  describe('create', () => {
    it('should return null if no results from BAN API', async () => {
      const result = await service.create('test');
      expect(result).toBeNull();
      expect(httpService.get).toHaveBeenCalledWith(
        'https://api-adresse.data.gouv.fr/search/?q=test&limit=1',
        { timeout: 5000 },
      );
    });
  });
});