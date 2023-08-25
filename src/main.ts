import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Open API
  const options = new DocumentBuilder()
    .setTitle('a rest api for pims-sps')
    .setDescription('a nestjs api for sps-pims portal ')
    .setVersion('1.0.0')
    .addTag('nestjsapi')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'OPTIONS', 'DELETE'],
    optionsSuccessStatus: 204,
  });

  // await app.listen(3000);
  try {
    await app.listen(3000);
  } catch (error) {
    console.error('An error occurred while starting the app:', error);
  }
}
bootstrap();
