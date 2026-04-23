import { test, expect } from '../../../fixtures/baseTest';
import { request } from '@playwright/test';
import { ScreenshotHelper } from '../../../fixtures/testHelpers';
import datos from '../../../data/data_new_client.json';

test('VAL-REG-SELPHI-001: Regresión Selphi 5.51 - Flujo onboarding B2C @validation @regression @B2C @P0', async ({ 
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
  
  // Variables para onboarding
  const urlVideo = process.env.ONBOARDING_VIDEO_URL || '';
  const templateRawPath = 'assets/marcos/templateraw_1766501174.txt';
  const bestImageTokenizedPath = 'assets/marcos/imagetokenized_1766501171.txt';
  const bestImagePath = 'assets/marcos/facialcontent_1766501167.jpeg';
  
  // API Request Context con ignoreHTTPSErrors
  const apiRequestContext = await request.newContext({
    ignoreHTTPSErrors: true
  });

  await test.step('1. Navegar a página de login B2C', async () => {
    const loginPath = process.env.B2C_LOGIN_PATH || 'comercio/sitio/inicio-sesion';
    await page.goto(loginPath);
    await page.waitForLoadState('domcontentloaded');
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Regresión Selphi - Login B2C');
  });

  await test.step('2. Ingresar credenciales y hacer login', async () => {
    await homePageBusiness.IngresarUsuarioB2C(datos.Marcos.UsuarioB2C);
    await homePageBusiness.IngresarPasswordB2C(datos.Marcos.PasswordB2C);
    await homePageBusiness.ClicBotonIngresarB2C();
    await page.waitForTimeout(3000);
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Regresión Selphi - Login exitoso');
  });

  await test.step('3. Validar dashboard y nueva solicitud', async () => {
    await dashboardPageBusiness.validarDashboard();
    await dashboardPageBusiness.clickNuevaSolicitud();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Regresión Selphi - Dashboard');
  });

  await test.step('4. Empezar solicitud con DPI', async () => {
    await empezarSolicitudBusinessPage.validarEmpezarSolicitudB2C();
    await empezarSolicitudBusinessPage.ingresarDPI(datos.Marcos.dpi);
    await empezarSolicitudBusinessPage.clickEmpezarSolicitudB2C();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Regresión Selphi - DPI ingresado');
  });

  await test.step('5. Completar formulario datos generales', async () => {
    await formDatosGeneralesPage.validarFDG();
    await formDatosGeneralesPage.llenadorFormulario(datos.Marcos);
    await formDatosGeneralesPage.clickContinuarFDG();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Regresión Selphi - Datos generales completados');
  });

  await test.step('6. Instrucción onboarding', async () => {
    await instruccionOnboardingBusinessPage.validarRedireccionFormulario();
    await instruccionOnboardingBusinessPage.clickIniciarEscaneo();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Regresión Selphi - Instrucción onboarding');
  });

  await test.step('7. Completar onboarding biométrico (Selphi 5.51)', async () => {
    await onboardingBusinessPage.consumirOnboarding(
      urlVideo,
      templateRawPath,
      bestImageTokenizedPath,
      bestImagePath,
      apiRequestContext
    );
    await footerComponent.validateVisible();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Regresión Selphi - Onboarding completado exitosamente');
  });
});
