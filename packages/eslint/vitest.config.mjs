import { defineConfig } from 'vitest/config';

const config = defineConfig({
  test: {
    setupFiles: ['./test/setup.js'],
  },
});

export default config;
