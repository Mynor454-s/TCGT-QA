import { Page, expect } from '@playwright/test';

export class CreacionBelPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Espera hasta 8s a que la URL sea /creacion-bel.
   * Si no navega ahí, devuelve false (la pantalla no aplica a este cliente).
   */
  async estaVisible(): Promise<boolean> {
    try {
      await this.page.waitForURL(/creacion-bel/, { timeout: 8000 });
      return true;
    } catch {
      return false;
    }
  }

  async ingresarNombreUsuario(username: string) {
    await this.page.locator('input[placeholder="Ej: ngalvez"]').fill(username);
  }

  async seleccionarCompania(compania: 'Tigo' | 'Claro') {
    // Los radio buttons usan id numérico (1=Tigo, 2=Claro), sin data-testid
    const radioId = compania === 'Tigo' ? '1' : '2';
    await this.page.locator(`input[type="radio"][id="${radioId}"]`).click();
  }

  async clickContinuar() {
    // Esperar a que el botón ya no tenga la clase disabled (requiere username + compañía)
    await this.page.locator('#e2e_id_btn_bel_continuar:not(.e2e_class_btn_bel_continuar_disabled)').waitFor({ state: 'visible', timeout: 10000 });
    await this.page.locator('#e2e_id_btn_bel_continuar').click();
    await this.page.waitForSelector('app-loader', { state: 'hidden', timeout: 30000 }).catch(() => {});
  }

  async llenarFormulario(username: string, compania: 'Tigo' | 'Claro' = 'Tigo') {
    await this.ingresarNombreUsuario(username);
    await this.seleccionarCompania(compania);
    await this.clickContinuar();
  }
}
