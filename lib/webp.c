#include <stdlib.h>
#include "emscripten.h"
#include "../libwebp/src/webp/decode.h"

int results[3];

EMSCRIPTEN_KEEPALIVE
uint8_t* create_buffer(int width, int height) {
  return malloc(width * height * 4 * sizeof(uint8_t));
}

EMSCRIPTEN_KEEPALIVE
void destroy_buffer(uint8_t* p) {
  free(p);
}

EMSCRIPTEN_KEEPALIVE
int version() {
  return WebPGetDecoderVersion();
}

EMSCRIPTEN_KEEPALIVE
int getInfo(const uint8_t* data, size_t size) {
  int* results = (int*) malloc(3 * sizeof(int));

  int width;
  int height;

  // (const uint8_t* data, size_t size, int* w, int* h) -> int;
  WebPGetInfo(data, size, &width, &height);

  results[1] = width;
  results[2] = height;
}

EMSCRIPTEN_KEEPALIVE
uint8_t* decode(const uint8_t* data, size_t size) {
  int width;
  int height;

  results[0] = WebPDecodeRGBA(data, size, &width, &height);
  results[1] = width;
  results[2] = height;
}

EMSCRIPTEN_KEEPALIVE
int getResultsFirst() {
  return results[0];
}

EMSCRIPTEN_KEEPALIVE
int getResultsSecond() {
  return results[1];
}

EMSCRIPTEN_KEEPALIVE
int getResultsThird() {
  return results[2];
}
