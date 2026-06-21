import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/E2E/home.page';
import { HomePageBusiness } from '../pages/B2C/home.page';
import { DashboardPageBusiness } from '../pages/B2C/dashboard.page';
import { InicioFlujoPage } from '../pages/E2E/inicioFlujo.page';
import { SeleccionTcPage } from '../pages/E2E/seleccionTc.page';
import { DatosGeneralesPage } from '../pages/E2E/datosGenerales.page';
import { OnboardingPage } from '../pages/E2E/onboarding.page';
import { InstruccionOnboardingPage } from '../pages/E2E/instruccionOnboarding.page';
import { AceptarOfertaPage } from '../pages/E2E/aceptarOferta.page';
import { PersonalizacionTcPage } from '../pages/E2E/personalizacionTc.page';
import { DatosPersonalesPage } from '../pages/E2E/datosPersonales.page';
import { DatosEconomicosPage } from '../pages/E2E/datosEconomicos.page';
import { DatosEconomicosOtrosIngresosPage } from '../pages/E2E/otrosIngresos.page';
import { DatosEnviosPage } from '../pages/E2E/datosDeEnvio.page';
import { EncuestaSatisfaccionPage } from '../pages/E2E/encuestaSatisfaccion.page';
import { FooterComponent } from '../components/footer.component';
import { EmpezarSolicitudBusinessPage } from '../pages/B2C/empezarSolicitud.page';
import { FormDatosGeneralesPage } from '../pages/B2C/formDatosGenerales.page';
import { InstruccionOnboardingBusinessPage } from '../pages/B2C/instruccionOnboardingBusiness.page';
import { OnboardingBusinessPage } from '../pages/B2C/onboardingBusiness.page';
import { ColoresPage } from '../pages/E2E/TCJ/colores.page';
import { EmpresaIngresosPage } from '../pages/E2E/empresaIngresos.page';
import { NegocioPropioPage } from '../pages/E2E/negocioPropio.page';
import { CreacionBelPage } from '../pages/E2E/creacionBel.page';
import { ModalErrorFacePhiPage } from '../pages/B2C/modalErrorFacePhi.page';

/**
 * Fixtures personalizados para inyectar automáticamente las páginas
 * en todos los tests. Evita tener que instanciar manualmente.
 * 
 * Uso:
 * import { test, expect } from '../fixtures/baseTest';
 * 
 * test('mi test', async ({ page, homePage, inicioPage }) => {
 *   // homePage e inicioPage ya están instanciados
 *   await homePage.goto();
 * });
 */
type CustomFixtures = {
  homePage: HomePage;
  homePageBusiness: HomePageBusiness;
  dashboardPageBusiness: DashboardPageBusiness;
  formDatosGeneralesPage: FormDatosGeneralesPage;
  inicioPage: InicioFlujoPage;
  seleccionPage: SeleccionTcPage;
  datosGeneralesPage: DatosGeneralesPage;
  onboardingPage: OnboardingPage;
  instruccionOnboardingPage: InstruccionOnboardingPage;
  aceptarOfertaPage: AceptarOfertaPage;
  personalizacionTcPage: PersonalizacionTcPage;
  datosPersonalesPage: DatosPersonalesPage;
  datosEconomicosPage: DatosEconomicosPage;
  datosEconomicosOtrosIngresosPage: DatosEconomicosOtrosIngresosPage;
  datosEnviosPage: DatosEnviosPage;
  encuestaSatisfaccionPage: EncuestaSatisfaccionPage;
  footerComponent: FooterComponent;
  empezarSolicitudBusinessPage: EmpezarSolicitudBusinessPage;
  instruccionOnboardingBusinessPage: InstruccionOnboardingBusinessPage;
  onboardingBusinessPage: OnboardingBusinessPage;
  colorsPage: ColoresPage;
  empresaIngresosPage: EmpresaIngresosPage;
  negocioPropioPage: NegocioPropioPage;
  creacionBelPage: CreacionBelPage;
  modalErrorFacePhiPage: ModalErrorFacePhiPage;
};

export const test = base.extend<CustomFixtures>({
  // Inyectar mock de cámara en BrowserStack (no tiene cámara física)
  page: async ({ page }, use) => {
    if (process.env.BROWSERSTACK_BUILD_NAME || process.env.BROWSERSTACK_USERNAME) {
      await page.addInitScript({ path: './fixtures/fakeCameraInitScript.js' });
    }
    await use(page);
  },

  // Auto-instanciar todas las páginas
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  
  homePageBusiness: async ({ page }, use) => {
    await use(new HomePageBusiness(page));
  },
  dashboardPageBusiness: async ({ page }, use) => {
    await use(new DashboardPageBusiness(page));
  },
  
  
  inicioPage: async ({ page }, use) => {
    await use(new InicioFlujoPage(page));
  },
  
  seleccionPage: async ({ page }, use) => {
    await use(new SeleccionTcPage(page));
  },
  
  datosGeneralesPage: async ({ page }, use) => {
    await use(new DatosGeneralesPage(page));
  },
  
  onboardingPage: async ({ page }, use) => {
    await use(new OnboardingPage(page));
  },
  
  instruccionOnboardingPage: async ({ page }, use) => {
    await use(new InstruccionOnboardingPage(page));
  },
  
  aceptarOfertaPage: async ({ page }, use) => {
    await use(new AceptarOfertaPage(page));
  },
  
  personalizacionTcPage: async ({ page }, use) => {
    await use(new PersonalizacionTcPage(page));
  },
  
  datosPersonalesPage: async ({ page }, use) => {
    await use(new DatosPersonalesPage(page));
  },
  
  datosEconomicosPage: async ({ page }, use) => {
    await use(new DatosEconomicosPage(page));
  },
  
  datosEconomicosOtrosIngresosPage: async ({ page }, use) => {
    await use(new DatosEconomicosOtrosIngresosPage(page));
  },
  
  datosEnviosPage: async ({ page }, use) => {
    await use(new DatosEnviosPage(page));
  },
  
  encuestaSatisfaccionPage: async ({ page }, use) => {
    await use(new EncuestaSatisfaccionPage(page));
  },
  
  footerComponent: async ({ page, context }, use) => {
    await use(new FooterComponent(page, context));
  },
  empezarSolicitudBusinessPage: async ({ page }, use) => {
    await use(new EmpezarSolicitudBusinessPage(page));
  },
  formDatosGeneralesPage: async ({ page }, use) => {
    await use(new FormDatosGeneralesPage(page));
  },
  instruccionOnboardingBusinessPage: async ({ page }, use) => {
    await use(new InstruccionOnboardingBusinessPage(page));
  },
  onboardingBusinessPage: async ({ page }, use) => {
    await use(new OnboardingBusinessPage(page));
  },
  colorsPage: async ({ page }, use) => {
    await use(new ColoresPage(page));
  },
  empresaIngresosPage: async ({ page }, use) => {
    await use(new EmpresaIngresosPage(page));
  },
  negocioPropioPage: async ({ page }, use) => {
    await use(new NegocioPropioPage(page));
  },
  creacionBelPage: async ({ page }, use) => {
    await use(new CreacionBelPage(page));
  },
  modalErrorFacePhiPage: async ({ page }, use) => {
    await use(new ModalErrorFacePhiPage(page));
  },

});


export { expect };
