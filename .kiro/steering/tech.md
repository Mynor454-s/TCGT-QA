# Tech Stack

## Core

- **Language**: TypeScript (strict mode, ES2020 target)
- **Test Framework**: Playwright (`@playwright/test` ^1.55.0)
- **Runtime**: Node.js v18+, npm v9+
- **Module System**: CommonJS

## Dependencies

- `@playwright/test` — E2E test runner and assertions
- `dotenv` — Environment-specific config loading (`.env.qa`, `.env.stg`)
- `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` — S3 presigned URLs for onboarding video assets
- `browserstack-node-sdk` — Cross-browser/device testing via BrowserStack
- `ts-node` — TypeScript execution without precompilation

## npm Scripts

```bash
npm test                # Run all tests (npx playwright test)
npm run test:smoke      # Only @smoke tests
npm run test:regression # P0 + P1 tests
npm run test:chrome     # Chrome project only
npm run report          # Open HTML report
```

## Common Commands

```bash
# Install
npm install
npx playwright install

# Run against STG (bash)
ENV=stg npx playwright test

# Run against STG (PowerShell)
$env:ENV="stg"; npx playwright test

# Filter by tag
npx playwright test --grep "@smoke"
npx playwright test --grep "@P0|@P1"

# Specific test file
npx playwright test flujoCompletoCliente.spec.ts

# Interactive / debug
npx playwright test --ui
npx playwright test --debug

# BrowserStack
npx browserstack-node-sdk playwright test
```

## Playwright Configuration

- **Test directory**: `./tests`
- **Global timeout**: 1,200,000ms (20 min)
- **Expect timeout**: 30,000ms
- **Retries**: 0
- **Browser**: Chrome (channel mode, maximized window)
- **Screenshots**: Only on failure
- **Traces**: Retain on failure
- **Reporters**: HTML, JSON (`test-results/results.json`), JUnit (`test-results/results.xml`), list

## Environment Configuration

Environment is selected via `ENV` variable. Config files: `.env.qa` (default), `.env.stg`.

Key variables: `BASE_URL`, `BASIC_AUTH_USER`, `BASIC_AUTH_PASS`, `ONBOARDING_VIDEO_URL`, `OFFER_FORM_URL`, `AWS_*`, `BROWSERSTACK_*`.
