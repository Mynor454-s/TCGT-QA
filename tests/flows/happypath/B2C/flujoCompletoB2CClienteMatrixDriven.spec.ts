import { test, expect } from '../../../../fixtures/baseTest';
import { request } from '@playwright/test';
import { ScreenshotHelper } from '../../../../fixtures/testHelpers';
import { getTestDatasets } from '../../../../utils/testMatrixRunner';

/**
 * Test B2C data-driven usando test-matrix.json
 * 
 * Ventajas:
 * - No hay datos hardcodeados en el test
 * - Para agregar nuevos clientes B2C, solo se actualiza data_new_client.json
 * - La configuración está centralizada en test-matrix.json
 * - Fácil mantenimiento y escalabilidad
 */

// Obtener todos los datasets configurados para E2E-B2C-001
const datasets = getTestDatasets('E2E-B2C-001');

// Ejecutar el test para cada dataset
datasets.forEach(({ name, data }) => {
  test(`flujo completo B2C - ${name} @E2E-B2C-001 @B2C @smoke @e2e @P0`, async ({
    page,
    context,
    homePageBusiness,
    dashboardPageBusiness,
    empezarSolicitudBusinessPage,
    formDatosGeneralesPage,
    instruccionOnboardingBusinessPage,
    onboardingBusinessPage,
    footerComponent
  }, testInfo) => {
    // Variables para onboarding - Dinámicas desde dataprovider
    const urlVideo = data.assets?.urlVideo || process.env.ONBOARDING_VIDEO_URL || '';
    const templateRawPath = data.assets?.templateRaw;
    const bestImageTokenizedPath = data.assets?.bestImageTokenized;
    const bestImagePath = data.assets?.bestImage;
    
    // API Request Context con ignoreHTTPSErrors
    const apiRequestContext = await request.newContext({
      ignoreHTTPSErrors: true
    });

    // --- Flujo de B2C (Business to Consumer) ---

    await test.step('1. Navegar a página de login B2C', async () => {
      const loginPath = process.env.B2C_LOGIN_PATH || 'comercio/sitio/inicio-sesion';
      await page.goto(loginPath);
      await page.waitForLoadState('domcontentloaded');
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Página de login B2C`);
    });

    await test.step('2. Ingresar credenciales y hacer login', async () => {
      await homePageBusiness.IngresarUsuarioB2C(data.UsuarioB2C);
      await homePageBusiness.IngresarPasswordB2C(data.PasswordB2C);
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Credenciales ingresadas`);
      await homePageBusiness.ClicBotonIngresarB2C();
      await page.waitForTimeout(3000);
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Login exitoso`);
    });

    await test.step('3. Validar dashboard B2C', async () => {
      await dashboardPageBusiness.validarDashboard();
      await dashboardPageBusiness.clickNuevaSolicitud();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Dashboard B2C validado`);
    });

    await test.step('4. Empezar solicitud de tarjeta desde B2C', async () => {
      await empezarSolicitudBusinessPage.validarEmpezarSolicitudB2C();
      await empezarSolicitudBusinessPage.ingresarDPI(data.dpi);
      await empezarSolicitudBusinessPage.clickEmpezarSolicitudB2C();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Solicitud de tarjeta iniciada desde B2C`);
    });

    await test.step('5. Completar formulario de datos generales B2C', async () => {
      await formDatosGeneralesPage.validarFDG();
      await formDatosGeneralesPage.llenadorFormulario(data);
      await formDatosGeneralesPage.clickContinuarFDG();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Formulario de datos generales B2C completado`);
    });

    await test.step('6. Completar instrucción de onboarding B2C', async () => {
      await instruccionOnboardingBusinessPage.validarRedireccionFormulario();
      await instruccionOnboardingBusinessPage.clickIniciarEscaneo();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Instrucción de onboarding B2C completada`);
    });

    await test.step('7. Completar onboarding biométrico', async () => {
      await onboardingBusinessPage.consumirOnboarding(
        urlVideo,
        templateRawPath,
        bestImageTokenizedPath,
        bestImagePath,
        apiRequestContext
      );
      await footerComponent.validateVisible();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Onboarding biométrico completado`);
    });

    console.log(`✅ Flujo B2C completo exitoso para: ${name}`);
  });
});
