/// <reference types="vitest" />
import { defineConfig } from 'vite'

if (!process.env.MONGO_DATA_API_KEY) {
  const dotenv = await import('dotenv');
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
}

export default defineConfig({
  test: {
    testTimeout: 60000, // 60 seconds
    globals: true,
    globalSetup: [
      './src/__tests__/globalSetup',
    ],
  },
});