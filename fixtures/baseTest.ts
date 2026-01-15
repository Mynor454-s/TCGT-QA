import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { HomePageBusiness } from '../pages/B2C/home.page';
import { DashboardPageBusiness } from '../pages/B2C/dashboard.page';
import { InicioFlujoPage } from '../pages/inicioFlujo.page';
import { seleccionTc } from '../pages/seleccionTc.page';
import { DatosGeneralesPage } from '../pages/datosGenerales.page';
import { OnboardingPage } from '../pages/onboarding.page';
import { InstruccionOnboardingPage } from '../pages/instruccionOnboarding.page';
import { AceptarOfertaPage } from '../pages/aceptarOferta.page';
import { PersonalizacionTcPage } from '../pages/personalizacionTc.page';
import { DatosPersonalesPage } from '../pages/datosPersonales.page';
import { DatosEconomicosPage } from '../pages/datosEconomicos.page';
import { DatosEconomicosOtrosIngresosPage } from '../pages/otrosIngresos.page';
import { DatosEnviosPage } from '../pages/datosDeEnvio.page';
import { EncuestaSatisfaccionPage } from '../pages/encuestaSatisfaccion.page';
import { FooterComponent } from '../components/footer.component';
import { EmpezarSolicitudBusinessPage } from '../pages/B2C/empezarSolicitud.page';
import { FormDatosGeneralesPage } from '../pages/B2C/formDatosGenerales.page';
import { InstruccionOnboardingBusinessPage } from '../pages/B2C/instruccionOnboardingBusiness.page';
import { OnboardingBusinessPage } from '../pages/B2C/onboardingBusiness.page';

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
  seleccionPage: seleccionTc;
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
};

export const test = base.extend<CustomFixtures>({
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
    await use(new seleccionTc(page));
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
  }
});


export { expect };
