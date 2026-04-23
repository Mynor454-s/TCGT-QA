import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ScreenshotHelper } from '../../../fixtures/testHelpers';
import { HomePageBusiness } from '../../../pages/B2C/home.page';

// Cargar los valores esperados
const uiExpectedValues = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../data/ui-expected-values.json'), 'utf-8')
);

// Cargar datos de validación de login
const loginValidations = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../data/validations/login-validations.json'), 'utf-8')
);

test.describe('Validación de Login Actualizado (Parte 2) - Email o CUI @validation @ui @B2C', () => {
  test.beforeEach(async ({ page }) => {
    const urlBase = process.env.BASE_URL || 'https://qa-url.com';
    await page.goto(`${urlBase}/comercio/sitio/inicio-sesion`);
  });

  test('VAL-UI-LOGIN2-001: Validar aceptación alfanumérica @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginActualizado.inputLogin;

    const input = page.getByTestId(expectedData.testId);
    await input.waitFor({ state: 'visible', timeout: 10000 });

    // Ingresar texto alfanumérico
    await input.fill('usuario123');

    // Verificar que el campo acepta la entrada
    const inputValue = await input.inputValue();
    expect(inputValue).toBe('usuario123');

    // Verificar que NO aparezcan mensajes de error
    const errorRequired = page.getByTestId(expectedData.errorTestId);
    const errorInvalid = page.getByTestId(expectedData.invalidErrorTestId);
    await expect(errorRequired).not.toBeVisible();
    await expect(errorInvalid).not.toBeVisible();

    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Login Actualizado - Aceptación Alfanumérica');
  });

  test('VAL-UI-LOGIN2-002: Validar truncamiento a 60 caracteres @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginActualizado.inputLogin;

    const input = page.getByTestId(expectedData.testId);
    await input.waitFor({ state: 'visible', timeout: 10000 });

    // Generar una cadena de 65 caracteres
    const longInput = 'A'.repeat(65);
    await input.fill(longInput);

    // Verificar que el valor del campo se trunca a 60 caracteres o menos
    const inputValue = await input.inputValue();
    expect(inputValue.length).toBeLessThanOrEqual(expectedData.maxLength);

    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Login Actualizado - Truncamiento 60 Caracteres');
  });

  test('VAL-UI-LOGIN2-003: Validar aceptación de email como entrada @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginActualizado.inputLogin;

    const input = page.getByTestId(expectedData.testId);
    await input.waitFor({ state: 'visible', timeout: 10000 });

    // Ingresar un email válido
    await input.fill('test@bi.com.gt');

    // Verificar que el campo acepta la entrada
    const inputValue = await input.inputValue();
    expect(inputValue).toBe('test@bi.com.gt');

    // Verificar que NO aparezcan mensajes de error
    const errorRequired = page.getByTestId(expectedData.errorTestId);
    const errorInvalid = page.getByTestId(expectedData.invalidErrorTestId);
    await expect(errorRequired).not.toBeVisible();
    await expect(errorInvalid).not.toBeVisible();

    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Login Actualizado - Aceptación Email');
  });

  test('VAL-UI-LOGIN2-004: Validar aceptación de CUI como entrada @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginActualizado.inputLogin;

    const input = page.getByTestId(expectedData.testId);
    await input.waitFor({ state: 'visible', timeout: 10000 });

    // Ingresar un CUI (identificador numérico)
    await input.fill('2933870952212');

    // Verificar que el campo acepta la entrada
    const inputValue = await input.inputValue();
    expect(inputValue).toBe('2933870952212');

    // Verificar que NO aparezcan mensajes de error
    const errorRequired = page.getByTestId(expectedData.errorTestId);
    const errorInvalid = page.getByTestId(expectedData.invalidErrorTestId);
    await expect(errorRequired).not.toBeVisible();
    await expect(errorInvalid).not.toBeVisible();

    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Login Actualizado - Aceptación CUI');
  });

  test('VAL-UI-LOGIN2-005: Validar estados visuales (CSS) @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginActualizado.inputLogin;
    const homePage = new HomePageBusiness(page);

    const input = page.getByTestId(expectedData.testId);
    await input.waitFor({ state: 'visible', timeout: 10000 });

    // Estado vacío (sin interacción)
    const estadoVacio = await homePage.obtenerEstadoVisualCampo(expectedData.testId);
    expect(estadoVacio.filled).toBe(false);

    // Estado enfocado (click en el input)
    await input.click();
    const estadoFocused = await homePage.obtenerEstadoVisualCampo(expectedData.testId);
    expect(estadoFocused.focused).toBe(true);

    // Estado lleno (ingresar valor)
    await input.fill('usuario123');
    const estadoFilled = await homePage.obtenerEstadoVisualCampo(expectedData.testId);
    expect(estadoFilled.filled).toBe(true);

    // Estado error (limpiar campo y disparar validación)
    await input.fill('');
    const loginButton = page.getByTestId(uiExpectedValues.loginB2C.loginButton.testId);
    await loginButton.click();
    const estadoError = await homePage.obtenerEstadoVisualCampo(expectedData.testId);
    expect(estadoError.error).toBe(true);

    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Login Actualizado - Estados Visuales CSS');
  });

  test('VAL-UI-LOGIN2-006: Validar label y placeholder actualizados @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginActualizado.inputLogin;

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

    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Login Actualizado - Label y Placeholder');
  });

  test('VAL-UI-LOGIN2-007: Validar aceptación de caracteres alfabéticos @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginActualizado.inputLogin;

    const input = page.getByTestId(expectedData.testId);
    await input.waitFor({ state: 'visible', timeout: 10000 });

    // Ingresar solo caracteres alfabéticos
    await input.fill('abcdef');

    // Verificar que el campo acepta la entrada
    const inputValue = await input.inputValue();
    expect(inputValue).toBe('abcdef');

    // Verificar que NO aparezcan mensajes de error
    const errorRequired = page.getByTestId(expectedData.errorTestId);
    const errorInvalid = page.getByTestId(expectedData.invalidErrorTestId);
    await expect(errorRequired).not.toBeVisible();
    await expect(errorInvalid).not.toBeVisible();

    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Login Actualizado - Caracteres Alfabéticos');
  });

  test('VAL-UI-LOGIN2-008: Validar aceptación de caracteres numéricos @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginActualizado.inputLogin;

    const input = page.getByTestId(expectedData.testId);
    await input.waitFor({ state: 'visible', timeout: 10000 });

    // Ingresar solo caracteres numéricos
    await input.fill('123456');

    // Verificar que el campo acepta la entrada
    const inputValue = await input.inputValue();
    expect(inputValue).toBe('123456');

    // Verificar que NO aparezcan mensajes de error
    const errorRequired = page.getByTestId(expectedData.errorTestId);
    const errorInvalid = page.getByTestId(expectedData.invalidErrorTestId);
    await expect(errorRequired).not.toBeVisible();
    await expect(errorInvalid).not.toBeVisible();

    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Login Actualizado - Caracteres Numéricos');
  });

  test('VAL-UI-LOGIN2-009: Validar aceptación de un solo dígito @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginActualizado.inputLogin;

    const input = page.getByTestId(expectedData.testId);
    await input.waitFor({ state: 'visible', timeout: 10000 });

    // Ingresar un solo dígito
    await input.fill('5');

    // Verificar que el campo acepta la entrada
    const inputValue = await input.inputValue();
    expect(inputValue).toBe('5');

    // Verificar que NO aparezcan mensajes de error
    const errorRequired = page.getByTestId(expectedData.errorTestId);
    const errorInvalid = page.getByTestId(expectedData.invalidErrorTestId);
    await expect(errorRequired).not.toBeVisible();
    await expect(errorInvalid).not.toBeVisible();

    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Login Actualizado - Un Solo Dígito');
  });

  test('VAL-UI-LOGIN2-010: Validar aceptación de más de 6 dígitos @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginActualizado.inputLogin;

    const input = page.getByTestId(expectedData.testId);
    await input.waitFor({ state: 'visible', timeout: 10000 });

    // Ingresar más de 6 dígitos numéricos
    await input.fill('1234567890');

    // Verificar que el campo acepta la entrada sin restricción de longitud mínima
    const inputValue = await input.inputValue();
    expect(inputValue).toBe('1234567890');

    // Verificar que NO aparezcan mensajes de error
    const errorRequired = page.getByTestId(expectedData.errorTestId);
    const errorInvalid = page.getByTestId(expectedData.invalidErrorTestId);
    await expect(errorRequired).not.toBeVisible();
    await expect(errorInvalid).not.toBeVisible();

    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Login Actualizado - Más de 6 Dígitos');
  });

  test('VAL-UI-LOGIN2-011: Validar error de campo requerido @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginActualizado.inputLogin;

    const input = page.getByTestId(expectedData.testId);
    await input.waitFor({ state: 'visible', timeout: 10000 });

    // Dejar el campo vacío y hacer click en el botón de login para disparar validación
    const loginButton = page.getByTestId(uiExpectedValues.loginB2C.loginButton.testId);
    await loginButton.click();

    // Esperar y validar mensaje de error de campo requerido
    const errorMessage = page.getByTestId(expectedData.errorTestId);
    await errorMessage.waitFor({ state: 'visible', timeout: 5000 });

    const errorText = await errorMessage.textContent();
    expect(errorText?.trim()).toBe(expectedData.errorMessages.required);

    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Login Actualizado - Error Campo Requerido');
  });
});
