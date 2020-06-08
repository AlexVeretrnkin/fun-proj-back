import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs'

import { PNG } from 'pngjs'
import * as pixelmatch from 'pixelmatch'

@Injectable()
export class PhotoComparingService {
  public compareTwoImages(firstPath: string, secondPath: string): void {
    const img1: PNG = PNG.sync.read(readFileSync(firstPath));

    const img2: PNG = PNG.sync.read(readFileSync(secondPath));

    const {width, height}: {width: number, height: number} = img1;

    const diff: PNG = new PNG({width, height});

    const pixelDiff: number = pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.5, diffMask: true});

    writeFileSync('src/core/photo-comparing/diff.png', PNG.sync.write(diff));

    console.log(pixelDiff);
  }
}
