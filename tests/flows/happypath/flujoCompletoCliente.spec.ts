import { test, expect } from '../../../fixtures/baseTest';
import { request } from '@playwright/test';
import { ScreenshotHelper } from '../../../fixtures/testHelpers';
import datos from '../../../data/data_new_client.json';
import { resolveOnboardingVideoUrl } from '../../../utils/s3SignedUrl';
import { ClienteTestData, OFERTA_URL } from '../../../utils/testConfig';

test('flujo completo Cliente Existente @smoke @e2e @P0', async ({ 
  page, 
  context,
  homePage,
  inicioPage,
  seleccionPage,
  datosGeneralesPage,
  onboardingPage,
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
  const clienteData = datos.Monther;

  // Variables para onboarding
  const templateRawPath = clienteData.assets.templateRaw;
  const bestImageTokenizedPath = clienteData.assets.bestImageTokenized;
  const bestImagePath = clienteData.assets.bestImage;

  const urlVideo = await resolveOnboardingVideoUrl({
    videoS3: clienteData?.assets?.videoS3,
    sourceVideoUrl: clienteData?.assets?.urlVideo,
    fallbackUrl: process.env.ONBOARDING_VIDEO_URL || '',
    defaultExpiresInSeconds: Number(process.env.S3_PRESIGN_EXPIRES_IN || 3600),
  });

  if (!urlVideo) {
    throw new Error('No se pudo resolver URL de video para onboarding');
  }

  if (!templateRawPath || !bestImageTokenizedPath || !bestImagePath) {
    throw new Error('Faltan rutas de assets biométricos en el dataset de cliente');
  }
  
  // API Request Context con ignoreHTTPSErrors
  const apiRequestContext = await request.newContext({
    ignoreHTTPSErrors: true
  });

  // --- Flujo de Cliente Existente ---

  await test.step('1. Navegar a página de inicio', async () => {
    await homePage.goto();
    await homePage.validarPortal();
    await homePage.esperarHeroCargado();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Página de inicio');
  });

  await test.step('2. Iniciar solicitud de tarjeta', async () => {
    await page.waitForTimeout(2000);
    await homePage.empezarSolicitud();
    await page.waitForTimeout(2000);
    await homePage.validarRedireccionFormulario();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Solicitud iniciada');
  });

  await test.step('3. Ingresar DPI y continuar', async () => {
    await inicioPage.ingresarDPI(clienteData.dpi);
    await inicioPage.clicContinuar();
    await inicioPage.validarRedireccionFormulario();
    await footerComponent.validateVisible();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'DPI ingresado');
  });

  await test.step('4. Seleccionar tipo de tarjeta', async () => {
    await seleccionPage.seleccionarMC();
    await seleccionPage.clickSiguiente();
    await seleccionPage.validarRedireccionFormulario();
    await footerComponent.validateVisible();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Tipo de tarjeta seleccionado');
  });

  await test.step('5. Llenar datos generales', async () => {
    await datosGeneralesPage.clickSiguiente();
    await datosGeneralesPage.llenarFormulario({
      email: clienteData.email,
      numeroCelular: clienteData.numeroCelular,
      nit: clienteData.nit,
      fecha: clienteData.fechaInicioTrabajo,
    });
    await datosGeneralesPage.clickContinuar();
    await datosGeneralesPage.validarRedireccionFormulario();
    await footerComponent.validateVisible();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Datos generales completados');
  });

  await test.step('6. Iniciar escaneo biométrico', async () => {
    await instruccionOnboardingPage.clickIniciarEscaneo();
    await instruccionOnboardingPage.validarRedireccionFormulario();
    await footerComponent.validateVisible();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Escaneo biométrico iniciado');
  });

  await test.step('7. Completar onboarding biométrico', async () => {
    await onboardingPage.consumirOnboarding(
      urlVideo,
      templateRawPath,
      bestImageTokenizedPath,
      bestImagePath,
      apiRequestContext
    );
    await onboardingPage.irAFormularioOferta(OFERTA_URL);
    await footerComponent.validateVisible();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Onboarding biométrico completado');
  });

  await test.step('8. Aceptar oferta', async () => {
    await aceptarOfertaPage.aceptarTerminos();
    await aceptarOfertaPage.clickAceptarOferta();
    await aceptarOfertaPage.validarRedireccionFormulario();
    await footerComponent.validateVisible();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Oferta aceptada');
  });

  await test.step('9. Personalizar tarjeta', async () => {
    await personalizacionTcPage.llenarFormulario({ alias: clienteData.Alias });
    await personalizacionTcPage.clickContinuar();
    await personalizacionTcPage.validarRedireccionFormulario();
    await footerComponent.validateVisible();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Tarjeta personalizada');
  });

  await test.step('10. Ingresar datos personales', async () => {
    await datosPersonalesPage.seleccionarNivelEstudios('Sin estudios');
    await datosPersonalesPage.ingresarDependientes(1);
    await datosPersonalesPage.seleccionarOcupacion('Comercio Informal');
    await datosPersonalesPage.seleccionarDepartamento('Guatemala');
    await datosPersonalesPage.seleccionarMunicipio('Guatemala');
    await datosPersonalesPage.ingresarZona('1');
    await datosPersonalesPage.ingresarDireccion('Ciudad de Guatemala');
    await datosPersonalesPage.clickGuardarContinuar();
    await footerComponent.validateVisible();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Datos personales completados');
  });

  await test.step('11. Ingresar datos económicos', async () => {
    await datosEconomicosPage.ingresosMensuales(clienteData.IngresoMensual);
    await datosEconomicosPage.gastosMensuales(clienteData.GastoMensual);
    await datosEconomicosPage.seleccionarOtrosIngresos();
    await datosEconomicosPage.clickGuardarContinuar();
    await footerComponent.validateVisible();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Datos económicos completados');
  });

  await test.step('12. Ingresar otros ingresos', async () => {
    await datosEconomicosOtrosIngresosPage.tipoDeFuenteOtros('Actividades profesionales');
    await datosEconomicosOtrosIngresosPage.clickGuardarOtrosIngresos();
    await footerComponent.validateVisible();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Otros ingresos completados');
  });

  await test.step('13. Confirmar datos de envío', async () => {
    await datosEnviosPage.clickContinuarEnvio();
    await footerComponent.validateVisible();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Datos de envío confirmados');
  });

  await test.step('14. Completar encuesta de satisfacción', async () => {
    await encuestaSatisfaccionPage.clickOmitirFinalizar();
    await page.waitForTimeout(2000);
    await footerComponent.validateVisible();
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Encuesta completada');
  });

});
