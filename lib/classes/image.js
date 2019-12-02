// const jimp = require('jimp');

const ERROR_NOSUPPORT = 'Error: File type is not supported';
const RESIZE_FAILED = 'Error: Resize failed';

import { SUPPORTED_MIMES } from '../config/supports';

class BabsiImage {
  constructor(webPDecoder) {
    this.webP = webPDecoder;
  }

  toBase64(extMimeType, data) {
    return `data:${extMimeType};base64,${data.toString('base64')}`;
  }

  optimize(blob, imageSrc) {
    // Read the image.
    let image;
    const ext = imageSrc.split('.').pop();
    if (ext === 'webp') {
      const buff = new Uint8Array(blob);
      console.log('getInfo:', blob, this.webP.getInfo(buff, buff.length));
      image = window.URL.createObjectURL(blob);
    } else {
      image = window.URL.createObjectURL(blob);
    }
    if (!SUPPORTED_MIMES[ext]) {
      throw new Error(ERROR_NOSUPPORT);
    }

    return image;
  }
}

export default BabsiImage;
