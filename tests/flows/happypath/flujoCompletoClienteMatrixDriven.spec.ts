import { test, expect } from '../../../fixtures/baseTest';
import { request } from '@playwright/test';
import { ScreenshotHelper } from '../../../fixtures/testHelpers';
import { getTestDatasets } from '../../../utils/testMatrixRunner';

/**
 * Test data-driven usando test-matrix.json
 * 
 * Ventajas:
 * - No hay datos hardcodeados en el test
 * - Para agregar nuevos clientes, solo se actualiza data_new_client.json
 * - La configuración está centralizada en test-matrix.json
 * - Fácil mantenimiento y escalabilidad
 */

// Obtener todos los datasets configurados para E2E-001
const datasets = getTestDatasets('E2E-001');

// Ejecutar el test para cada dataset
datasets.forEach(({ name, data }) => {
  test(`flujo completo - ${name} @E2E-001`, async ({
    page,
    homePage,
    inicioPage,
    seleccionPage,
    datosGeneralesPage,
    datosPersonalesPage,
    datosEconomicosPage,
    datosEconomicosOtrosIngresosPage,
    datosEnviosPage,
    onboardingPage,
    instruccionOnboardingPage,
    aceptarOfertaPage,
    personalizacionTcPage,
    encuestaSatisfaccionPage,
    footerComponent
  }, testInfo) => {
    // Variables para onboarding
    const urlVideo = data.assets?.urlVideo || '';
    const templateRawPath = data.assets?.templateRaw ;
    const bestImageTokenizedPath = data.assets?.bestImageTokenized ;
    const bestImagePath = data.assets?.bestImage ;
    const ofertaUrl = process.env.OFFER_FORM_URL ||
      'https://qa-tarjetadigital.incubadorabi.com/cliente-digital/oferta';
    
    // API Request Context
    const apiRequestContext = await request.newContext({
      ignoreHTTPSErrors: true
    });

    // --- Flujo de Cliente Existente ---

    await test.step('1. Navegar a página de inicio', async () => {
      await homePage.goto();
      await homePage.validarPortal();
      await homePage.esperarHeroCargado();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Página de inicio`);
    });

    await test.step('2. Iniciar solicitud de tarjeta', async () => {
      await page.waitForTimeout(2000);
      await homePage.empezarSolicitud();
      await page.waitForTimeout(2000);
      await homePage.validarRedireccionFormulario();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Solicitud iniciada`);
    });

    await test.step('3. Ingresar DPI y continuar', async () => {
      await inicioPage.ingresarDPI(data.dpi);
      await inicioPage.clicContinuar();
      await inicioPage.validarRedireccionFormulario();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] DPI ingresado`);
    });

    await test.step('4. Seleccionar tipo de tarjeta', async () => {
      // Seleccionar el tipo de tarjeta según el dataprovider
      if (data.tipoTarjeta === 'MC') {
        await seleccionPage.seleccionarMC();
      } else if (data.tipoTarjeta === 'VISA') {
        await seleccionPage.seleccionarVisa();
      } else {
        // Por defecto MC si no está especificado
        await seleccionPage.seleccionarTCJ();
      }
      await seleccionPage.clickSiguiente();
      await seleccionPage.validarRedireccionFormulario();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Tarjeta ${data.tipoTarjeta || 'MC'} seleccionada`);
    });

    await test.step('5. Llenar datos generales', async () => {
      await datosGeneralesPage.clickSiguiente();
      await datosGeneralesPage.llenarFormulario({
        email: data.email,
        numeroCelular: data.numeroCelular,
        nit: data.nit,
        fecha: data.fechaInicioTrabajo || '05/11/1990',
      });
      await datosGeneralesPage.clickContinuar();
      await datosGeneralesPage.validarRedireccionFormulario();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Datos generales`);
    });

    await test.step('6. Iniciar escaneo biométrico', async () => {
      await instruccionOnboardingPage.clickIniciarEscaneo();
      await instruccionOnboardingPage.validarRedireccionFormulario();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Escaneo iniciado`);
    });

    await test.step('7. Completar onboarding biométrico', async () => {
      await onboardingPage.consumirOnboarding(
        urlVideo,
        templateRawPath,
        bestImageTokenizedPath,
        bestImagePath,
        apiRequestContext
      );
      await onboardingPage.irAFormularioOferta(ofertaUrl);
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Onboarding completado`);
    });

    await page.pause();
    await test.step('8. Aceptar oferta', async () => {
      await aceptarOfertaPage.aceptarTerminos();
      await aceptarOfertaPage.clickAceptarOferta();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Oferta aceptada`);
    });

    await test.step('9. Personalizar tarjeta', async () => {
      await personalizacionTcPage.llenarFormulario({ alias: data.Alias });
      await personalizacionTcPage.clickContinuar();
      await personalizacionTcPage.validarRedireccionFormulario();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Tarjeta personalizada`);
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
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Datos personales`);
    });

    await test.step('11. Ingresar datos económicos', async () => {
      await datosEconomicosPage.ingresosMensuales(data.IngresoMensual);
      await datosEconomicosPage.gastosMensuales(data.GastoMensual);
      await datosEconomicosPage.seleccionarOtrosIngresos();
      await datosEconomicosPage.clickGuardarContinuar();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Datos económicos`);
    });

    await test.step('12. Ingresar otros ingresos', async () => {
      await datosEconomicosOtrosIngresosPage.tipoDeFuenteOtros('Actividades profesionales');
      await datosEconomicosOtrosIngresosPage.clickGuardarOtrosIngresos();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Otros ingresos`);
    });

    await test.step('13. Confirmar datos de envío', async () => {
      await datosEnviosPage.clickContinuarEnvio();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Datos de envío`);
    });

    await test.step('14. Completar encuesta de satisfacción', async () => {
      await encuestaSatisfaccionPage.clickOmitirFinalizar();
      await page.waitForTimeout(2000);
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Encuesta completada`);
    });

    console.log(`✅ Flujo completo exitoso para: ${name}`);
  });
});
