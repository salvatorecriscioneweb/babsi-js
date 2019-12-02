# babsi-js

> Babsi is a fast, lightweight and new concept lazy loading image, it aim to load images when entering in viewport. It use Webassembly to decode WebP* and relies on IntersectionObserver on top.

Babsi-js is a personal project for future, i need my own lazy loading library to use with my own future CMS. It can be used alone itself too.

## Is this already usable?
No, still WIP. On example there's some working but still missing main feature ( WebP decoder Wasm is present, but there's some low stack problem )

## Uh? Another lazy loading library using IntersectionObserver?
Yeah, but works in a unique way. It do not replace only data-src with src when viewport enter. It draw canvas to draw image got by XMLHttpRequest. Images should be provided only in WebP also on un-supported browser due the fact it embed decoder ( same used in Chrome ) itself. Fast thanks Webassembly.

## WebP polyfill?
Nope, this is not a slow polyfill, image will render as native image. Babsi use [webmproject/libwebp](https://github.com/webmproject/libwebp) native code. It's C based, so nothing like JS-based performance.

## No IntersectionObserver polyfill?
Currently no. Not needed but in my TODO.

## TODO
| Feature                 | Status                              |
| ----------------------- | ------------------------------------ |
| IntersectionObserver Polyfill | Missing |
| WebP Decoder | Partially Working* |
| Better default animation | WIP |
| Better handle of http queue | Missing |
|  |  |

*It is included and functions is correctly working, but need a layer wrapper (cwrap) between data structure blob -> buffer uInt8 -> array uInt8, if included ( just concat at begin of bundle webp.js in lib/ ) with webp.js its already wrapped and fully working, but require external bundle global vars and browser module so i'm trying workaround.

## Usage

```js
const BabsiJs = require('babsi-js');

const babsiJs = new BabsiJs();
// script
```

```html
<script src="build/index.js"></script>
<script>
var babsi = new Babsi({
  querySelector: 'img'
});
if (!babsi.checkCompatibility()) {
  console.log('[!] Babsi is not compatible');
}
</script>
```

### Options
| Name             | Default   | Description                           |
| ---------------- | --------- | ------------------------------------- |
| name             | 'Babsi'   | Useless at all, define name of plugin |
| querySelector    | '.babsi'  | Query selector of elements            |
| applyClass       | 'visible' | Apply Class on viewport in            |
| shouldApplyClass | true      | Should do apply_class logic?          |
| windowObject     | window    | window object                         |



## License

[MIT](LICENSE) © [Salvatore Criscione](https://www.salvatorecriscione.com)
