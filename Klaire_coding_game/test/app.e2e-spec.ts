import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../src/address/entities/address.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

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
    await app.init();
  });

  describe('POST /api/addresses', () => {
    it('should reject empty query (400)', () => {
      return request(app.getHttpServer())
        .post('/api/addresses')
        .send({ q: '' })
        .expect(400)
        .expect(res => {
          expect(res.body).toEqual({
            statusCode: 400,
            error: "Le champ 'q' doit être une chaîne non vide.",
            timestamp: expect.any(String),
          });
        });
    });

    it('should return 404 if no address found', () => {
      return request(app.getHttpServer())
        .post('/api/addresses')
        .send({ q: 'INVALID_ADDRESS_123' })
        .expect(404)
        .expect({
          statusCode: 404,
          error: "Adresse non trouvée. Aucun résultat ne correspond à votre recherche.",
          timestamp: expect.any(String),
        });
    });
  });

  describe('GET /api/addresses/:id/risks', () => {
    it('should return 404 for non-existent address', () => {
      return request(app.getHttpServer())
        .get('/api/addresses/999/risks')
        .expect(404)
        .expect({
          statusCode: 404,
          error: "Adresse non trouvée.",
          timestamp: expect.any(String),
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
