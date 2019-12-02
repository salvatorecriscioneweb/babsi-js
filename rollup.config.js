// rollup.config.js
import wasm from '@rollup/plugin-wasm';
import babel from 'rollup-plugin-babel';

let plugins = [
  babel({
    exclude: 'node_modules/**'
  }),
  wasm()
]
if (process.env.DEVELOPMENT) {
  plugins.push(browsersync({
    host: 'localhost',
    watch: true,
    port: 3000,
    notify: false,
    open: true,
    server: {
      baseDir: 'example'
    }
  }));
}


export default {
  input: 'lib/babsi.js',
  output: {
    file: 'build/index.js',
    format: 'cjs',
    external: ['./lib/webp.js']
  },
  plugins: plugins
}
