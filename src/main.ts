// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { graphqlUploadExpress } from 'graphql-upload';
// // import { EventsGateway } from './events/events.gateway';
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));
//   const config = new DocumentBuilder()
//     // .addBearerAuth()
//     .setTitle('BidFlick')
//     .setDescription('The BidFlick API description')
//     .setVersion('1.0')
//     .addTag('Bidflick')
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document);
//   app.useGlobalPipes(new ValidationPipe());
//   app.enableCors({
//     origin: '*', // Allow all origins (in production, specify allowed origins)
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
//     credentials: true, // Include credentials like cookies, if needed
//   });
//   await app.listen(3001);

//   // const eventGateway = app.get(EventsGateway);
//   // setInterval(() => eventGateway.sendMessage(),2000);
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { graphqlUploadExpress } from 'graphql-upload';
// import { EventsGateway } from './events/events.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));

  const config = new DocumentBuilder()
    .setTitle('BidFlick')
    .setDescription('The BidFlick API description')
    .setVersion('1.0')
    .addTag('Bidflick')
    // .addBearerAuth() // Uncomment if you use authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*', // Allow all origins (in production, specify allowed origins)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Include credentials like cookies, if needed
  });

  await app.listen(3001);

  // const eventGateway = app.get(EventsGateway);
  // setInterval(() => eventGateway.sendMessage(),2000);
}

bootstrap();
