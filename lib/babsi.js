/* global IntersectionObserver, document, window*/

// Classes
import BabsiImage from './classes/image';
import BabsiHttp from './classes/http';

// Wasm - binding to webplib
import wasm from './webp.wasm';
import imports from './utils/asm.js';

class Babsi {

  /**
   * 
   * @param {*} config 
   * 
   * config:
   * name: String     -     Default name, not useful at all
   * querySelector    -     Query selector of elements, default: '.babsi'
   * applyClass       -     Apply Class on viewport in, default: 'visible'
   * shouldApplyClass -     Should do apply class logic?, default: true
   * windowObject     -     window object, default: browser's window
   */
  constructor(config) {
    config = {...config};
    this._name = config.name || 'Babsi';
    this._querySelector = config.querySelector || '.babsi';
    this._applyClass = config.applyClass || 'visible';
    this._shouldApplyClass = config.shouldApplyClass || true;
    this._window = config.windowObject || window;
    this._currentTracked = {};

    this.addHttp();
    wasm({ ...imports }).then(({ instance, module }) => {
      console.log(instance);
      this._webP = {
        ...instance.exports
      };

      // Babsi-image require Wasm import
      this.addWebPDecoder();

      // Init Babsi only then async wasm import
      this.init();
    });
  }

  addWebPDecoder() {
    this.BABSIIMAGE = new BabsiImage(this._webP);
  }

  addHttp() {
    this.BABSIHTTP = new BabsiHttp();
  }

  checkCompatibility() {
    const ww = this._window;
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
    images.forEach((img) => {
      this.prepare(img);
    });
  }

  returnRandomId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  prepare(target) {
    const that = this;
    const randomId = this.returnRandomId();
    const canvas = document.createElement('canvas');
    
    target.style.display = 'none';
    canvas.id = randomId;
    canvas.setAttribute('data-babsi', randomId);
    
    target.setAttribute('data-babsi', randomId);
    target.insertAdjacentElement("afterend", canvas);

    this.BABSIHTTP.addRequest(target.dataset.src, (image) => {
      const buffer = this.BABSIIMAGE.optimize(image, target.dataset.src);
      const currentImage = document.createElement('img');
      currentImage.src = buffer;
      canvas.style.width = '100%';
      const ctx = canvas.getContext('2d');
      currentImage.onload = () => {
        const { width, height } = {
          width: currentImage.naturalWidth,
          height: currentImage.naturalHeight
        };
        const canvasWidth = canvas.getBoundingClientRect().width;
        const ratioHeight = (canvasWidth * height) / width;

        ctx.clearRect(0, 0, canvasWidth, ratioHeight);  // Fix change src future-proof

        canvas.width = canvasWidth;
        canvas.height = ratioHeight;
        
        that._observer.observe(canvas);

        this._currentTracked[randomId] = {
          canvas,
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
          } else {
            that.removeClass(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -100px 0px'
      }
    );
  }

  handleCallback(target) {
    const id = target.dataset.babsi;
    const obj = this._currentTracked[id];
    obj.ctx.drawImage(obj.currentImage, 0, 0, obj.width, obj.height);
    if (this._shouldApplyClass) {
      obj.canvas.classList.add(this._applyClass);
    }
  }

  // To optimize, too much calls without reason
  removeClass(target) {
    if (this._shouldApplyClass) {
      const id = target.dataset.babsi;
      const obj = this._currentTracked[id];
      obj.canvas.classList.remove(this._applyClass);
    }
  }
}
export default Babsi;
