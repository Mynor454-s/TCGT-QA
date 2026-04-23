import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ScreenshotHelper } from '../../../fixtures/testHelpers';

// Cargar los valores esperados
const uiExpectedValues = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../data/ui-expected-values.json'), 'utf-8')
);

// Cargar los casos de validación de teléfono
const telefonoValidations = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../data/validations/telefono-validations.json'), 'utf-8')
);

test.describe('Validación de Teléfono - Datos Generales B2C @validation @ui @B2C @P1', () => {
  test.beforeEach(async ({ page }) => {
    const urlBase = process.env.BASE_URL || 'https://qa-url.com';
    await page.goto(`${urlBase}/comercio/sitio/inicio-sesion`);

    // Login
    const usuarioInput = page.getByTestId('login-page-business-card-form-user');
    await usuarioInput.waitFor({ state: 'visible', timeout: 10000 });
    await usuarioInput.fill('2933870952212');

    const passwordInput = page.getByTestId('login-page-business-card-form-password');
    await passwordInput.fill('21.Digital24.');

    const loginButton = page.getByTestId('login-page-business-form-btn-login');
    await loginButton.click();

    // Esperar dashboard
    await page.waitForTimeout(3000);

    // Click nueva solicitud
    const nuevaSolicitudBtn = page.getByTestId('panel-card-btn-new-request');
    await nuevaSolicitudBtn.waitFor({ state: 'visible', timeout: 10000 });
    await nuevaSolicitudBtn.click();
    await page.waitForTimeout(2000);

    // Ingresar DPI válido
    const dpiInput = page.getByTestId('new-request-form-dpi');
    await dpiInput.waitFor({ state: 'visible', timeout: 10000 });
    await dpiInput.fill('2764563941901');

    // Click continuar
    const submitBtn = page.getByTestId('new-request-form-submit');
    await submitBtn.waitFor({ state: 'visible', timeout: 10000 });
    await submitBtn.click();

    // Esperar formulario datos generales
    await page.waitForURL(/.*\/comercio\/panel\/formulario-precalificacion/, { timeout: 15000 });
  });

  test('VAL-UI-TEL-001: Validar label y placeholder del campo teléfono @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.datosGenerales.telefono;

    // Obtener el input de teléfono
    const telefonoInput = page.getByTestId(expectedData.testId);
    await telefonoInput.waitFor({ state: 'visible', timeout: 10000 });

    // Validar placeholder
    const placeholder = await telefonoInput.getAttribute('placeholder');
    expect(placeholder).toBe(expectedData.placeholder);

    // Validar label (buscar el label asociado al input)
    const inputId = await telefonoInput.getAttribute('id');
    if (inputId) {
      const label = page.locator(`label[for="${inputId}"]`);
      if (await label.count() > 0) {
        const labelText = await label.textContent();
        expect(labelText?.trim()).toBe(expectedData.label);
      }
    }

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Teléfono - Label y Placeholder');
  });

  test('VAL-UI-TEL-002: Validar campo requerido @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.datosGenerales.telefono;
    const emptyCase = telefonoValidations.telefonoCases.find((c: any) => c.testId === 'TEL-VAL-003');

    // Dejar el campo teléfono vacío y hacer click en continuar para disparar validación
    const submitBtn = page.getByTestId('general-information-form-submit');
    await submitBtn.waitFor({ state: 'visible', timeout: 10000 });
    await submitBtn.click();

    // Verificar mensaje de error de campo requerido
    const errorMessage = page.getByTestId(expectedData.errorTestId);
    await expect(errorMessage).toBeVisible({ timeout: 5000 });

    const errorText = await errorMessage.textContent();
    expect(errorText?.trim()).toBe(emptyCase.expectedError);

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Teléfono - Campo Requerido');
  });

  test('VAL-UI-TEL-003: Validar teléfono inválido con mensaje de error @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.datosGenerales.telefono;
    const invalidCase = telefonoValidations.telefonoCases.find((c: any) => c.testId === 'TEL-VAL-002');

    // Obtener el input de teléfono y llenar con teléfono inválido
    const telefonoInput = page.getByTestId(expectedData.testId);
    await telefonoInput.waitFor({ state: 'visible', timeout: 10000 });
    await telefonoInput.fill(invalidCase.input);

    // Hacer blur (click en otro campo) para disparar validación
    await page.locator('body').click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(1000);

    // Verificar mensaje de error de formato inválido
    const errorMessage = page.getByTestId(expectedData.invalidErrorTestId);
    await expect(errorMessage).toBeVisible({ timeout: 5000 });

    const errorText = await errorMessage.textContent();
    expect(errorText?.trim()).toBe(invalidCase.expectedError);

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Teléfono Inválido - Mensaje de Error');
  });
});
