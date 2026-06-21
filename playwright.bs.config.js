// playwright.bs.config.js — Configuración simplificada para BrowserStack
// Usa este config con: npx browserstack-node-sdk playwright test --config=./playwright.bs.config.js

const dotenv = require('dotenv');
const path = require('path');

const environment = process.env.ENV || 'qa';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${environment}`) });

const config = {
  testDir: './tests',
  timeout: 120 * 10000,
  expect: {
    timeout: 30000,
  },
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://qa-tarjetadigital.incubadorabi.com',
    screenshot: 'on',
    video: 'on',
    trace: 'retain-on-failure',
    httpCredentials:
      process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASS
        ? {
            username: process.env.BASIC_AUTH_USER,
            password: process.env.BASIC_AUTH_PASS,
          }
        : undefined,
    ignoreHTTPSErrors: true,
    permissions: ['camera'],
  },
  projects: [
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        // User-Agent de Chrome real para evitar detección anti-bot
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        launchOptions: {
          args: ['--disable-blink-features=AutomationControlled'],
        },
      },
    },
  ],
};

module.exports = config;
