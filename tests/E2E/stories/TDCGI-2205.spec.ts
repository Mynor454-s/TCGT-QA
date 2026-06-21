import { test, expect } from '../../../fixtures/baseTest';
import { ScreenshotHelper } from '../../../fixtures/testHelpers';
import datosClientes from '../../../data/data_new_client.json';
import uiExpectedValues from '../../../data/ui-expected-values.json';
import { ClienteTestData } from '../../../utils/testConfig';

const cliente = (datosClientes as Record<string, ClienteTestData>).Marcos;

const config = uiExpectedValues.modalMalaInteraccionTDCGI2205 as {
  modalMalaInteraccionTitle: string;
  modalMalaInteraccionBody: string;
  modalFacePhiGenericTitle: string;
  modalFacePhiGenericBody: string;
  modalFacePhiGenericRetryId: string;
  ariaModalSelector: string;
  errorCodes: string[];
  targetEndpoint: string;
};

/**
 * TDCGI-2205 - No mostrar dos modales por error de interacción
 *
 * Bug: cuando biometric/onboarding responde 422 con errorCode 4224xx,
 * aparecen DOS modales simultáneas:
 *   1. "¡Ups! Tuvimos un inconveniente." (modal de mala interacción - CORRECTA)
 *   2. "¡Oh no! Ocurrió un error."       (modal genérica FacePhi - BUG)
 *
 * Este test valida que tras el fix solo se muestre 1 modal (la de "¡Ups!").
 *
 * EJECUCIÓN: semi-automatizado — requiere cámara física disponible.
 * Correr con: ENV=qa npx playwright test flujoE2EErrorInteraccionTDCGI2205.spec.ts --headed
 *
 * El flujo hasta la pantalla de escaneo es automático. Una vez en
 * rostro-autenticacion, el interceptor 422 está activo: completar el
 * escaneo biométrico manualmente para que FacePhi dispare la llamada
 * al backend y el test valide los modales resultantes.
 */
test.describe('E2E B2B - TDCGI-2205 una sola modal por error de interaccion @e2e @B2B @P1 @E2E-003', () => {
  test.slow();

  for (const errorCode of config.errorCodes) {
    test(`E2E-003: error ${errorCode} muestra solo modal de mala interaccion @e2e @B2B @P1 @TDCGI-2205 @R15`, async ({
      page,
      homePage,
      inicioPage,
      seleccionPage,
      datosGeneralesPage,
      instruccionOnboardingPage,
    }, testInfo) => {

      // ── Selectores de las modales ────────────────────────────────────────────
      const todasLasModales   = page.locator("div[aria-modal='true']");
      const modalMalaInteracc = page.locator("div[aria-modal='true']").filter({ hasText: config.modalMalaInteraccionTitle });
      const modalFacePhiError = page.locator("div[aria-modal='true']").filter({ hasText: config.modalFacePhiGenericTitle });
      const botonReintentoBug = page.locator(`#${config.modalFacePhiGenericRetryId}`);

      // ── Paso 1: Flujo automático hasta instruccion-onboarding ────────────────
      await test.step('1. Navegar hasta instruccion-onboarding', async () => {
        await homePage.goto();
        await homePage.validarPortal();
        await homePage.esperarHeroCargado();
        await homePage.empezarSolicitud();
        await homePage.validarRedireccionFormulario();

        await inicioPage.ingresarDPI(cliente.dpi);
        await inicioPage.clicContinuar();
        await ScreenshotHelper.takeAndAttach(page, testInfo, `[${errorCode}] DPI ingresado`);

        await seleccionPage.seleccionarMC();
        await seleccionPage.clickSiguiente();

        await datosGeneralesPage.clickSiguiente();
        await datosGeneralesPage.llenarFormulario({
          email: cliente.email,
          numeroCelular: cliente.numeroCelular,
          nit: cliente.nit,
          fecha: cliente.fechaInicioTrabajo,
        });
        await datosGeneralesPage.clickContinuar();
        await ScreenshotHelper.takeAndAttach(page, testInfo, `[${errorCode}] Datos generales completados`);
      });

      // ── Paso 2: Activar interceptor y navegar a pantalla de escaneo ──────────
      await test.step('2. Configurar interceptor 422 e iniciar escaneo', async () => {
        // Interceptar la llamada al backend con 422 + errorCode específico
        await page.route(config.targetEndpoint, async route => {
          await route.fulfill({
            status: 422,
            contentType: 'application/json',
            body: JSON.stringify({
              errors: ['Mala interacción'],
              errorCode: Number(errorCode),
              statusCode: 422,
            }),
          });
        });

        await instruccionOnboardingPage.clickIniciarEscaneo();
        await instruccionOnboardingPage.validarRedireccionFormulario();
        await ScreenshotHelper.takeAndAttach(page, testInfo, `[${errorCode}] Pantalla de escaneo — completar manualmente`);
      });

      // ── Paso 3: Validar que solo aparece la modal de mala interaccion ────────
      // El interceptor responde 422 cuando FacePhi completa el escaneo y llama al backend.
      await test.step('3. Verificar que solo aparece la modal de mala interaccion', async () => {
        await expect(modalMalaInteracc).toBeVisible({ timeout: 90000 });
        await expect(modalMalaInteracc).toContainText(config.modalMalaInteraccionBody);

        await ScreenshotHelper.takeAndAttach(page, testInfo, `[${errorCode}] Modal visible tras error 422`);

        // ASSERTION PRINCIPAL: solo debe haber 1 modal (bug: aparecen 2)
        const cantidadModales = await todasLasModales.count();
        expect(cantidadModales, 'Solo debe mostrarse 1 modal (bug: aparecen 2)').toBe(1);

        // La modal genérica de FacePhi NO debe estar visible
        await expect(modalFacePhiError).not.toBeVisible();
        await expect(botonReintentoBug).not.toBeVisible();
      });

      // ── Paso 4: Cerrar modal y verificar que desaparece ─────────────────────
      await test.step('4. Cerrar modal y verificar que desaparece', async () => {
        const botonCerrar = modalMalaInteracc.locator('a[tabindex="0"]');
        await botonCerrar.click();

        await expect(todasLasModales).toHaveCount(0, { timeout: 10000 });
        await ScreenshotHelper.takeAndAttach(page, testInfo, `[${errorCode}] Modal cerrada correctamente`);
      });
    });
  }
});
