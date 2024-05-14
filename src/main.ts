import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload';
// import { EventsGateway } from './events/events.gateway';
async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*', // Allow all origins (in production, specify allowed origins)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Include credentials like cookies, if needed
  });
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));
  await app.listen(3001);

  // const eventGateway = app.get(EventsGateway);
  // setInterval(() => eventGateway.sendMessage(),2000);
}
bootstrap();
