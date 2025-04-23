import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let errorMessage = "Erreur serveur inattendue.";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      errorMessage = typeof exceptionResponse === 'object' 
        ? (exceptionResponse as any).error 
        : exceptionResponse;
    }

    response.status(status).json({
      statusCode: status,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}