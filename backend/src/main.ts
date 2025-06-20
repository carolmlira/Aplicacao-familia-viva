import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { initializeApp, getApps } from 'firebase-admin/app';

export async function createNestServer(expressInstance?: express.Express) {
  const app = expressInstance
    ? await NestFactory.create(AppModule, new ExpressAdapter(expressInstance))
    : await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('Familia Viva Project')
    .setDescription('Backend NestJS via Firebase')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('/') // Ajuste para Firebase
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();
  if (!getApps().length) {
    initializeApp();
  }

  if (!expressInstance) {
    const PORT = parseInt(process.env.PORT ?? '8080');
    await app.listen(PORT);
  }

  // Debug: Liste todas as rotas registradas
  if (process.env.NODE_ENV === 'development') {
    const router = app.getHttpAdapter().getInstance();
    router._router.stack.forEach(printRoutes);
  }

  return app;
}

function printRoutes(layer: any) {
  if (layer.route) {
    console.log(
      `${layer.route.stack[0].method.toUpperCase()} ${layer.route.path}`,
    );
  }
}
