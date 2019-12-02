/* global IntersectionObserver, document, window*/

import BabsiImage from './classes/image';
import BabsiHttp from './classes/http';
import wasm from './webp.wasm';
import {
  ___assert_fail,
  _emscripten_get_heap_size,
  _emscripten_get_sbrk_ptr,
  _emscripten_memcpy_big,
  emscripten_realloc_buffer,
  _emscripten_resize_heap,
  _setTempRet0
} from './utils/asm.js';
const imports = {
  env: {
    memory: new WebAssembly.Memory({ initial: 256 }),
    table: new WebAssembly.Table({
      initial: 157,
      maximum: 157 + 0,
      element: 'anyfunc'
    }),
    __assert_fail: ___assert_fail,
    emscripten_get_heap_size: _emscripten_get_heap_size,
    emscripten_get_sbrk_ptr: _emscripten_get_sbrk_ptr,
    emscripten_memcpy_big: _emscripten_memcpy_big,
    emscripten_realloc_buffer,
    emscripten_resize_heap: _emscripten_resize_heap,
    setTempRet0: _setTempRet0,
  }
};


class Babsi {
  constructor(config) {
    config = {...config};
    this._name = config.name || 'Babsi';
    this._querySelector = config.querySelector || '.babsi';
    this._applyClass = config.applyClass || 'visible';
    this._shouldApplyClass = config.shouldApplyClass || true;
    this._wasm = wasm;
    this._currentTracked = {};

    this.BABSIHTTP = new BabsiHttp();
    wasm({ ...imports }).then(({ instance, module }) => {
      this._webP = {
        ...instance.exports
      };
      this.BABSIIMAGE = new BabsiImage(this._webP);
      this.init();
    });
  }

  checkCompatibility(window) {
    const ww = window;
    if (typeof ww !== 'undefined') {
      const io = typeof window.IntersectionObserver === 'undefined';

      if (!ww || io) {
        return false;
      }

      return true;
    }

    return false;
  }

  init() {
    this._observer = this.createObserver();

    const images = document.querySelectorAll(this._querySelector);
    // console.log('selected:', images);
    images.forEach((img) => {
      this.prepare(img);
    });
  }

  returnRandomId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  prepare(target) {
    const that = this;
    target.style.display = 'none';
    const s = document.createElement('canvas');
    const randomId = this.returnRandomId();
    s.id = randomId;
    target.setAttribute('data-babsi', randomId);
    target.insertAdjacentElement("afterend", s);
    this.BABSIHTTP.addRequest(target.dataset.src, (image) => {
      const buffer = this.BABSIIMAGE.optimize(image, target.dataset.src);
      const currentImage = document.createElement('img');
      currentImage.src = buffer;
      const canvas = document.getElementById(randomId);
      canvas.style.width = '100%';
      const ctx = canvas.getContext('2d');
      currentImage.onload = () => {
        const width = currentImage.naturalWidth;
        const height = currentImage.naturalHeight;
        const canvasWidth = canvas.getBoundingClientRect().width;
        const ratioHeight = (canvasWidth * height) / width;
        ctx.clearRect(0, 0, canvasWidth, ratioHeight);
        canvas.width = canvasWidth;
        canvas.height = ratioHeight;
        canvas.setAttribute('data-babsi', randomId);
        that._observer.observe(canvas);
        this._currentTracked[randomId] = {
          ctx,
          currentImage,
          width: canvasWidth,
          height: ratioHeight,
        }
      }
    });
  }

  createObserver() {
    const that = this;
    return new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            that.handleCallback(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -100px 0px'
      }
    );
  }

  handleCallback(target) {
    console.log(this._currentTracked);
    const id = target.dataset.babsi;
    const obj = this._currentTracked[id];
    obj.ctx.drawImage(obj.currentImage, 0, 0, obj.width, obj.height);
  }
}
export default Babsi;
