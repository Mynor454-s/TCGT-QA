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
        await this.page.getByTestId('new-request-form-submit').click();
  }

    async validarRedireccionFormulario() {
      await expect(this.page).toHaveURL(/\/cliente-digital\/seleccion-tarjeta/);
    }
}
