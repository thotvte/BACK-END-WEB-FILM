import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Kết nối với cơ sở dữ liệu và sử dụng các pipe validation
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  // Cấu hình CORS
  app.enableCors({
    origin: configService.get('frontendUrl'), // Thay thế 'frontendUrl' bằng URL frontend của bạn từ file .env
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
