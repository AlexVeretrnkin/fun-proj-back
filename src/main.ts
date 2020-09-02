import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    {
      cors: {origin: RegExp('http://.*:3200') }
    });
  await app.listen(3000);
}

bootstrap();
