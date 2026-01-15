import { Page, expect} from '@playwright/test';

export class InicioFlujoPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async ingresarDPI(dpi: string) {
    await this.page.getByTestId('new-request-form-dpi').fill(dpi);
  }

  async clicContinuar () {
        // Esperar a que no haya loaders activos
        await this.page.waitForSelector('app-loader', { state: 'hidden', timeout: 10000 }).catch(() => {});
        
        // Hacer clic en el botón
        await this.page.getByTestId('new-request-form-submit').click();
        
        // Esperar a que el loader del submit desaparezca
        await this.page.waitForSelector('app-loader', { state: 'hidden', timeout: 30000 }).catch(() => {});
  }

    async validarRedireccionFormulario() {
      await expect(this.page).toHaveURL(/\/cliente-digital\/seleccion-tarjeta/);
    }
}
