import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as helmet from 'helmet';

import { AppModule } from './app.module';

type VerifyOriginFunction = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void,
) => void;

export const verifyOrigin: (allowedOrigin: string) => VerifyOriginFunction = (
  allowedOrigin,
) => (origin, done) => {
  if (allowedOrigin === '*' || !origin || allowedOrigin === origin) {
    return done(null, true);
  }

  return done(new Error('Not allowed by CORS'));
};

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

  app.use(helmet());

  app.enableCors({
    origin: verifyOrigin(process.env.CLIENT_URL || '*'),
    maxAge: 31536000,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  });

  const options = new DocumentBuilder()
    .setTitle('Feature toggle server')
    .setDescription('API for manging feature toggles')
    .setVersion('0.1.0')
    .addServer('http://localhost:3000', 'development server')
    .addBearerAuth()
    .addTag('Applications', 'Methods for managing applications')
    .addTag('Features', 'Methods for managing features')
    .addTag('Users', 'Methods for managing users')
    .addTag('Auth', "Methods for users' authentication")
    .addTag('Roles', "Methods for managing users' roles")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('openapi', app, document);

  await app.listen(process.env.BACKEND_PORT || 3000);
}
bootstrap();
