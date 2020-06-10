import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { CoreModule } from './core/core.module';
import { OngoingsController } from './ongoings/ongoings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TitlePreviewEntity } from './entity/title-preview-entity';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1111',
      database: 'fun',
      entities: [TitlePreviewEntity],
      synchronize: true,
    }),
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
