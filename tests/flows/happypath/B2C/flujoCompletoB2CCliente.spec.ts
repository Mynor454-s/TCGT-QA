import { test, expect } from '../../../../fixtures/baseTest';
import { request } from '@playwright/test';
import { ScreenshotHelper } from '../../../../fixtures/testHelpers';
import datos from '../../../../data/data_new_client.json';

test('flujo completo B2C Cliente @smoke @e2e @P0', async ({ 
  page, 
  context,
  homePageBusiness,
  dashboardPageBusiness,
  empezarSolicitudBusinessPage,
  formDatosGeneralesPage,
  instruccionOnboardingBusinessPage,
  inicioPage,
  seleccionPage,
  datosGeneralesPage,
  onboardingPage,
  onboardingBusinessPage,
  instruccionOnboardingPage,
  aceptarOfertaPage,
  personalizacionTcPage,
  datosPersonalesPage,
  datosEconomicosPage,
  datosEconomicosOtrosIngresosPage,
  datosEnviosPage,
  encuestaSatisfaccionPage,
  footerComponent
}, testInfo) => {
  
  // Variables para onboarding
  const urlVideo = process.env.ONBOARDING_VIDEO_URL || '';
  const templateRawPath = 'assets/marcos/templateraw_1766501174.txt';
  const bestImageTokenizedPath = 'assets/marcos/imagetokenized_1766501171.txt';
  const bestImagePath = 'assets/marcos/facialcontent_1766501167.jpeg';
  
  // API Request Context con ignoreHTTPSErrors
  const apiRequestContext = await request.newContext({
    ignoreHTTPSErrors: true
  });

  // --- Flujo de B2C (Business to Consumer) ---

  await test.step('1. Navegar a página de login B2C', async () => {
    const loginPath = process.env.B2C_LOGIN_PATH || 'comercio/sitio/inicio-sesion';
    await page.goto(loginPath);
    await page.waitForLoadState('domcontentloaded');
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Página de login B2C');
  });

  await test.step('2. Ingresar credenciales y hacer login', async () => {
    await homePageBusiness.IngresarUsuarioB2C(datos.Mynor.UsuarioB2C);
    await homePageBusiness.IngresarPasswordB2C(datos.Mynor.PasswordB2C);
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Credenciales ingresadas');
    await homePageBusiness.ClicBotonIngresarB2C();
    await page.waitForTimeout(3000);
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Login exitoso');
  });

    await test.step('3. Validar dashboard B2C', async () => {
    await dashboardPageBusiness.validarDashboard();
    await dashboardPageBusiness.clickNuevaSolicitud();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Dashboard B2C validado');
  });

    await test.step('4. Empezar solicitud de tarjeta desde B2C', async () => {
    await empezarSolicitudBusinessPage.validarEmpezarSolicitudB2C();
    await empezarSolicitudBusinessPage.ingresarDPI(datos.Marcos.dpi);
    await empezarSolicitudBusinessPage.clickEmpezarSolicitudB2C();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Solicitud de tarjeta iniciada desde B2C');
    });

    await test.step('5. Completar formulario de datos generales B2C', async () => {
    await formDatosGeneralesPage.validarFDG();
    await formDatosGeneralesPage.llenadorFormulario(datos.Marcos);
    await formDatosGeneralesPage.clickContinuarFDG();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Formulario de datos generales B2C completado');
    });

    await test.step('6. Completar instrucción de onboarding B2C', async () => {
    await instruccionOnboardingBusinessPage.validarRedireccionFormulario();
    await instruccionOnboardingBusinessPage.clickIniciarEscaneo();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Instrucción de onboarding B2C completada');
    });

    await page.pause();
    await test.step('7. Completar onboarding biométrico', async () => {
    await onboardingBusinessPage.consumirOnboarding(
      urlVideo,
      templateRawPath,
      bestImageTokenizedPath,
      bestImagePath,
      apiRequestContext
    );
    await footerComponent.validateVisible();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Onboarding biométrico completado');
  });
});