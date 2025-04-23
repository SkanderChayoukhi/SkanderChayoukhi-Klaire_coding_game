// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Address } from '../src/address/entities/address.entity';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { Repository } from 'typeorm';
import { AxiosResponse } from 'axios';
import { ValidationPipe } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let addressRepository: Repository<Address>;
  let httpService: HttpService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Address],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Add validation pipe with proper configuration
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false, // Ensure error messages are included
    }));
    
    addressRepository = moduleFixture.get<Repository<Address>>(getRepositoryToken(Address));
    httpService = moduleFixture.get<HttpService>(HttpService);
    
    await app.init();
  });

  afterEach(async () => {
    await addressRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/addresses', () => {
// Update just the failing test case in app.e2e-spec.ts
it('should reject empty query (400)', () => {
  return request(app.getHttpServer())
    .post('/api/addresses')
    .send({ q: '' })
    .expect(400)
    .expect(res => {
      expect(res.body).toMatchObject({
        statusCode: 400,
        error: 'Bad Request',
        message: expect.arrayContaining([
          expect.stringMatching(/Le champ 'q' (doit être une chaîne non vide|est requis)/)
        ])
      });
    });
});

    it('should return 404 if no address found', () => {
      jest.spyOn(httpService, 'get').mockImplementation(() => 
        of({
          data: { features: [] },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {}
        } as AxiosResponse)
      );

      return request(app.getHttpServer())
        .post('/api/addresses')
        .send({ q: 'INVALID_ADDRESS_123' })
        .expect(404)
        .expect({
          error: "Adresse non trouvée. Aucun résultat ne correspond à votre recherche."
        });
    });

    it('should create and return address for valid query (201)', async () => {
      const mockResponse = {
        features: [{
          properties: {
            label: "8 bd du Port, 56170 Sarzeau",
            housenumber: "8",
            street: "bd du Port",
            postcode: "56170",
            citycode: "56242"
          },
          geometry: {
            coordinates: [-2.73745, 47.58234]
          }
        }]
      };

      jest.spyOn(httpService, 'get').mockImplementation(() => 
        of({
          data: mockResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {}
        } as AxiosResponse)
      );

      const response = await request(app.getHttpServer())
        .post('/api/addresses')
        .send({ q: '8 bd du Port' })
        .expect(201);

      expect(response.body).toEqual({
        id: expect.any(Number),
        label: "8 bd du Port, 56170 Sarzeau",
        housenumber: "8",
        street: "bd du Port",
        postcode: "56170",
        citycode: "56242",
        latitude: 47.58234,
        longitude: -2.73745
      });
    });
  });

  describe('GET /api/addresses/:id/risks', () => {
    it('should return 404 for non-existent address', () => {
      return request(app.getHttpServer())
        .get('/api/addresses/999/risks')
        .expect(404)
        .expect({
          error: "Adresse non trouvée."
        });
    });

    it('should return risks for valid address (200)', async () => {
      const mockBanResponse = {
        features: [{
          properties: {
            label: "8 bd du Port, 56170 Sarzeau",
            housenumber: "8",
            street: "bd du Port",
            postcode: "56170",
            citycode: "56242"
          },
          geometry: {
            coordinates: [-2.73745, 47.58234]
          }
        }]
      };

      const mockRisksResponse = {
        risques: [
          { type: "inondation", niveau: "moyen" }
        ]
      };

      jest.spyOn(httpService, 'get')
        .mockImplementationOnce(() => of({
          data: mockBanResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {}
        } as AxiosResponse))
        .mockImplementationOnce(() => of({
          data: mockRisksResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {}
        } as AxiosResponse));

      const createResponse = await request(app.getHttpServer())
        .post('/api/addresses')
        .send({ q: '8 bd du Port' });

      return request(app.getHttpServer())
        .get(`/api/addresses/${createResponse.body.id}/risks`)
        .expect(200)
        .expect(mockRisksResponse);
    });
  });
});