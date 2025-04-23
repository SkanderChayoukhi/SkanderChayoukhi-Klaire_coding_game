import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api/health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check API availability' })
  checkHealth() {
    return { status: 'OK' };
  }
}