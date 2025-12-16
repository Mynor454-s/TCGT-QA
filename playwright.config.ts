// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 120 * 1000,
  expect: {
    timeout: 30_000,
  },
  retries: 0,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['list']
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://qa-tarjetadigital.incubadorabi.com',
    headless: false,
    screenshot: 'only-on-failure', // Screenshots manuales en cada test.step()
    video: 'off', // Deshabilitado por certificado SSL
    trace: 'retain-on-failure', // 'on' | 'off' | 'retain-on-failure' | 'on-first-retry'
    viewport: null,

    // ✅ Enviar HTTP Basic solo si hay credenciales válidas
    httpCredentials:
      process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASS
        ? {
          username: process.env.BASIC_AUTH_USER,
          password: process.env.BASIC_AUTH_PASS,
        }
        : undefined,

    // QA suele tener TLS internos
    ignoreHTTPSErrors: true,

  },

  projects: [
    {
      name: 'Google Chrome',
      use: {
        channel: 'chrome',
        viewport: null,
        launchOptions: {
          args: ['--start-maximized']
        },
      },
    },
  ],
});
