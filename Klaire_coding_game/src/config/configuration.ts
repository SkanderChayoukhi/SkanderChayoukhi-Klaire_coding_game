import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  databasePath: process.env.TYPEORM_DATABASE,
  banApiUrl: process.env.BAN_API_URL,
  georisquesApiUrl: process.env.GEORISQUES_API_URL,
  port: parseInt(process.env.PORT || '8000', 10),
}));