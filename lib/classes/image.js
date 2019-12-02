// const jimp = require('jimp');

const ERROR_NOSUPPORT = 'Error: File type is not supported';
const RESIZE_FAILED = 'Error: Resize failed';

import { SUPPORTED_MIMES } from '../config/supports';
import {createImageBitmap} from '../utils/Bitmap';

class BabsiImage {
  constructor(webPDecoder) {
    this.webP = webPDecoder;
  }

  async loadImage(src) {
    // Load image
    const img = await createImageBitmap(imgBlob);
    // Make canvas same size as image
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw image onto canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height);
  }

  optimize(blob, imageSrc) {
    let image;
    const ext = imageSrc.split('.').pop();
    if (!SUPPORTED_MIMES[ext]) {
      throw new Error(ERROR_NOSUPPORT);
    }

    if (ext === 'webp') {
      console.log(blob);
      image = window.URL.createObjectURL(blob);
    } else {
      image = window.URL.createObjectURL(blob);
    }
    
    return image;
  }
}

export default BabsiImage;
