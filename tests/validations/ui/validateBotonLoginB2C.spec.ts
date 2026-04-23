import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ScreenshotHelper } from '../../../fixtures/testHelpers';
import datos from '../../../data/data_new_client.json';

// Cargar los valores esperados
const uiExpectedValues = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../data/ui-expected-values.json'), 'utf-8')
);

test.describe('Validación de Botón Login - B2C @validation @ui @B2C', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar al login B2C
    const urlBase = process.env.BASE_URL || 'https://qa-url.com';
    await page.goto(`${urlBase}/comercio/sitio/inicio-sesion`);
  });

  test('VAL-UI-BTN-001: Validar estado deshabilitado con campos vacíos @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginB2C.loginButton;

    // Obtener el botón de login
    const loginButton = page.getByTestId(expectedData.testId);
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });

    // Verificar que el botón esté deshabilitado cuando ambos campos están vacíos
    await expect(loginButton).toBeDisabled();

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Botón Login - Estado Deshabilitado');
  });

  test('VAL-UI-BTN-002: Validar estado habilitado con campos llenos @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginB2C;

    // Llenar campo usuario
    const usuarioInput = page.getByTestId(expectedData.usuario.testId);
    await usuarioInput.waitFor({ state: 'visible', timeout: 10000 });
    await usuarioInput.fill('usuario123');

    // Llenar campo contraseña
    const passwordInput = page.getByTestId(expectedData.password.testId);
    await passwordInput.fill('Password123');

    // Verificar que el botón esté habilitado
    const loginButton = page.getByTestId(expectedData.loginButton.testId);
    await expect(loginButton).toBeEnabled();

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Botón Login - Estado Habilitado');
  });

  test('VAL-UI-BTN-003: Validar texto del botón @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginB2C.loginButton;

    // Obtener el botón de login
    const loginButton = page.getByTestId(expectedData.testId);
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });

    // Validar texto del botón
    const buttonText = await loginButton.textContent();
    expect(buttonText?.trim()).toBe(expectedData.text);

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Botón Login - Texto');
  });

  test('VAL-UI-BTN-004: Validar redirección exitosa al dashboard @P1', async ({ page }, testInfo) => {
    const expectedData = uiExpectedValues.loginB2C;

    // Llenar campo usuario con credenciales válidas
    const usuarioInput = page.getByTestId(expectedData.usuario.testId);
    await usuarioInput.waitFor({ state: 'visible', timeout: 10000 });
    await usuarioInput.fill(datos.Marcos.UsuarioB2C);

    // Llenar campo contraseña con credenciales válidas
    const passwordInput = page.getByTestId(expectedData.password.testId);
    await passwordInput.fill(datos.Marcos.PasswordB2C);

    // Click en botón de login
    const loginButton = page.getByTestId(expectedData.loginButton.testId);
    await loginButton.click();

    // Verificar redirección al dashboard
    await expect(page).toHaveURL(/.*\/comercio\/panel\/solicitudes/, { timeout: 15000 });

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Botón Login - Redirección Dashboard');
  });
});
