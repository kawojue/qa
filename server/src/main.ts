import * as morgan from 'morgan';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { config } from 'configs/env.config';
import { AppModule } from 'app/app.module';
import { CustomValidationPipe } from 'helpers/validation';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let PORT: number;

async function bootstrap() {
  PORT = config.port;
  const app = await NestFactory.create(AppModule);

  // app.enableCors({
  //   origin: ['http://localhost:3000', process.env.CLIENT_URL],
  //   credentials: true,
  //   optionsSuccessStatus: 200,
  //   methods: 'GET,POST,DELETE,PATCH,PUT',
  //   preflightContinue: false,
  // });

  app.use(morgan('dev'));
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ limit: '5mb', extended: true }));
  app.useGlobalPipes(
    new CustomValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerOptions = new DocumentBuilder()
    .setTitle('QA')
    .setVersion('1.7.2')
    .addServer(`http://localhost:${PORT}`, 'Local')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(PORT);
}

bootstrap()
  .then(() => console.info(`http://localhost:${PORT}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
