import { Module } from '@nestjs/common';

import { PhotoComparingService } from './photo-comparing/photo-comparing.service';

@Module({
  providers: [
    PhotoComparingService
  ],
  exports: [
    PhotoComparingService
  ]
})
export class CoreModule {}
