import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ScreenshotHelper } from '../../../fixtures/testHelpers';

// Cargar los valores esperados
const uiExpectedValues = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../data/ui-expected-values.json'), 'utf-8')
);

test.describe('Validación de Labels y Placeholders - Login B2C @validation @ui @B2C', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar al login B2C
    const urlBase = process.env.BASE_URL || 'https://qa-url.com';
    await page.goto(`${urlBase}/comercio/sitio/inicio-sesion`);
  });

  test('VAL-UI-B2C-001: Validar label y placeholder del campo Usuario @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginB2C.usuario;
    
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
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Usuario - Label y Placeholder');
  });

  test('VAL-UI-B2C-002: Validar label y placeholder del campo Contraseña @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginB2C.password;
    
    // Obtener el input
    const input = page.getByTestId(expectedData.testId);
    await input.waitFor({ state: 'visible', timeout: 10000 });

    // Validar placeholder
    const placeholder = await input.getAttribute('placeholder');
    expect(placeholder).toBe(expectedData.placeholder);

    // Validar label
    const inputId = await input.getAttribute('id');
    if (inputId) {
      const label = page.locator(`label[for="${inputId}"]`);
      const labelText = await label.textContent();
      expect(labelText?.trim()).toBe(expectedData.label);
    }

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Contraseña - Label y Placeholder');
  });

  test('VAL-UI-B2C-003: Validar texto del botón de Login @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginB2C.loginButton;
    
    // Obtener el botón
    const button = page.getByTestId(expectedData.testId);
    await button.waitFor({ state: 'visible', timeout: 10000 });

    // Validar texto del botón
    const buttonText = await button.textContent();
    expect(buttonText?.trim()).toBe(expectedData.text);

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Botón de Login');
  });

  test('VAL-UI-B2C-004: Validar mensaje de error - Usuario requerido @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginB2C.usuario;
    
    // Intentar hacer login sin llenar el campo usuario
    const passwordInput = page.getByTestId(uiExpectedValues.loginB2C.password.testId);
    await passwordInput.fill('Password123');
    
    const loginButton = page.getByTestId(uiExpectedValues.loginB2C.loginButton.testId);
    await loginButton.click();

    // Esperar y validar mensaje de error usando el errorTestId específico
    const errorMessage = page.getByTestId(expectedData.errorTestId);
    await errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    
    const errorText = await errorMessage.textContent();
    expect(errorText?.trim()).toBe(expectedData.errorMessages.required);

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Error - Usuario Requerido');
  });

  test('VAL-UI-B2C-005: Validar mensaje de error - Contraseña requerida @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginB2C.password;
    
    // Intentar hacer login sin llenar el campo contraseña
    const usuarioInput = page.getByTestId(uiExpectedValues.loginB2C.usuario.testId);
    await usuarioInput.fill('usuario123');
    
    const loginButton = page.getByTestId(uiExpectedValues.loginB2C.loginButton.testId);
    await loginButton.click();

    // Esperar y validar mensaje de error usando el errorTestId específico
    const errorMessage = page.getByTestId(expectedData.errorTestId);
    await errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    
    const errorText = await errorMessage.textContent();
    expect(errorText?.trim()).toBe(expectedData.errorMessages.required);

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Error - Contraseña Requerida');
  });

  test('VAL-UI-B2C-006: Validar mensaje de error - Usuario formato inválido @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginB2C.usuario;
    
    // Ingresar un formato inválido en el campo usuario
    const usuarioInput = page.getByTestId(expectedData.testId);
    await usuarioInput.fill('abc');
    
    // Hacer click fuera del campo para disparar la validación (blur)
    const passwordInput = page.getByTestId(uiExpectedValues.loginB2C.password.testId);
    await passwordInput.click();

    // Esperar y validar mensaje de error de formato inválido
    const errorMessage = page.getByTestId(expectedData.invalidErrorTestId);
    await errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    
    const errorText = await errorMessage.textContent();
    expect(errorText?.trim()).toBe(expectedData.errorMessages.invalid);

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Error - Usuario Formato Inválido');
  });
  test('VAL-UI-B2C-007: Validar mensaje de error - Usuario maximo 30 caracteres @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginB2C.usuario;
    
    // Ingresar un formato inválido en el campo usuario
    const usuarioInput = page.getByTestId(expectedData.testId);
    await usuarioInput.fill('eestrada@bi.com.gtaaaaaaaaaaaaa'); // 31 caracteres

    // Hacer click fuera del campo para disparar la validación (blur)
    const passwordInput = page.getByTestId(uiExpectedValues.loginB2C.password.testId);
    await passwordInput.click();
    
    // Esperar y validar mensaje de error de formato inválido
    const errorMessage = page.getByTestId(expectedData.invalidErrorTestId);
    await errorMessage.waitFor({ state: 'visible', timeout: 5000 });
  
    const errorText = await errorMessage.textContent();
    expect(errorText?.trim()).toBe(expectedData.errorMessages.maxLength);

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Error - Usuario Máximo 30 Caracteres');
  });
});