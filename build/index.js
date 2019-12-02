
function _loadWasmModule (sync, src, imports) {
        var buf = null
        var isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null
        if (isNode) {
          buf = Buffer.from(src, 'base64')
        } else {
          var raw = window.atob(src)
          var rawLength = raw.length
          buf = new Uint8Array(new ArrayBuffer(rawLength))
          for(var i = 0; i < rawLength; i++) {
             buf[i] = raw.charCodeAt(i)
          }
        }

        if (imports && !sync) {
          return WebAssembly.instantiate(buf, imports)
        } else if (!imports && !sync) {
          return WebAssembly.compile(buf)
        } else {
          var mod = new WebAssembly.Module(buf)
          return imports ? new WebAssembly.Instance(mod, imports) : mod
        }
      }
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Babsi = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  var SUPPORTED_MIMES = {
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp'
  };

  var createImageBitmap = function createImageBitmap(data) {
    return regeneratorRuntime.async(function createImageBitmap$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              var dataURL;

              if (data instanceof Blob) {
                dataURL = URL.createObjectURL(data);
              } else if (data instanceof ImageData) {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = data.width;
                canvas.height = data.height;
                ctx.putImageData(data, 0, 0);
                dataURL = canvas.toDataURL();
              } else {
                throw new Error('createImageBitmap does not handle the provided image source type');
              }

              var img = document.createElement('img');
              img.addEventListener('load', function () {
                resolve(this);
              });
              img.src = dataURL;
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    });
  };

  // const jimp = require('jimp');
  var ERROR_NOSUPPORT = 'Error: File type is not supported';

  var BabsiImage =
  /*#__PURE__*/
  function () {
    function BabsiImage(webPDecoder) {
      _classCallCheck(this, BabsiImage);

      this.webP = webPDecoder;
    }

    _createClass(BabsiImage, [{
      key: "loadImage",
      value: function loadImage(src) {
        var imgBlob, img, canvas, ctx;
        return regeneratorRuntime.async(function loadImage$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return regeneratorRuntime.awrap(fetch(src).then(function (resp) {
                  return resp.blob();
                }));

              case 2:
                imgBlob = _context.sent;
                _context.next = 5;
                return regeneratorRuntime.awrap(createImageBitmap(imgBlob));

              case 5:
                img = _context.sent;
                // Make canvas same size as image
                canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height; // Draw image onto canvas

                ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                return _context.abrupt("return", ctx.getImageData(0, 0, img.width, img.height));

              case 12:
              case "end":
                return _context.stop();
            }
          }
        });
      }
    }, {
      key: "optimize",
      value: function optimize(blob, imageSrc) {
        var image;
        var ext = imageSrc.split('.').pop();

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
    }]);

    return BabsiImage;
  }();

  var BabsiHttp =
  /*#__PURE__*/
  function () {
    function BabsiHttp() {
      _classCallCheck(this, BabsiHttp);

      this.requests = [];
      this.activesRequests = [];
    }

    _createClass(BabsiHttp, [{
      key: "addRequest",
      value: function addRequest(url, callback) {
        // console.log('requesting, ', url);
        var that = this;
        var r = new XMLHttpRequest();
        r.open("GET", url, true);
        r.responseType = 'blob';

        r.onreadystatechange = function () {
          if (r.readyState != 4 || r.status != 200) return;
          callback(r.response);
          that.removeActive(url);
        };

        r.send();
        this.requests.push({
          url: url,
          r: r
        });
        this.activesRequests.push({
          url: url,
          r: r
        });
      }
    }, {
      key: "removeActive",
      value: function removeActive(url) {
        var _this = this;

        this.activesRequests.forEach(function (u, i) {
          if (u.url === url) {
            _this.activesRequests = _this.activesRequests.splice(i, 1);
          }
        });
      }
    }]);

    return BabsiHttp;
  }();

  var Module = typeof Module !== 'undefined' ? Module : {};
  var moduleOverrides = {};
  var key;

  for (key in Module) {
    if (Module.hasOwnProperty(key)) {
      moduleOverrides[key] = Module[key];
    }
  }

  var arguments_ = [];
  var thisProgram = './this.program';

  var ENVIRONMENT_IS_WEB = false;
  var ENVIRONMENT_IS_WORKER = false;
  var ENVIRONMENT_IS_NODE = false;
  var ENVIRONMENT_HAS_NODE = false;
  var ENVIRONMENT_IS_SHELL = false;
  ENVIRONMENT_IS_WEB = (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object';
  ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
  ENVIRONMENT_HAS_NODE = (typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && _typeof(process.versions) === 'object' && typeof process.versions.node === 'string';
  ENVIRONMENT_IS_NODE = ENVIRONMENT_HAS_NODE && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
  ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
  var scriptDirectory = '';

  function locateFile(path) {
    if (Module['locateFile']) {
      return Module['locateFile'](path, scriptDirectory);
    }

    return scriptDirectory + path;
  }

  var read_, readBinary;
  var nodeFS;
  var nodePath;

  if (ENVIRONMENT_IS_NODE) {
    scriptDirectory = __dirname + '/';

    read_ = function shell_read(filename, binary) {
      if (!nodeFS) nodeFS = require('fs');
      if (!nodePath) nodePath = require('path');
      filename = nodePath['normalize'](filename);
      return nodeFS['readFileSync'](filename, binary ? null : 'utf8');
    };

    readBinary = function readBinary(filename) {
      var ret = read_(filename, true);

      if (!ret.buffer) {
        ret = new Uint8Array(ret);
      }

      assert(ret.buffer);
      return ret;
    };

    if (process['argv'].length > 1) {
      thisProgram = process['argv'][1].replace(/\\/g, '/');
    }

    arguments_ = process['argv'].slice(2);

    if (typeof module !== 'undefined') {
      module['exports'] = Module;
    }

    process['on']('uncaughtException', function (ex) {
      if (!(ex instanceof ExitStatus)) {
        throw ex;
      }
    });
    process['on']('unhandledRejection', abort);

    Module['inspect'] = function () {
      return '[Emscripten Module object]';
    };
  } else if (ENVIRONMENT_IS_SHELL) {
    if (typeof read != 'undefined') {
      read_ = function shell_read(f) {
        return read(f);
      };
    }

    readBinary = function readBinary(f) {
      var data;

      if (typeof readbuffer === 'function') {
        return new Uint8Array(readbuffer(f));
      }

      data = read(f, 'binary');
      assert(_typeof(data) === 'object');
      return data;
    };

    if (typeof scriptArgs != 'undefined') {
      arguments_ = scriptArgs;
    } else if (typeof arguments != 'undefined') {
      arguments_ = arguments;
    }

    if (typeof print !== 'undefined') {
      if (typeof console === 'undefined') console = {};
      console.log = print;
      console.warn = console.error = typeof printErr !== 'undefined' ? printErr : print;
    }
  } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    if (ENVIRONMENT_IS_WORKER) {
      scriptDirectory = self.location.href;
    } else if (document.currentScript) {
      scriptDirectory = document.currentScript.src;
    }

    if (scriptDirectory.indexOf('blob:') !== 0) {
      scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf('/') + 1);
    } else {
      scriptDirectory = '';
    }

    {
      read_ = function shell_read(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send(null);
        return xhr.responseText;
      };

      if (ENVIRONMENT_IS_WORKER) {
        readBinary = function readBinary(url) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, false);
          xhr.responseType = 'arraybuffer';
          xhr.send(null);
          return new Uint8Array(xhr.response);
        };
      }
    }
  }

  var out = Module['print'] || console.log.bind(console);
  var err = Module['printErr'] || console.warn.bind(console);

  for (key in moduleOverrides) {
    if (moduleOverrides.hasOwnProperty(key)) {
      Module[key] = moduleOverrides[key];
    }
  }

  moduleOverrides = null;
  if (Module['arguments']) arguments_ = Module['arguments'];
  if (Module['thisProgram']) thisProgram = Module['thisProgram'];
  var wasmBinary;
  if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];

  if ((typeof WebAssembly === "undefined" ? "undefined" : _typeof(WebAssembly)) !== 'object') {
    err('no native wasm support detected');
  }

  var wasmMemory;
  var wasmTable = new WebAssembly.Table({
    initial: 157,
    maximum: 157 + 0,
    element: 'anyfunc'
  });
  var ABORT = false;

  function assert(condition, text) {
    if (!condition) {
      abort('Assertion failed: ' + text);
    }
  }

  function getCFunc(ident) {
    var func = Module['_' + ident];
    assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
    return func;
  }

  function ccall(ident, returnType, argTypes, args, opts) {
    var toC = {
      string: function string(str) {
        var ret = 0;

        if (str !== null && str !== undefined && str !== 0) {
          var len = (str.length << 2) + 1;
          ret = stackAlloc(len);
          stringToUTF8(str, ret, len);
        }

        return ret;
      },
      array: function array(arr) {
        var ret = stackAlloc(arr.length);
        writeArrayToMemory(arr, ret);
        return ret;
      }
    };

    function convertReturnValue(ret) {
      if (returnType === 'string') return UTF8ToString(ret);
      if (returnType === 'boolean') return Boolean(ret);
      return ret;
    }

    var func = getCFunc(ident);
    var cArgs = [];
    var stack = 0;

    if (args) {
      for (var i = 0; i < args.length; i++) {
        var converter = toC[argTypes[i]];

        if (converter) {
          if (stack === 0) stack = stackSave();
          cArgs[i] = converter(args[i]);
        } else {
          cArgs[i] = args[i];
        }
      }
    }

    var ret = func.apply(null, cArgs);
    ret = convertReturnValue(ret);
    if (stack !== 0) stackRestore(stack);
    return ret;
  }

  function cwrap(ident, returnType, argTypes, opts) {
    argTypes = argTypes || [];
    var numericArgs = argTypes.every(function (type) {
      return type === 'number';
    });
    var numericRet = returnType !== 'string';

    if (numericRet && numericArgs && !opts) {
      return getCFunc(ident);
    }

    return function () {
      return ccall(ident, returnType, argTypes, arguments);
    };
  }

  var UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;

  function UTF8ArrayToString(u8Array, idx, maxBytesToRead) {
    var endIdx = idx + maxBytesToRead;
    var endPtr = idx;

    while (u8Array[endPtr] && !(endPtr >= endIdx)) {
      ++endPtr;
    }

    if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
      return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
    } else {
      var str = '';

      while (idx < endPtr) {
        var u0 = u8Array[idx++];

        if (!(u0 & 128)) {
          str += String.fromCharCode(u0);
          continue;
        }

        var u1 = u8Array[idx++] & 63;

        if ((u0 & 224) == 192) {
          str += String.fromCharCode((u0 & 31) << 6 | u1);
          continue;
        }

        var u2 = u8Array[idx++] & 63;

        if ((u0 & 240) == 224) {
          u0 = (u0 & 15) << 12 | u1 << 6 | u2;
        } else {
          u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u8Array[idx++] & 63;
        }

        if (u0 < 65536) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 65536;
          str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
        }
      }
    }

    return str;
  }

  function UTF8ToString(ptr, maxBytesToRead) {
    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
  }

  function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0;
    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;

    for (var i = 0; i < str.length; ++i) {
      var u = str.charCodeAt(i);

      if (u >= 55296 && u <= 57343) {
        var u1 = str.charCodeAt(++i);
        u = 65536 + ((u & 1023) << 10) | u1 & 1023;
      }

      if (u <= 127) {
        if (outIdx >= endIdx) break;
        outU8Array[outIdx++] = u;
      } else if (u <= 2047) {
        if (outIdx + 1 >= endIdx) break;
        outU8Array[outIdx++] = 192 | u >> 6;
        outU8Array[outIdx++] = 128 | u & 63;
      } else if (u <= 65535) {
        if (outIdx + 2 >= endIdx) break;
        outU8Array[outIdx++] = 224 | u >> 12;
        outU8Array[outIdx++] = 128 | u >> 6 & 63;
        outU8Array[outIdx++] = 128 | u & 63;
      } else {
        if (outIdx + 3 >= endIdx) break;
        outU8Array[outIdx++] = 240 | u >> 18;
        outU8Array[outIdx++] = 128 | u >> 12 & 63;
        outU8Array[outIdx++] = 128 | u >> 6 & 63;
        outU8Array[outIdx++] = 128 | u & 63;
      }
    }

    outU8Array[outIdx] = 0;
    return outIdx - startIdx;
  }

  function stringToUTF8(str, outPtr, maxBytesToWrite) {
    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
  }

  var UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;

  function writeArrayToMemory(array, buffer) {
    HEAP8.set(array, buffer);
  }

  var WASM_PAGE_SIZE = 65536;

  function alignUp(x, multiple) {
    if (x % multiple > 0) {
      x += multiple - x % multiple;
    }

    return x;
  }

  var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

  function updateGlobalBufferAndViews(buf) {
    buffer = buf;
    Module['HEAP8'] = HEAP8 = new Int8Array(buf);
    Module['HEAP16'] = HEAP16 = new Int16Array(buf);
    Module['HEAP32'] = HEAP32 = new Int32Array(buf);
    Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
    Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
    Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
    Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
    Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
  }

  var DYNAMIC_BASE = 5259376,
      DYNAMICTOP_PTR = 16336;
  var INITIAL_TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;

  if (Module['wasmMemory']) {
    wasmMemory = Module['wasmMemory'];
  } else {
    wasmMemory = new WebAssembly.Memory({
      initial: INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE
    });
  }

  if (wasmMemory) {
    buffer = wasmMemory.buffer;
  }

  INITIAL_TOTAL_MEMORY = buffer.byteLength;
  updateGlobalBufferAndViews(buffer);
  HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;

  function callRuntimeCallbacks(callbacks) {
    while (callbacks.length > 0) {
      var callback = callbacks.shift();

      if (typeof callback == 'function') {
        callback();
        continue;
      }

      var func = callback.func;

      if (typeof func === 'number') {
        if (callback.arg === undefined) {
          Module['dynCall_v'](func);
        } else {
          Module['dynCall_vi'](func, callback.arg);
        }
      } else {
        func(callback.arg === undefined ? null : callback.arg);
      }
    }
  }

  var __ATPRERUN__ = [];
  var __ATINIT__ = [];
  var __ATMAIN__ = [];
  var __ATPOSTRUN__ = [];

  function preRun() {
    if (Module['preRun']) {
      if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];

      while (Module['preRun'].length) {
        addOnPreRun(Module['preRun'].shift());
      }
    }

    callRuntimeCallbacks(__ATPRERUN__);
  }

  function initRuntime() {
    callRuntimeCallbacks(__ATINIT__);
  }

  function preMain() {
    callRuntimeCallbacks(__ATMAIN__);
  }

  function postRun() {
    if (Module['postRun']) {
      if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];

      while (Module['postRun'].length) {
        addOnPostRun(Module['postRun'].shift());
      }
    }

    callRuntimeCallbacks(__ATPOSTRUN__);
  }

  function addOnPreRun(cb) {
    __ATPRERUN__.unshift(cb);
  }

  function addOnPostRun(cb) {
    __ATPOSTRUN__.unshift(cb);
  }

  var runDependencies = 0;
  var runDependencyWatcher = null;
  var dependenciesFulfilled = null;

  function addRunDependency(id) {
    runDependencies++;

    if (Module['monitorRunDependencies']) {
      Module['monitorRunDependencies'](runDependencies);
    }
  }

  function removeRunDependency(id) {
    runDependencies--;

    if (Module['monitorRunDependencies']) {
      Module['monitorRunDependencies'](runDependencies);
    }

    if (runDependencies == 0) {
      if (runDependencyWatcher !== null) {
        clearInterval(runDependencyWatcher);
        runDependencyWatcher = null;
      }

      if (dependenciesFulfilled) {
        var callback = dependenciesFulfilled;
        dependenciesFulfilled = null;
        callback();
      }
    }
  }

  Module['preloadedImages'] = {};
  Module['preloadedAudios'] = {};

  function abort(what) {
    if (Module['onAbort']) {
      Module['onAbort'](what);
    }

    what += '';
    out(what);
    err(what);
    ABORT = true;
    what = 'abort(' + what + '). Build with -s ASSERTIONS=1 for more info.';
    throw new WebAssembly.RuntimeError(what);
  }

  var dataURIPrefix = 'data:application/octet-stream;base64,';

  function isDataURI(filename) {
    return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0;
  }

  var wasmBinaryFile = 'a.out.wasm';

  if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile);
  }

  function getBinary() {
    try {
      if (wasmBinary) {
        return new Uint8Array(wasmBinary);
      }

      if (readBinary) {
        return readBinary(wasmBinaryFile);
      } else {
        throw 'both async and sync fetching of the wasm failed';
      }
    } catch (err) {
      abort(err);
    }
  }

  function getBinaryPromise() {
    if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === 'function') {
      return fetch(wasmBinaryFile, {
        credentials: 'same-origin'
      }).then(function (response) {
        if (!response['ok']) {
          throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
        }

        return response['arrayBuffer']();
      })["catch"](function () {
        return getBinary();
      });
    }

    return new Promise(function (resolve, reject) {
      resolve(getBinary());
    });
  }

  function createWasm() {
    var info = {
      env: asmLibraryArg,
      wasi_unstable: asmLibraryArg
    };

    function receiveInstance(instance, module) {
      var exports = instance.exports;
      Module['asm'] = exports;
      removeRunDependency();
    }

    addRunDependency();

    function receiveInstantiatedSource(output) {
      receiveInstance(output['instance']);
    }

    function instantiateArrayBuffer(receiver) {
      return getBinaryPromise().then(function (binary) {
        return WebAssembly.instantiate(binary, info);
      }).then(receiver, function (reason) {
        err('failed to asynchronously prepare wasm: ' + reason);
        abort(reason);
      });
    }

    function instantiateAsync() {
      if (!wasmBinary && typeof WebAssembly.instantiateStreaming === 'function' && !isDataURI(wasmBinaryFile) && typeof fetch === 'function') {
        fetch(wasmBinaryFile, {
          credentials: 'same-origin'
        }).then(function (response) {
          var result = WebAssembly.instantiateStreaming(response, info);
          return result.then(receiveInstantiatedSource, function (reason) {
            err('wasm streaming compile failed: ' + reason);
            err('falling back to ArrayBuffer instantiation');
            instantiateArrayBuffer(receiveInstantiatedSource);
          });
        });
      } else {
        return instantiateArrayBuffer(receiveInstantiatedSource);
      }
    }

    if (Module['instantiateWasm']) {
      try {
        var exports = Module['instantiateWasm'](info, receiveInstance);
        return exports;
      } catch (e) {
        err('Module.instantiateWasm callback failed with error: ' + e);
        return false;
      }
    }

    instantiateAsync();
    return {};
  }

  __ATINIT__.push({
    func: function func() {
      ___wasm_call_ctors();
    }
  });

  function ___assert_fail(condition, filename, line, func) {
    abort('Assertion failed: ' + UTF8ToString(condition) + ', at: ' + [filename ? UTF8ToString(filename) : 'unknown filename', line, func ? UTF8ToString(func) : 'unknown function']);
  }

  function _emscripten_get_heap_size() {
    return HEAP8.length;
  }

  function _emscripten_memcpy_big(dest, src, num) {
    HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
  }

  function emscripten_realloc_buffer(size) {
    try {
      wasmMemory.grow(size - buffer.byteLength + 65535 >> 16);
      updateGlobalBufferAndViews(wasmMemory.buffer);
      return 1;
    } catch (e) {}
  }

  function _emscripten_resize_heap(requestedSize) {
    var oldSize = _emscripten_get_heap_size();

    var PAGE_MULTIPLE = 65536;
    var LIMIT = 2147483648 - PAGE_MULTIPLE;

    if (requestedSize > LIMIT) {
      return false;
    }

    var MIN_TOTAL_MEMORY = 16777216;
    var newSize = Math.max(oldSize, MIN_TOTAL_MEMORY);

    while (newSize < requestedSize) {
      if (newSize <= 536870912) {
        newSize = alignUp(2 * newSize, PAGE_MULTIPLE);
      } else {
        newSize = Math.min(alignUp((3 * newSize + 2147483648) / 4, PAGE_MULTIPLE), LIMIT);
      }
    }

    var replacement = emscripten_realloc_buffer(newSize);

    if (!replacement) {
      return false;
    }

    return true;
  }

  var asmLibraryArg = {
    a: ___assert_fail,
    b: _emscripten_memcpy_big,
    c: _emscripten_resize_heap,
    memory: wasmMemory,
    table: wasmTable
  };
  var asm = createWasm();
  Module['asm'] = asm;

  var ___wasm_call_ctors = Module['___wasm_call_ctors'] = function () {
    return Module['asm']['d'].apply(null, arguments);
  };

  var _create_buffer = Module['_create_buffer'] = function () {
    return Module['asm']['e'].apply(null, arguments);
  };

  var _destroy_buffer = Module['_destroy_buffer'] = function () {
    return Module['asm']['f'].apply(null, arguments);
  };

  var _version = Module['_version'] = function () {
    return Module['asm']['g'].apply(null, arguments);
  };

  var _getInfo = Module['_getInfo'] = function () {
    return Module['asm']['h'].apply(null, arguments);
  };

  var _decode = Module['_decode'] = function () {
    return Module['asm']['i'].apply(null, arguments);
  };

  var _getResultsFirst = Module['_getResultsFirst'] = function () {
    return Module['asm']['j'].apply(null, arguments);
  };

  var _getResultsSecond = Module['_getResultsSecond'] = function () {
    return Module['asm']['k'].apply(null, arguments);
  };

  var _getResultsThird = Module['_getResultsThird'] = function () {
    return Module['asm']['l'].apply(null, arguments);
  };

  var stackSave = Module['stackSave'] = function () {
    return Module['asm']['m'].apply(null, arguments);
  };

  var stackAlloc = Module['stackAlloc'] = function () {
    return Module['asm']['n'].apply(null, arguments);
  };

  var stackRestore = Module['stackRestore'] = function () {
    return Module['asm']['o'].apply(null, arguments);
  };

  var dynCall_vi = Module['dynCall_vi'] = function () {
    return Module['asm']['p'].apply(null, arguments);
  };

  Module['asm'] = asm;
  Module['cwrap'] = cwrap;
  var calledRun;

  function ExitStatus(status) {
    this.name = 'ExitStatus';
    this.message = 'Program terminated with exit(' + status + ')';
    this.status = status;
  }

  dependenciesFulfilled = function runCaller() {
    if (!calledRun) run();
    if (!calledRun) dependenciesFulfilled = runCaller;
  };

  function run(args) {

    if (runDependencies > 0) {
      return;
    }

    preRun();
    if (runDependencies > 0) return;

    function doRun() {
      if (calledRun) return;
      calledRun = true;
      if (ABORT) return;
      initRuntime();
      preMain();
      if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();
      postRun();
    }

    if (Module['setStatus']) {
      Module['setStatus']('Running...');
      setTimeout(function () {
        setTimeout(function () {
          Module['setStatus']('');
        }, 1);
        doRun();
      }, 1);
    } else {
      doRun();
    }
  }

  Module['run'] = run;

  if (Module['preInit']) {
    if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];

    while (Module['preInit'].length > 0) {
      Module['preInit'].pop()();
    }
  }
  run();
  window.Module = Module;

  var Babsi =
  /*#__PURE__*/
  function () {
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
    function Babsi(config) {
      _classCallCheck(this, Babsi);

      config = _objectSpread2({}, config);
      this._name = config.name || 'Babsi';
      this._querySelector = config.querySelector || '.babsi';
      this._applyClass = config.applyClass || 'visible';
      this._shouldApplyClass = config.shouldApplyClass || true;
      this._window = config.windowObject || window;
      this._currentTracked = {};
      this.addHttp();
      this._webP = {
        module: window.Module,
        create_buffer: Module.cwrap('create_buffer', 'number', ['number', 'number']),
        destroy_buffer: Module.cwrap('destroy_buffer', '', ['number']),
        version: window.Module.cwrap('version', 'number', []),
        decode: window.Module.cwrap('decode', '', ['number', 'number', 'number', 'number'])
      }; // Babsi-image require Wasm import

      this.addWebPDecoder(); // Init Babsi only then async wasm import

      this.init();
    }

    _createClass(Babsi, [{
      key: "addWebPDecoder",
      value: function addWebPDecoder() {
        this.BABSIIMAGE = new BabsiImage(this._webP);
      }
    }, {
      key: "addHttp",
      value: function addHttp() {
        this.BABSIHTTP = new BabsiHttp();
      }
    }, {
      key: "checkCompatibility",
      value: function checkCompatibility() {
        var ww = this._window;

        if (typeof ww !== 'undefined') {
          var io = typeof window.IntersectionObserver === 'undefined';

          if (!ww || io) {
            return false;
          }

          return true;
        }

        return false;
      }
    }, {
      key: "init",
      value: function init() {
        var _this = this;

        this._observer = this.createObserver();
        var images = document.querySelectorAll(this._querySelector);
        images.forEach(function (img) {
          _this.prepare(img);
        });
      }
    }, {
      key: "returnRandomId",
      value: function returnRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      }
    }, {
      key: "prepare",
      value: function prepare(target) {
        var _this2 = this;

        var that = this;
        var randomId = this.returnRandomId();
        var canvas = document.createElement('canvas');
        target.style.display = 'none';
        canvas.id = randomId;
        canvas.setAttribute('data-babsi', randomId);
        target.setAttribute('data-babsi', randomId);
        target.insertAdjacentElement("afterend", canvas);
        this.BABSIHTTP.addRequest(target.dataset.src, function (image) {
          var buffer = _this2.BABSIIMAGE.optimize(image, target.dataset.src);

          var currentImage = document.createElement('img');
          currentImage.src = buffer;
          canvas.style.width = '100%';
          var ctx = canvas.getContext('2d');

          currentImage.onload = function () {
            var _width$height = {
              width: currentImage.naturalWidth,
              height: currentImage.naturalHeight
            },
                width = _width$height.width,
                height = _width$height.height;
            var canvasWidth = canvas.getBoundingClientRect().width;
            var ratioHeight = canvasWidth * height / width;
            ctx.clearRect(0, 0, canvasWidth, ratioHeight); // Fix change src future-proof

            canvas.width = canvasWidth;
            canvas.height = ratioHeight;

            that._observer.observe(canvas);

            _this2._currentTracked[randomId] = {
              canvas: canvas,
              ctx: ctx,
              currentImage: currentImage,
              width: canvasWidth,
              height: ratioHeight
            };
          };
        });
      }
    }, {
      key: "createObserver",
      value: function createObserver() {
        var that = this;
        return new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              that.handleCallback(entry.target);
            } else {
              that.removeClass(entry.target);
            }
          });
        }, {
          rootMargin: '0px 0px -100px 0px'
        });
      }
    }, {
      key: "handleCallback",
      value: function handleCallback(target) {
        var id = target.dataset.babsi;
        var obj = this._currentTracked[id];
        obj.ctx.drawImage(obj.currentImage, 0, 0, obj.width, obj.height);

        if (this._shouldApplyClass) {
          obj.canvas.classList.add(this._applyClass);
        }
      } // To optimize, too much calls without reason

    }, {
      key: "removeClass",
      value: function removeClass(target) {
        if (this._shouldApplyClass) {
          var id = target.dataset.babsi;
          var obj = this._currentTracked[id];
          obj.canvas.classList.remove(this._applyClass);
        }
      }
    }]);

    return Babsi;
  }();

  return Babsi;

})));
