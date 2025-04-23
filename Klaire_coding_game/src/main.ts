import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const firstError = errors[0];
        const constraints = firstError?.constraints;
        const errorMessage = constraints ? Object.values(constraints)[0] : 'Validation error';
        return new BadRequestException({
          error: errorMessage,
        });
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  const port = config.get<number>('app.port') || 8000; 
  await app.listen(port);
}
bootstrap();
