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

test('flujo completo Cliente Existente', async ({ page, context }) => {
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

  // --- Flujo de Cliente Existente ---

  await home.goto();
  await page.waitForTimeout(2000);
  await home.validarPortal();
  await page.waitForTimeout(2000);
  await home.empezarSolicitud();
  await page.waitForTimeout(2000);

  await home.validarRedireccionFormulario();

  await inicio.ingresarDPI(datos.cliente1.dpi);
  await inicio.clicContinuar();
  await inicio.validarRedireccionFormulario();

  await seleccion.seleccionarMC();
  await seleccion.clickSiguiente();
  await seleccion.validarRedireccionFormulario();

  await datosGenerales.clickSiguiente();
  await datosGenerales.llenarFormulario({
    email: datos.cliente1.email,
    numeroCelular: datos.cliente1.numeroCelular,
    nit: datos.cliente1.nit,
    fecha: datos.cliente1.fecha,
  });

  await datosGenerales.clickContinuar();
  await datosGenerales.validarRedireccionFormulario();
  await instruccionOnboarding.clickIniciarEscaneo();
  await instruccionOnboarding.validarRedireccionFormulario();


  // --- Paso de Onboarding biométrico ---

  await onboarding.consumirOnboarding(
    urlVideo,
    templateRawPath,
    bestImageTokenizedPath,
    bestImagePath,
    apiRequestContext
  );
  await onboarding.validarRedireccionFormulario();
  await aceptarOfertaPage.aceptarTerminos();
  await aceptarOfertaPage.clickAceptarOferta();
  await aceptarOfertaPage.validarRedireccionFormulario();

  await personalizacionTcPage.llenarFormulario({ alias: datos.cliente1.Alias });
  await personalizacionTcPage.clickContinuar();
  await personalizacionTcPage.validarRedireccionFormulario();

  await datosPersonalesPage.seleccionarNivelEstudios('Sin estudios');
  await datosPersonalesPage.ingresarDependientes(1);
  await datosPersonalesPage.seleccionarOcupacion('Comercio Informal');
  await datosPersonalesPage.seleccionarDepartamento('Guatemala');
  await datosPersonalesPage.seleccionarMunicipio('Guatemala');
  await datosPersonalesPage.ingresarZona('1');
  await datosPersonalesPage.ingresarDireccion('Ciudad de Guatemala');
  await datosPersonalesPage.clickGuardarContinuar();


  await datosEconomicosPage.ingresosMensuales(datos.cliente1.IngresoMensual);
  await datosEconomicosPage.gastosMensuales(datos.cliente1.GastoMensual);
  await datosEconomicosPage.seleccionarOtrosIngresos();
  await datosEconomicosPage.clickGuardarContinuar();


  await datosEconomicosOtrosIngresosPage.tipoDeFuenteOtros('Actividades profesionales');
  await datosEconomicosOtrosIngresosPage.clickGuardarOtrosIngresos();

  await datosEnviosPage.clickContinuarEnvio();

  await encuestaSatisfaccionPage.clickOmitirFinalizar();
  await page.waitForTimeout(2000);

});
