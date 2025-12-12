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

// Configuración de Jira - puedes moverlo a variables de entorno
const JIRA_TEST_RUN_ID = '68f17023e9feefa15739a858'; // Cambia esto por tu ID
const JIRA_URL = process.env.JIRA_URL || 'https://tu-jira.atlassian.net';
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
  const urlVideo = 'https://regional-shared-test.s3.us-east-1.amazonaws.com/gtm/individual/a0f4ffc5-4795-45a7-b9a8-48631b0550ee/passiveliveness/passivelivenessvideo_1764773558.mp4?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECkaCXVzLWVhc3QtMSJGMEQCIBvkNwkEv%2BHHffZ%2FbRGdGnpGXH%2FVOFup64gduodg6yhoAiBVv6l4TpFrg30rrbatreNAXm8FC1QsEtAqWAoIw6VinSrKBAjx%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAEaDDM2MjU3MTU4OTQyNyIMya5HR6vHqN49zN5aKp4ENyja0kjeNrOqvhNTV1y%2FYUva5OfjrOudDgpiSGZOa7QxHUe%2FIQDZSbgndbr25psIxt36SVIOFkJCAfP3G%2F1seoPTPVE%2FSjWc7pCmHEr5WXmYoBqror%2BMOZ11K34xXSYZ7%2BG8IaJt2PafFVKYXujei8pnU7DYMUDpevSIOW9q2W1zqR%2B5VjDWYS21PnE3IMNXwwvEUoowhWFK%2BmEMRL1DF3n6khcK%2B9jKYEf%2BxsgkcISQzZQObch0lR7HV%2Bt7hUc5GinlOWX1CMKDCyVJy0zO8Y607gSlC%2Bdobz%2BIq1Jgg9UJtkjFbS8HwGbOxzdmlU4Fjuk814W0hSlXPapLtEWRXiqnj9JGVXM%2FW13TjsMxgRCVTmr6xXMpbqEOIHZeem8kaMRdZUGyFRjcE6INuFCWFAse7ITrRC5rYGnkYDTbAYTtS2MixoZuuub13qOO1GgvW4dDYSOlj0KUz7vndi6OUMQSW2y5yfDib5JH4wccEVj7ByEp1OIuKpiADmns1llOYoISxZHUhPSqj7KndjrQchkMSCvIR5IePAy1hyxVk7vw2ubnROoUkQhHKlApdFtOM2ozjnUYMmYr4S%2BrZFi4zXVV6eEYRJSEl4TdnKtx8sg2aGjjmEISycye%2Bhr0Zb%2BckJ6Fve3QnyHzrNuaH4yAy4Rpdf5WG7ezpw1UU5X1xn3LcIMM2S9I7sV1z0bg8UR8yKXpWJc15gO%2Bx8pmIfowt9vryQY6xALy%2FrExwdmECkcRsz2udw17aFcjCJoqDx%2BVnJAer07A%2B6DSXa6JWUiRh3A60elVNFJrlcD%2B2NsZsZBQttFelSFq0XRuo8wJcRDdkIkhksoxXAnqLGO1v3l6KITR4U6xHqAGh7AZmNHPr2OWuRKBkVbuHXa%2FfEjCdeCgKGINdEF0CxPWgbHGf07YeQHoJOk0edobjZOTc4DQWXM6rTph5VViMmZ9T5aZauAXybJdMQRx2MI8FEF9DUqCbc81fGCqxvyYTHWWJCOnxgpNK320z1NU9zIrpiIF%2BwNGIJbCNh%2FG4rWPmubjo54mFD8tVrHYCKkMsHte7guVd%2Fdw98QKLK8IK4RwaEgMmVeKK4iv93lydCt66GwBocTCm%2FSMq05uV008hDWQ291G7axfmLVvUCFknYFg0VWj%2B7WfWaMSgEW0XqR3TLw%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAVI2XTM4Z7QFOIPUJ%2F20251211%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251211T161500Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=df4f8c86031ab9f42284bb983634a59fd211bb731a2e672844e05f2cd0658a6d';
  const templateRawPath = 'assets/templateraw_1760545131.txt';
  const bestImageTokenizedPath = 'assets/imagetokenized_1760545130.txt';
  const bestImagePath = 'assets/facialcontent_1760545127.jpeg';
  const apiRequestContext = await request.newContext();
  const instruccionOnboarding = new InstruccionOnboardingPage(page);
  const aceptarOfertaPage = new AceptarOfertaPage(page);
  const personalizacionTcPage = new PersonalizacionTcPage(page);
  const datosPersonalesPage = new DatosPersonalesPage(page);


  await home.goto();
  await home.validarPortal();
  await home.empezarSolicitud();
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

  await page.pause();

});
