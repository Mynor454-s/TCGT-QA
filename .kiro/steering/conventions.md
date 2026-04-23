# Coding Conventions

## Imports

- E2E tests MUST import `test` and `expect` from `fixtures/baseTest.ts`, never directly from `@playwright/test`.
- Exception: Validation tests that don't need custom fixtures may import from `@playwright/test` directly.
- Page objects import `Page` and `expect` from `@playwright/test`.

```typescript
// ✅ Correct for E2E tests
import { test, expect } from '../fixtures/baseTest';

// ❌ Wrong for E2E tests
import { test, expect } from '@playwright/test';
```

## Page Objects

- One class per application screen, in `pages/`.
- B2C pages go in `pages/B2C/`, TCJ in `pages/TCJ/`.
- Class names use PascalCase with `Page` suffix: `DatosGeneralesPage`, `SeleccionTcPage`.
- File names use camelCase with `.page.ts` suffix: `datosGenerales.page.ts`.
- Constructor receives `Page` (and `BrowserContext` if needed).
- Method names in Spanish, matching the user action: `llenarFormulario`, `clickContinuar`, `validarRedireccionFormulario`.
- Every new page object must be registered as a fixture in `fixtures/baseTest.ts`.

## Components

- Shared UI elements go in `components/` with `.component.ts` suffix.
- Class names use PascalCase with `Component` suffix: `FooterComponent`.

## Test Files

- File names use camelCase with `.spec.ts` suffix.
- E2E flows go in `tests/flows/happypath/` (and subdirectories per flow type).
- Validation tests go in `tests/validations/`.

## Test Structure

- Use `test.step('N. Descripción', ...)` for each logical step in E2E tests.
- Attach a screenshot at the end of each step: `ScreenshotHelper.takeAndAttach(page, testInfo, 'description')`.
- Include dataset name in screenshot labels for data-driven tests: `[${name}] Descripción`.

## Tags

Every test must include at minimum:
- A priority tag: `@P0`, `@P1`, `@P2`, or `@P3`
- A type tag: `@e2e`, `@validation`, or `@smoke`
- A flow tag when applicable: `@B2B`, `@B2C`
- A scenario ID for matrix-driven tests: `@E2E-001`, `@E2E-B2C-001`

```typescript
test('flujo completo @smoke @e2e @P0 @B2B', async ({ ... }) => { });
```

## Data-Driven Testing

- Never hardcode test data in spec files. Use JSON files in `data/`.
- For new data-driven tests, register the scenario in `data/test-matrix.json` and use `getTestDatasets('SCENARIO-ID')` from `utils/testMatrixRunner.ts`.
- Reference dataset keys by their actual names in the JSON file (e.g., `datos.Marcos`, not `datos.cliente1`).

## Waits

- Avoid `page.waitForTimeout()`. Use explicit waits instead:
  - `page.waitForURL()` for navigation
  - `page.waitForLoadState()` for page loads
  - `expect(locator).toBeVisible()` for element visibility
  - `locator.waitFor({ state: 'visible' })` for dynamic elements
- If a timeout is truly unavoidable, add a comment explaining why.

## Debugging

- Never commit `page.pause()`. It blocks CI execution.
- Use `page.pause()` only during local development and remove before committing.

## Type Safety

- Avoid `any` for test data. Use typed interfaces when possible.
- When accessing JSON data, ensure the keys match the actual file structure.
- Use `ClienteTestData` from `utils/testConfig.ts` when working with client test data.
- For data-driven tests, pass the type to `getTestDatasets<ClienteTestData>('SCENARIO-ID')` to get typed datasets.
- Use `OFERTA_URL` from `utils/testConfig.ts` instead of repeating the fallback inline.

## Environment & Config

- Environment-specific values come from `.env.*` files via `process.env`.
- Shared constants (like fallback URLs) should be defined once, not repeated across spec files.
- Never commit secrets or credentials. The `.env.*` files are gitignored; keep it that way.
