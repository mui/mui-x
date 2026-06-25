import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/stdio.ts'],
  format: ['cjs'],
  dts: true,
  sourcemap: false,
  minify: true,
  external: [],
  treeshake: true,
  watch: false,
  clean: false,
  target: false,
});
