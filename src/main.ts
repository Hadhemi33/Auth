import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { EventsGateway } from './events/events.gateway';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);

  // const eventGateway = app.get(EventsGateway);
  // setInterval(() => eventGateway.sendMessage(),2000);
}
bootstrap();
