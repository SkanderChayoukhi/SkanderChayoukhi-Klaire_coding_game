import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const firstError = errors[0];
        const errorMessage = Object.values(firstError.constraints)[0];
        return new BadRequestException({
          error: errorMessage,
        });
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(8000);
}
bootstrap();
