import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ScreenshotHelper } from '../../../fixtures/testHelpers';
import { ModalErrorFacePhiPage } from '../../../pages/B2C/modalErrorFacePhi.page';

// Cargar los valores esperados
const uiExpectedValues = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../data/ui-expected-values.json'), 'utf-8')
);

test.describe('Validación de Modal Error FacePhi - Instrucción Onboarding B2C @validation @modal @B2C @P1', () => {
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

    // 11. Click "Iniciar escaneo" para disparar FacePhi — en dispositivo incompatible, el modal de error debe aparecer
    const iniciarEscaneoBtn = page.getByRole('button', { name: 'Iniciar escaneo' });
    // Esperar a que la página cargue completamente antes de hacer click
    await page.waitForTimeout(10000);
    await iniciarEscaneoBtn.click();

    // 12. Esperar a que el modal de error aparezca
    const modalTitle = page.getByTestId('facephi-error-modal-title');
    await modalTitle.waitFor({ state: 'visible', timeout: 15000 });
  });

  test('VAL-MODAL-FP-001: Validar título "¡Lo sentimos!" @P1', async ({ page }, testInfo) => {
    const modalData = uiExpectedValues.modalErrorFacePhi;
    const modalPage = new ModalErrorFacePhiPage(page);

    // Obtener el título del modal
    const tituloText = await modalPage.obtenerTituloModal();
    expect(tituloText?.trim()).toBe(modalData.titulo.text);

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Modal Error FacePhi - Título');
  });

  test('VAL-MODAL-FP-002: Validar texto del cuerpo @P1', async ({ page }, testInfo) => {
    const modalData = uiExpectedValues.modalErrorFacePhi;
    const modalPage = new ModalErrorFacePhiPage(page);

    // Obtener el texto del cuerpo del modal
    const bodyText = await modalPage.obtenerTextoBody();
    expect(bodyText?.trim()).toContain(modalData.body.text);

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Modal Error FacePhi - Texto Cuerpo');
  });

  test('VAL-MODAL-FP-003: Validar texto del botón "¡Listo!" @P1', async ({ page }, testInfo) => {
    const modalData = uiExpectedValues.modalErrorFacePhi;
    const modalPage = new ModalErrorFacePhiPage(page);

    // Obtener el texto del botón
    const botonText = await modalPage.obtenerTextoBoton();
    expect(botonText?.trim()).toBe(modalData.boton.text);

    // Tomar screenshot
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Modal Error FacePhi - Texto Botón');
  });

  test('VAL-MODAL-FP-004: Validar redirección al hacer click en botón @P1', async ({ page }, testInfo) => {
    const modalData = uiExpectedValues.modalErrorFacePhi;
    const modalPage = new ModalErrorFacePhiPage(page);

    // Tomar screenshot antes de hacer click
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Modal Error FacePhi - Antes de Click');

    // Click en el botón "¡Listo!"
    await modalPage.clickBotonListo();

    // Verificar que la URL redirige al patrón esperado
    await expect(page).toHaveURL(new RegExp(modalData.redirectPattern.replace(/\//g, '\\/')), { timeout: 15000 });

    // Tomar screenshot después de la redirección
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Modal Error FacePhi - Después de Redirección');
  });
});
