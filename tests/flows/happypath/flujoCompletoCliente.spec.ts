import { test, request } from '@playwright/test';
import { HomePage } from '../../../pages/home.page';
import { InicioFlujoPage } from '../../../pages/inicioFlujo.page';
import { seleccionTc } from '../../../pages/seleccionTc.page';
import datos from '../../../data/data_new_client.json';
import { DatosGeneralesPage } from '../../../pages/datosGenerales.page';
import { ocrPage } from '../../../pages/ocrPage.page';
import { OnboardingPage } from '../../../pages/onboarding.page';
import { updateJiraTestStatus } from '../../../utils/jiraHelper';
import { InstruccionOnboardingPage } from '../../../pages/instruccionOnboarding.page';
import { AceptarOfertaPage } from '../../../pages/aceptarOferta.page';
import { PersonalizacionTcPage } from '../../../pages/personalizacionTc.page';
import { DatosPersonalesPage } from '../../../pages/datosPersonales.page';
import { DatosEconomicosPage } from '../../../pages/datosEconomicos.page';
import { DatosEconomicosOtrosIngresosPage } from '../../../pages/otrosIngresos.page';
import { DatosEnviosPage } from '../../../pages/datosDeEnvio.page';
import { EncuestaSatisfaccionPage } from '../../../pages/encuestaSatisfaccion.page';
import { FooterComponent } from '../../../components/footer.component';

// Configuración de Jira desde variables de entorno
const JIRA_TEST_RUN_ID = process.env.JIRA_TEST_RUN_ID || '';
const JIRA_URL = process.env.JIRA_URL || '';
const JIRA_AUTH_TOKEN = process.env.JIRA_AUTH_TOKEN || '';

// test.afterEach(async ({}, testInfo) => {
//   Actualizar estado en Jira basado en el resultado del test
//   if (testInfo.status === 'passed') {
//     await updateJiraTestStatus(JIRA_TEST_RUN_ID, 'PASSED', JIRA_URL, JIRA_AUTH_TOKEN);
//   } else if (testInfo.status === 'failed') {
//     await updateJiraTestStatus(JIRA_TEST_RUN_ID, 'FAILED', JIRA_URL, JIRA_AUTH_TOKEN);
//   } else if (testInfo.status === 'timedOut') {
//     await updateJiraTestStatus(JIRA_TEST_RUN_ID, 'ABORTED', JIRA_URL, JIRA_AUTH_TOKEN);
//   }
// });

