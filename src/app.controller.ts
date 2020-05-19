import { Controller, Get } from '@nestjs/common';

import { PhotoComparingService } from './core/photo-comparing/photo-comparing.service';

@Controller()
export class AppController {
  constructor(
    private readonly photoComparingService: PhotoComparingService
  ) {}

  @Get()
  getHello(): string {
    return this.photoComparingService.test();
  }
}
