import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ScreenshotHelper } from '../../../fixtures/testHelpers';

// Cargar los valores esperados
const uiExpectedValues = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../data/ui-expected-values.json'), 'utf-8')
);

test.describe('Validación de Labels y Placeholders - DPI B2C @validation @ui @B2C @dpi', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar al login B2C
    const urlBase = process.env.BASE_URL || 'https://qa-url.com';
    await page.goto(`${urlBase}/comercio/sitio/inicio-sesion`);
    
    // Hacer login para llegar a la pantalla de nueva solicitud
    const usuarioInput = page.getByTestId('login-page-business-card-form-user');
    await usuarioInput.waitFor({ state: 'visible', timeout: 10000 });
    await usuarioInput.fill('2933870952212'); // Usuario B2C de prueba
    
    const passwordInput = page.getByTestId('login-page-business-card-form-password');
    await passwordInput.fill('21.Digital24.'); // Password de prueba
    
    const loginButton = page.getByTestId('login-page-business-form-btn-login');
    await loginButton.click();
    
    // Esperar a que cargue el dashboard y hacer clic en nueva solicitud
    await page.waitForTimeout(3000);
    
    // Navegar a nueva solicitud usando testId del ui-expected-values
    const nuevaSolicitudBtn = page.getByTestId(uiExpectedValues.NewApplicationB2C.startButton.testId);
    await nuevaSolicitudBtn.waitFor({ state: 'visible', timeout: 10000 });
    await nuevaSolicitudBtn.click();
    await page.waitForTimeout(2000);
  });

  test('VAL-UI-DPI-001: Validar label y placeholder del campo DPI @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.dpi.dpiInput;
    
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
      if (await label.count() > 0) {
        const labelText = await label.textContent();
        expect(labelText?.trim()).toBe(expectedData.label);
      }
    }

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'DPI - Label y Placeholder');
  });

  test('VAL-UI-DPI-002: Validar mensaje de error - DPI requerido @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.dpi.dpiInput;
    
    // Buscar botón continuar/siguiente
    const continueButton = page.locator('button').filter({ hasText: /continuar|siguiente/i }).first();
    await continueButton.waitFor({ state: 'visible', timeout: 10000 });
    await continueButton.click();

    // Esperar y validar mensaje de error usando el errorTestId específico
    const errorMessage = page.getByTestId(expectedData.errorTestId);
    await errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    
    const errorText = await errorMessage.textContent();
    expect(errorText?.trim()).toBe(expectedData.errorMessages.required.trim());

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Error - DPI Requerido');
  });

  test('VAL-UI-DPI-003: Validar mensaje de error - DPI formato inválido @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.dpi.dpiInput;
    
    // Ingresar un DPI con formato inválido
    const dpiInput = page.getByTestId(expectedData.testId);
    await dpiInput.waitFor({ state: 'visible', timeout: 10000 });
    await dpiInput.fill('123'); // DPI inválido (muy corto)
    
    // Buscar botón continuar/siguiente
    const continueButton = page.locator('button').filter({ hasText: /continuar|siguiente/i }).first();
    await continueButton.click();

    // Esperar y validar mensaje de error de formato inválido
    const errorMessage = page.getByTestId(expectedData.invalidErrorTestId);
    await errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    
    const errorText = await errorMessage.textContent();
    expect(errorText?.trim()).toBe(expectedData.errorMessages.invalid.trim());

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Error - DPI Formato Inválido');
  });

  test('VAL-UI-DPI-004: Validar que se permitan DPIs válidos @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.dpi.dpiInput;
    
    // Ingresar un DPI válido (13 dígitos)
    const dpiInput = page.getByTestId(expectedData.testId);
    await dpiInput.waitFor({ state: 'visible', timeout: 10000 });
    await dpiInput.fill('2933870952212'); // DPI válido de 13 dígitos
    
    // Verificar que NO aparezcan mensajes de error
    const errorMessageRequired = page.getByTestId(expectedData.errorTestId);
    const errorMessageInvalid = page.getByTestId(expectedData.invalidErrorTestId);
    
    await expect(errorMessageRequired).not.toBeVisible();
    await expect(errorMessageInvalid).not.toBeVisible();

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'DPI Válido - Sin Errores');
  });

  test('VAL-UI-DPI-005: Validar que el input del DPI permita números @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.dpi.dpiInput;
    
    // Ingresar números en el campo DPI
    const dpiInput = page.getByTestId(expectedData.testId);
    await dpiInput.waitFor({ state: 'visible', timeout: 10000 });
    await dpiInput.fill('1234567890123');
    
    // Verificar que el valor se haya ingresado correctamente
    const inputValue = await dpiInput.inputValue();
    expect(inputValue).toContain('123');

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'DPI - Permite Números');
  });

  test('VAL-UI-DPI-006: Validar que el input del DPI no permita letras @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.dpi.dpiInput;
    
    // Intentar ingresar letras en el campo DPI
    const dpiInput = page.getByTestId(expectedData.testId);
    await dpiInput.waitFor({ state: 'visible', timeout: 10000 });
    await dpiInput.fill('ABCDEFGHIJKLM');
    
    // Verificar que el campo esté vacío o no contenga letras
    const inputValue = await dpiInput.inputValue();
    expect(inputValue).not.toMatch(/[A-Za-z]/);

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'DPI - No Permite Letras');
  });

  test('VAL-UI-DPI-007: Validar que el input del DPI no permita caracteres especiales @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.dpi.dpiInput;
    
    // Intentar ingresar caracteres especiales en el campo DPI
    const dpiInput = page.getByTestId(expectedData.testId);
    await dpiInput.waitFor({ state: 'visible', timeout: 10000 });
    await dpiInput.fill('!@#$%^&*()_+-=');
    
    // Verificar que el campo esté vacío o no contenga caracteres especiales
    const inputValue = await dpiInput.inputValue();
    expect(inputValue).not.toMatch(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/);

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'DPI - No Permite Caracteres Especiales');
  });

  test('VAL-UI-DPI-008: Validar mensaje de error onBlur - DPI sin llenar @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.dpi.dpiInput;
    
    // Hacer clic en el input DPI (focus)
    const dpiInput = page.getByTestId(expectedData.testId);
    await dpiInput.waitFor({ state: 'visible', timeout: 10000 });
    await dpiInput.click();
    
    // Hacer clic fuera del input (blur) sin llenarlo
    await page.locator('body').click({ position: { x: 10, y: 10 } });
    
    // Esperar un momento para que se dispare la validación onBlur
    await page.waitForTimeout(1000);
    
    // Verificar que aparezca el mensaje de error de campo requerido
    const errorMessage = page.getByTestId(expectedData.errorTestId);
    await expect(errorMessage).toBeVisible({ timeout: 5000 });

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Error - DPI Requerido onBlur');
  });
});
