import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { CoreModule } from './core/core.module';
import { OngoingsController } from './ongoings/ongoings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TitlePreviewEntity } from './entity/title-preview.entity';
import { TitleController } from './title/title.controller';
import { TitleVideoEntity } from './entity/title-video.entity';

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
      entities: [TitlePreviewEntity, TitleVideoEntity],
      synchronize: true,
    }),
  ],
  controllers: [
    AppController,
    OngoingsController,
    TitleController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
