import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/**/*.ts', '!src/**/*.test.ts'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  unbundle: true,
  dts: true,
  sourcemap: true,
  clean: true
});
