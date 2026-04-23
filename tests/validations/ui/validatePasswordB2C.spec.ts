import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ScreenshotHelper } from '../../../fixtures/testHelpers';

// Cargar los valores esperados
const uiExpectedValues = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../data/ui-expected-values.json'), 'utf-8')
);

test.describe('Validación de Contraseña - Login B2C @validation @ui @B2C', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar al login B2C
    const urlBase = process.env.BASE_URL || 'https://qa-url.com';
    await page.goto(`${urlBase}/comercio/sitio/inicio-sesion`);
  });

  test('VAL-UI-PWD-001: Validar label y placeholder del campo contraseña @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginB2C.password;

    // Obtener el input
    const input = page.getByTestId(expectedData.testId);
    await input.waitFor({ state: 'visible', timeout: 10000 });

    // Validar placeholder
    const placeholder = await input.getAttribute('placeholder');
    expect(placeholder).toBe(expectedData.placeholder);

    // Validar label (buscar el label asociado al input)
    const inputId = await input.getAttribute('id');
    if (inputId) {
      const label = page.locator(`label[for="${inputId}"]`);
      const labelText = await label.textContent();
      expect(labelText?.trim()).toBe(expectedData.label);
    }

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Contraseña - Label y Placeholder');
  });

  test('VAL-UI-PWD-002: Validar aceptación de texto alfanumérico @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginB2C.password;

    // Obtener el input
    const input = page.getByTestId(expectedData.testId);
    await input.waitFor({ state: 'visible', timeout: 10000 });

    // Ingresar texto alfanumérico en el campo contraseña
    await input.fill('Password123');

    // Verificar que el campo acepta la entrada sin error
    const inputValue = await input.inputValue();
    expect(inputValue).toBe('Password123');

    // Verificar que NO aparezca mensaje de error de campo requerido
    const errorRequired = page.getByTestId(expectedData.errorTestId);
    await expect(errorRequired).not.toBeVisible();

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Contraseña - Aceptación Alfanumérica');
  });

  test('VAL-UI-PWD-003: Validar truncamiento o error a 60 caracteres @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginB2C.password;

    // Obtener el input
    const input = page.getByTestId(expectedData.testId);
    await input.waitFor({ state: 'visible', timeout: 10000 });

    // Generar una cadena de 65 caracteres
    const longPassword = 'A'.repeat(65);
    await input.fill(longPassword);

    // Verificar que el valor del campo se trunca a 60 caracteres o menos
    const inputValue = await input.inputValue();
    expect(inputValue.length).toBeLessThanOrEqual(60);

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Contraseña - Truncamiento 60 Caracteres');
  });
});
