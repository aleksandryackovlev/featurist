import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const options = new DocumentBuilder()
    .setTitle('Feature toggle server')
    .setDescription('API for manging feature toggles')
    .setVersion('0.1.0')
    .addServer('http://localhost:3000', 'development server')
    .addBearerAuth()
    .addTag('Applications', 'Methods for managing applications')
    .addTag('Features', 'Methods for managing features')
    .addTag('Users', 'Methods for managing users')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('openapi', app, document);

  await app.listen(3000);
}
bootstrap();
