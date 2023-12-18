import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

// TODO product
// TODO auth user
// TODO payment service
// TODO orders

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  const PORT = configService.get('PORT');
  const CLIENT_URL = configService.get('CLIENT_URL')
  app.enableCors({
    credentials: true,
    origin: CLIENT_URL
  })
  app.setGlobalPrefix('api')
  await app.listen(PORT);
  console.log("Server start on port " + PORT)
}
bootstrap();