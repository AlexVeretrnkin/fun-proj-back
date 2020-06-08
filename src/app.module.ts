import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { CoreModule } from './core/core.module';
import { OngoingsController } from './ongoings/ongoings.controller';

@Module({
  imports: [
    CoreModule
  ],
  controllers: [
    AppController,
    OngoingsController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
