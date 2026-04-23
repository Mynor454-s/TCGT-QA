import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ScreenshotHelper } from '../../../fixtures/testHelpers';

// Cargar los valores esperados
const uiExpectedValues = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../data/ui-expected-values.json'), 'utf-8')
);

test.describe('Validación de Modal Instructivo - Instrucción Onboarding B2C @validation @modal @B2C @P1', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Navegar al login B2C
    const urlBase = process.env.BASE_URL || 'https://qa-url.com';
    await page.goto(`${urlBase}/comercio/sitio/inicio-sesion`);

    // 2. Login
    const usuarioInput = page.getByTestId('login-page-business-card-form-user');
    await usuarioInput.waitFor({ state: 'visible', timeout: 10000 });
    await usuarioInput.fill('2933870952212');

    const passwordInput = page.getByTestId('login-page-business-card-form-password');
    await passwordInput.fill('21.Digital24.');

    const loginButton = page.getByTestId('login-page-business-form-btn-login');
    await loginButton.click();

    // 3. Esperar dashboard
    await page.waitForTimeout(3000);

    // 4. Click nueva solicitud
    const nuevaSolicitudBtn = page.getByTestId('panel-card-btn-new-request');
    await nuevaSolicitudBtn.waitFor({ state: 'visible', timeout: 10000 });
    await nuevaSolicitudBtn.click();
    await page.waitForTimeout(2000);

    // 5. Ingresar DPI válido
    const dpiInput = page.getByTestId('new-request-form-dpi');
    await dpiInput.waitFor({ state: 'visible', timeout: 10000 });
    await dpiInput.fill('2764563941901');

    // 6. Click continuar en DPI
    const submitBtn = page.getByTestId('new-request-form-submit');
    await submitBtn.waitFor({ state: 'visible', timeout: 10000 });
    await submitBtn.click();

    // 7. Esperar formulario datos generales
    await page.waitForURL(/.*\/comercio\/panel\/formulario-precalificacion/, { timeout: 15000 });

    // 8. Llenar campos requeridos de datos generales
    const emailInput = page.getByTestId('general-information-form-email');
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill('test7@bi.com.gt');

    const phoneInput = page.getByTestId('general-information-form-phone-number');
    await phoneInput.fill('41111117');

    const nitInput = page.getByTestId('general-information-form-nit');
    await nitInput.fill('107821567');

    // Llenar fecha inicio trabajo
    const fechaInput = page.getByTestId('general-information-form-start-date-work');
    await fechaInput.fill('2015-06-20');

    // 9. Click continuar
    const continuarBtn = page.getByTestId('general-information-form-submit');
    await continuarBtn.click();

    // 10. Esperar instrucción onboarding
    await page.waitForURL(/.*\/comercio\/panel\/instruccion-onboarding/, { timeout: 15000 });
  });

  test('VAL-MODAL-INST-001: Validar ausencia de texto instructivo anterior @P1', async ({ page }, testInfo) => {
    const modalData = uiExpectedValues.modalInstructivo;
    const textoAnterior = modalData.textoAnterior;

    // Verificar que el texto instructivo anterior NO esté visible
    await expect(page.getByText(textoAnterior)).not.toBeVisible();

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Modal Instructivo - Ausencia Texto Anterior');
  });

  test('VAL-MODAL-INST-002: Validar nuevo título del modal @P1', async ({ page }, testInfo) => {
    const modalData = uiExpectedValues.modalInstructivo;

    // Obtener el título del modal
    const titulo = page.getByTestId(modalData.titulo.testId);
    await titulo.waitFor({ state: 'visible', timeout: 10000 });

    // Verificar que el título coincida con el valor esperado
    const tituloText = await titulo.textContent();
    expect(tituloText?.trim()).toBe(modalData.titulo.text);

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Modal Instructivo - Nuevo Título');
  });

  test('VAL-MODAL-INST-003: Validar nuevo subtítulo del modal @P1', async ({ page }, testInfo) => {
    const modalData = uiExpectedValues.modalInstructivo;

    // Obtener el subtítulo del modal
    const subtitulo = page.getByTestId(modalData.subtitulo.testId);
    await subtitulo.waitFor({ state: 'visible', timeout: 10000 });

    // Verificar que el subtítulo coincida con el valor esperado
    const subtituloText = await subtitulo.textContent();
    expect(subtituloText?.trim()).toBe(modalData.subtitulo.text);

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Modal Instructivo - Nuevo Subtítulo');
  });

  test('VAL-MODAL-INST-004: Validar imagen SVG @P1', async ({ page }, testInfo) => {
    const modalData = uiExpectedValues.modalInstructivo;

    // Obtener el elemento de imagen
    const imagen = page.getByTestId(modalData.imagen.testId);
    await imagen.waitFor({ state: 'visible', timeout: 10000 });

    // Verificar que el atributo src termine en .svg
    const src = await imagen.getAttribute('src');
    expect(src).not.toBeNull();
    expect(src!.endsWith(modalData.imagen.srcPattern)).toBe(true);

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Modal Instructivo - Imagen SVG');
  });

  test('VAL-MODAL-INST-005: Validar contenido de bullets @P1', async ({ page }, testInfo) => {
    const modalData = uiExpectedValues.modalInstructivo;

    // Obtener el contenedor de bullets
    const bulletsContainer = page.getByTestId(modalData.bullets.testId);
    await bulletsContainer.waitFor({ state: 'visible', timeout: 10000 });

    // Obtener todos los elementos li dentro del contenedor
    const items = bulletsContainer.locator('li');
    const count = await items.count();
    expect(count).toBe(modalData.bullets.items.length);

    // Verificar el texto de cada bullet
    for (let i = 0; i < count; i++) {
      const itemText = await items.nth(i).textContent();
      expect(itemText?.trim()).toBe(modalData.bullets.items[i]);
    }

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Modal Instructivo - Contenido Bullets');
  });
});