test('flujo completo Cliente Existente', async ({ page, context }, testInfo) => {
  // Actualizar estado a EXECUTING al iniciar
  // await updateJiraTestStatus(JIRA_TEST_RUN_ID, 'EXECUTING', JIRA_URL, JIRA_AUTH_TOKEN);
  const home = new HomePage(page);
  const inicio = new InicioFlujoPage(page);
  const seleccion = new seleccionTc(page);
  const datosGenerales = new DatosGeneralesPage(page);
  const ocr = new ocrPage(page);
  const onboarding = new OnboardingPage(page);
  const urlVideo = process.env.ONBOARDING_VIDEO_URL || '';
  const templateRawPath = 'assets/templateraw_1760545131.txt';
  const bestImageTokenizedPath = 'assets/imagetokenized_1760545130.txt';
  const bestImagePath = 'assets/facialcontent_1760545127.jpeg';
  const apiRequestContext = await request.newContext();
  const instruccionOnboarding = new InstruccionOnboardingPage(page);
  const aceptarOfertaPage = new AceptarOfertaPage(page);
  const personalizacionTcPage = new PersonalizacionTcPage(page);
  const datosPersonalesPage = new DatosPersonalesPage(page);
  const datosEconomicosPage = new DatosEconomicosPage(page);
  const datosEconomicosOtrosIngresosPage = new DatosEconomicosOtrosIngresosPage(page);
  const datosEnviosPage = new DatosEnviosPage(page);
  const encuestaSatisfaccionPage = new EncuestaSatisfaccionPage(page);
  const footer = new FooterComponent(page, context);

  // --- Flujo de Cliente Existente ---

  await test.step('1. Navegar a página de inicio', async () => {
    await home.goto();
    await home.validarPortal();
    await home.esperarHeroCargado();
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('Página de inicio', { body: screenshot, contentType: 'image/png' });
  });

  await test.step('2. Iniciar solicitud de tarjeta', async () => {
    await page.waitForTimeout(2000);
    await home.empezarSolicitud();
    await page.waitForTimeout(2000);
    await home.validarRedireccionFormulario();
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('Solicitud iniciada', { body: screenshot, contentType: 'image/png' });
  });

  await test.step('3. Ingresar DPI y continuar', async () => {
    await inicio.ingresarDPI(datos.cliente1.dpi);
    await inicio.clicContinuar();
    await inicio.validarRedireccionFormulario();
    await footer.validateVisible();
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('DPI ingresado', { body: screenshot, contentType: 'image/png' });
  });

  await test.step('4. Seleccionar tipo de tarjeta', async () => {
    await seleccion.seleccionarMC();
    await seleccion.clickSiguiente();
    await seleccion.validarRedireccionFormulario();
    await footer.validateVisible();
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('Tipo de tarjeta seleccionado', { body: screenshot, contentType: 'image/png' });
  });

  await test.step('5. Llenar datos generales', async () => {
    await datosGenerales.clickSiguiente();
    await datosGenerales.llenarFormulario({
      email: datos.cliente1.email,
      numeroCelular: datos.cliente1.numeroCelular,
      nit: datos.cliente1.nit,
      fecha: datos.cliente1.fecha,
    });
    await datosGenerales.clickContinuar();
    await datosGenerales.validarRedireccionFormulario();
    await footer.validateVisible();
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('Datos generales completados', { body: screenshot, contentType: 'image/png' });
  });

  await test.step('6. Iniciar escaneo biométrico', async () => {
    await instruccionOnboarding.clickIniciarEscaneo();
    await instruccionOnboarding.validarRedireccionFormulario();
    await footer.validateVisible();
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('Escaneo biométrico iniciado', { body: screenshot, contentType: 'image/png' });
  });

  await test.step('7. Completar onboarding biométrico', async () => {
    await onboarding.consumirOnboarding(
      urlVideo,
      templateRawPath,
      bestImageTokenizedPath,
      bestImagePath,
      apiRequestContext
    );
    await onboarding.irAFormularioOferta();
    await footer.validateVisible();
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('Onboarding biométrico completado', { body: screenshot, contentType: 'image/png' });
  });

  await test.step('8. Aceptar oferta', async () => {
    await aceptarOfertaPage.aceptarTerminos();
    await aceptarOfertaPage.clickAceptarOferta();
    await aceptarOfertaPage.validarRedireccionFormulario();
    await footer.validateVisible();
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('Oferta aceptada', { body: screenshot, contentType: 'image/png' });
  });

  await test.step('9. Personalizar tarjeta', async () => {
    await personalizacionTcPage.llenarFormulario({ alias: datos.cliente1.Alias });
    await personalizacionTcPage.clickContinuar();
    await personalizacionTcPage.validarRedireccionFormulario();
    await footer.validateVisible();
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('Tarjeta personalizada', { body: screenshot, contentType: 'image/png' });
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
    await footer.validateVisible();
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('Datos personales completados', { body: screenshot, contentType: 'image/png' });
  });

  await test.step('11. Ingresar datos económicos', async () => {
    await datosEconomicosPage.ingresosMensuales(datos.cliente1.IngresoMensual);
    await datosEconomicosPage.gastosMensuales(datos.cliente1.GastoMensual);
    await datosEconomicosPage.seleccionarOtrosIngresos();
    await datosEconomicosPage.clickGuardarContinuar();
    await footer.validateVisible();
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('Datos económicos completados', { body: screenshot, contentType: 'image/png' });
  });

  await test.step('12. Ingresar otros ingresos', async () => {
    await datosEconomicosOtrosIngresosPage.tipoDeFuenteOtros('Actividades profesionales');
    await datosEconomicosOtrosIngresosPage.clickGuardarOtrosIngresos();
    await footer.validateVisible();
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('Otros ingresos completados', { body: screenshot, contentType: 'image/png' });
  });

  await test.step('13. Confirmar datos de envío', async () => {
    await datosEnviosPage.clickContinuarEnvio();
    await footer.validateVisible();
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('Datos de envío confirmados', { body: screenshot, contentType: 'image/png' });
  });

  await test.step('14. Completar encuesta de satisfacción', async () => {
    await encuestaSatisfaccionPage.clickOmitirFinalizar();
    await page.waitForTimeout(2000);
    await footer.validateVisible();
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('Encuesta completada', { body: screenshot, contentType: 'image/png' });
  });

});
