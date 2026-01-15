import { Page } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { InicioFlujoPage } from '../pages/inicioFlujo.page';
import { seleccionTc } from '../pages/seleccionTc.page';
import { DatosGeneralesPage } from '../pages/datosGenerales.page';
import datos from '../data/data_new_client.json';

/**
 * Helpers reutilizables para setup de tests.
 * Permite iniciar tests desde cualquier punto del flujo sin duplicar código.
 */
export class TestSetup {
  
  /**
   * Navegar a la página de inicio y validar que esté lista
   */
  static async irAHome(page: Page) {
    const home = new HomePage(page);
    await home.goto();
    await home.validarPortal();
    await home.esperarHeroCargado();
  }

  /**
   * Lleva el flujo hasta la página de inicio del formulario (inicio-flujo)
   */
  static async irAInicioFormulario(page: Page) {
    const home = new HomePage(page);
    await home.goto();
    await home.validarPortal();
    await home.esperarHeroCargado();
    await page.waitForTimeout(2000);
    await home.empezarSolicitud();
    await page.waitForTimeout(2000);
    await home.validarRedireccionFormulario();
  }

  /**
   * Lleva el flujo hasta la página de selección de tarjeta
   * @param page - Página de Playwright
   * @param dpi - DPI a usar (opcional, usa datos por defecto)
   */
  static async irASeleccionTarjeta(page: Page, dpi?: string) {
    await this.irAInicioFormulario(page);
    
    const inicio = new InicioFlujoPage(page);
    await inicio.ingresarDPI(dpi || datos.cliente1.dpi);
    await inicio.clicContinuar();
    await inicio.validarRedireccionFormulario();
  }

  /**
   * Lleva el flujo hasta la página de datos generales
   * @param page - Página de Playwright
   * @param dpi - DPI a usar (opcional)
   */
  static async irADatosGenerales(page: Page, dpi?: string) {
    await this.irASeleccionTarjeta(page, dpi);
    
    const seleccion = new seleccionTc(page);
    await seleccion.seleccionarMC();
    await seleccion.clickSiguiente();
    await seleccion.validarRedireccionFormulario();
  }

  /**
   * Lleva el flujo hasta la página de datos económicos
   * @param page - Página de Playwright
   * @param clienteData - Datos del cliente (opcional, usa datos por defecto)
   */
  static async irADatosEconomicos(page: Page, clienteData?: any) {
    const data = clienteData || datos.cliente1;
    
    await this.irADatosGenerales(page, data.dpi);
    
    const datosGenerales = new DatosGeneralesPage(page);
    await datosGenerales.clickSiguiente();
    await datosGenerales.llenarFormulario({
      email: data.email,
      numeroCelular: data.numeroCelular,
      nit: data.nit,
      fecha: data.fecha,
    });
    await datosGenerales.clickContinuar();
    await datosGenerales.validarRedireccionFormulario();
    
    // Completar onboarding biométrico (simplificado)
    // TODO: Implementar cuando sea necesario
  }

  /**
   * Helper para llenar un formulario dinámicamente desde un objeto
   * @param page - Página de Playwright
   * @param formData - Objeto con los datos del formulario
   */
  static async fillFormDynamically(page: Page, formData: Record<string, string>) {
    for (const [field, value] of Object.entries(formData)) {
      const locator = page.locator(`[name="${field}"]`);
      if (await locator.count() > 0) {
        await locator.fill(value);
      }
    }
  }
}

/**
 * Utilidades para screenshots en tests
 */
export class ScreenshotHelper {
  /**
   * Tomar y adjuntar screenshot con nombre descriptivo
   */
  static async takeAndAttach(page: Page, testInfo: any, name: string) {
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach(name, { 
      body: screenshot, 
      contentType: 'image/png' 
    });
  }
}

/**
 * Utilidades para validaciones comunes
 */
export class ValidationHelper {
  /**
   * Validar que un mensaje de error sea visible
   */
  static async expectErrorMessage(page: Page, message: string) {
    const { expect } = await import('@playwright/test');
    await expect(page.getByText(message)).toBeVisible({ timeout: 5000 });
  }

  /**
   * Validar que la URL contenga un patrón
   */
  static async expectUrlContains(page: Page, pattern: string | RegExp) {
    const { expect } = await import('@playwright/test');
    await expect(page).toHaveURL(pattern);
  }
}
