// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Determinar qué archivo .env cargar según la variable ENV
const environment = process.env.ENV || 'qa';
const envFile = `.env.${environment}`;

console.log(`🔧 Cargando configuración desde: ${envFile}`);
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

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
    screenshot: 'only-on-failure',
    video: 'off',
    // BrowserStack iOS no soporta tracing
    trace: process.env.BROWSERSTACK_USERNAME ? 'off' : 'retain-on-failure',
    viewport: null,

    httpCredentials:
      process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASS
        ? {
            username: process.env.BASIC_AUTH_USER,
            password: process.env.BASIC_AUTH_PASS,
          }
        : undefined,

    // BrowserStack mobile requiere ignoreHTTPSErrors: false
    ignoreHTTPSErrors: process.env.BROWSERSTACK_USERNAME ? false : true,
  },

  projects: [
    {
      name: 'Chrome',
      use: {
        channel: 'chrome',
        viewport: null,
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
  ],
});
