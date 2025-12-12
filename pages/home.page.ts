// pages/home.page.ts
import { Page, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    // Si el 401 ocurre aquí, con httpCredentials ya no verás Unauthorized
    await this.page.goto('/cliente-digital/inicio');
  }

  async validarPortal() {
    await expect(this.page).toHaveTitle(/Tarjeta/i);
  }



  async empezarSolicitud() {
    await this.page.locator('#e2e_id_btn_empezarsol_header').click();
  }

  async validarRedireccionFormulario() {
    await expect(this.page).toHaveURL(/\/cliente-digital\/inicio-flujo/);
  }
}
