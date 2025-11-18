import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CheckPasswordPipe } from './common/pipes/checkPassword.pipe';
import { ValidationPipe } from '@nestjs/common';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,
  //   forbidNonWhitelisted: true
  // }));
  app.enableCors();
app.useGlobalInterceptors(new LoggerInterceptor());
  await app.listen(process.env.PORT ?? 5000);
  console.log(`Application is running on: ${process.env.PORT ?? 5000}`);
}
bootstrap();
