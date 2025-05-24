import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

export async function createNestServer(server: express.Express) {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.use(express.json());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Familia Viva Project')
    .setDescription('Backend NestJS via Firebase')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('/familia-viva-recife/us-central1/nestApi')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();

  return server; // **NÃO ESQUECE DE RETORNAR!**
}
