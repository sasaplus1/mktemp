/* eslint-disable node/no-unsupported-features/es-syntax */
// eslint-disable-next-line node/no-missing-import
import { /*coverageConfigDefaults,*/ defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['html', 'json']
    }
  }
});
