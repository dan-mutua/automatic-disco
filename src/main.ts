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
    .setTitle('Email Service API')
    .setDescription(
      'The Email Service API provides a comprehensive set of endpoints for sending emails and generating email reports. This RESTful API allows you to seamlessly integrate email functionality into your applications, making it easy to send transactional emails, automate email campaigns, and monitor email performance. With robust features and detailed reporting, you can ensure the delivery of emails and gain insights into their engagement ',
    )
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
