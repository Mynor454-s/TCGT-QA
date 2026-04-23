import { test, expect } from '../../../../fixtures/baseTest';
import { request } from '@playwright/test';
import { ScreenshotHelper } from '../../../../fixtures/testHelpers';
import { getTestDatasets } from '../../../../utils/testMatrixRunner';
import { resolveOnboardingVideoUrl } from '../../../../utils/s3SignedUrl';
import { ClienteTestData, OFERTA_URL } from '../../../../utils/testConfig';

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
const datasets = getTestDatasets<ClienteTestData>('E2E-002');

// Permite que cada dataset (cada test generado) se ejecute en paralelo dentro de este archivo.

// Ejecutar el test para cada dataset
datasets.forEach(({ name, data }) => {
  test(`flujo completo - ${name} @E2E-002`, async ({
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
    footerComponent,
    colorsPage,
    empresaIngresosPage,
    negocioPropioPage
  }, testInfo) => {
    // Variables para onboarding
    const templateRawPath = data.assets?.templateRaw ;
    const bestImageTokenizedPath = data.assets?.bestImageTokenized ;
    const bestImagePath = data.assets?.bestImage ;

    const urlVideo = await resolveOnboardingVideoUrl({
      videoS3: data.assets?.videoS3,
      sourceVideoUrl: data.assets?.urlVideo,
      fallbackUrl: process.env.ONBOARDING_VIDEO_URL || '',
      defaultExpiresInSeconds: Number(process.env.S3_PRESIGN_EXPIRES_IN || 3600),
    });

    if (!urlVideo) {
      throw new Error(`[${name}] No se pudo resolver URL de video para onboarding`);
    }

    if (!templateRawPath || !bestImageTokenizedPath || !bestImagePath) {
      throw new Error(`[${name}] Faltan rutas de assets biométricos en el dataset`);
    }
    
    // API Request Context
    const apiRequestContext = await request.newContext({
      ignoreHTTPSErrors: true
    });

    // --- Flujo de Cliente Existente ---

    await test.step('1. Navegar a página de inicio', async () => {
      await homePage.goto();
      await homePage.setAppLive('"1154a4fbd048b28cf989da1e155cc27a031310a8ccc35d8fa4e6fe702d3d2bfd"');
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
      await page.waitForTimeout(10000);
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
      await onboardingPage.irAFormularioOferta(OFERTA_URL);
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Onboarding completado`);
    });

    await test.step('8. Aceptar oferta', async () => {
      await aceptarOfertaPage.aceptarTerminos();
      await aceptarOfertaPage.clickAceptarOferta();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Oferta aceptada`);
    });

    await test.step('9. Personalizar tarjeta', async () => {
      await colorsPage.seleccionarColor(data.cardColor!);
      await colorsPage.clickSiguienteColor();
      await colorsPage.llenarAlias(data.Alias);
      await colorsPage.clickSiguienteAlias();
      await colorsPage.seleccionarOpcionPorTexto(data.opcionLealtad!)
      await colorsPage.clickSiguienteLealtad();
      await colorsPage.seleccionarCategorias(data.categorias!);
      await colorsPage.clickSiguienteBeneficios();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Tarjeta personalizada`);
    });

    await test.step('10. Ingresar datos personales', async () => {
      await datosPersonalesPage.seleccionarNivelEstudios('Sin estudios');
      await datosPersonalesPage.ingresarDependientes(1);
      await datosPersonalesPage.seleccionarOcupacion('Comercio Informal');
      await datosPersonalesPage.seleccionarDepartamento('Jutiapa');
      await datosPersonalesPage.seleccionarMunicipio('Quesada');
      await datosPersonalesPage.ingresarZona('1');
      await datosPersonalesPage.ingresarDireccion('Ciudad de Guatemala');
      await datosPersonalesPage.clickGuardarContinuar();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Datos personales`);
    });

    await test.step('11. Ingresar datos económicos', async () => {
      await datosEconomicosPage.ingresosMensuales(data.IngresoMensual);
      await datosEconomicosPage.gastosMensuales(data.GastoMensual);
      await datosEconomicosPage.seleccionarCheckboxes(data.economicCheckboxes ?? []);
      await datosEconomicosPage.clickGuardarContinuar();
      await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Datos económicos`);
    });

    // 12. Llenar formularios según fuentes de ingreso seleccionadas
    if (data.empresa) {
      await test.step('12a. Datos de empresa', async () => {
        const e = data.empresa!;
        await empresaIngresosPage.llenarNombreEmpresa(e.nombre);
        await empresaIngresosPage.llenarNumeroEmpresa(e.numero);
        await empresaIngresosPage.llenarPuesto(e.puesto);
        await empresaIngresosPage.seleccionarCatalogo('Giro de negocio de la empresa', e.tipoEmpresa);
        await empresaIngresosPage.llenarActividadEmpresa(e.actividad);
        if (e.zona) {
          await empresaIngresosPage.llenarZona(e.zona);
        }
        if (e.direccion) {
          await empresaIngresosPage.llenarDireccion(e.direccion);
        }
        if (e.departamento) {
          await empresaIngresosPage.seleccionarCatalogo('Departamento', e.departamento);
        }
        if (e.municipio) {
          await empresaIngresosPage.seleccionarCatalogo('Municipio', e.municipio);
        }
        await empresaIngresosPage.clickGuardarEmpresa();
        await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Datos empresa`);
      });
    }

    if (data.negocioPropio) {
      await test.step('12b. Datos de negocio propio', async () => {
        const n = data.negocioPropio!;
        await negocioPropioPage.llenarNombreComercial(n.nombreComercial);
        if (n.fechaInscripcion) {
          await negocioPropioPage.llenarFechaInscripcion(n.fechaInscripcion);
        }
        await negocioPropioPage.seleccionarCatalogo('Giro de negocio de la empresa', n.giroNegocio);
        await negocioPropioPage.llenarActividad(n.actividad);
        if (n.departamento) {
          await negocioPropioPage.seleccionarCatalogo('Departamento', n.departamento);
        }
        if (n.municipio) {
          await negocioPropioPage.seleccionarCatalogo('Municipio', n.municipio);
        }
        if (n.zona) {
          await negocioPropioPage.llenarZona(n.zona);
        }
        if (n.direccion) {
          await negocioPropioPage.llenarDireccion(n.direccion);
        }
        await negocioPropioPage.clickGuardarContinuar();
        await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Negocio propio`);
      });
    }

    if (data.otrosIngresos) {
      await test.step('12c. Ingresar otros ingresos', async () => {
        const fuente = data.otrosIngresos!.fuente || 'Actividades profesionales';
        await datosEconomicosOtrosIngresosPage.tipoDeFuenteOtros(fuente);
        await datosEconomicosOtrosIngresosPage.clickGuardarOtrosIngresos();
        await ScreenshotHelper.takeAndAttach(page, testInfo, `[${name}] Otros ingresos`);
      });
    }

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
