function ___assert_fail(condition, filename, line, func) {
  abort(
    'Assertion failed: ' +
      UTF8ToString(condition) +
      ', at: ' +
      [
        filename ? UTF8ToString(filename) : 'unknown filename',
        line,
        func ? UTF8ToString(func) : 'unknown function'
      ]
  );
}
function _emscripten_get_heap_size() {
  return HEAP8.length;
}
function _emscripten_get_sbrk_ptr() {
  return 16320;
}
function _emscripten_memcpy_big(dest, src, num) {
  HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
}
function emscripten_realloc_buffer(size) {
  try {
    wasmMemory.grow((size - buffer.byteLength + 65535) >> 16);
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
      newSize = Math.min(
        alignUp((3 * newSize + 2147483648) / 4, PAGE_MULTIPLE),
        LIMIT
      );
    }
  }
  var replacement = emscripten_realloc_buffer(newSize);
  if (!replacement) {
    return false;
  }
  return true;
}
function _setTempRet0($i) {
  setTempRet0($i | 0);
}

const imports = {
  env: {
    memory: new WebAssembly.Memory({ initial: 256 }),
    table: new WebAssembly.Table({
      initial: 157,
      maximum: 157,
      element: 'anyfunc'
    }),
    __assert_fail: ___assert_fail,
    emscripten_get_heap_size: _emscripten_get_heap_size,
    emscripten_get_sbrk_ptr: _emscripten_get_sbrk_ptr,
    emscripten_memcpy_big: _emscripten_memcpy_big,
    emscripten_realloc_buffer: emscripten_realloc_buffer,
    emscripten_resize_heap: _emscripten_resize_heap,
    setTempRet0: _setTempRet0
  }
};
export {
  ___assert_fail,
  _emscripten_get_heap_size,
  _emscripten_get_sbrk_ptr,
  _emscripten_memcpy_big,
  emscripten_realloc_buffer,
  _emscripten_resize_heap,
  _setTempRet0
};

export default imports;