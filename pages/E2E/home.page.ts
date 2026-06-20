// pages/home.page.ts
import { Page, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async setSessionStorageItem(key: string, value: string) {
    // Lo inyectamos antes de navegar para que esté disponible desde el primer render.
    await this.page.addInitScript(
      ([k, v]) => sessionStorage.setItem(k, v),
      [key, value]
    );

    // También lo seteamos en la página actual por si ya está cargada.
    await this.page.evaluate(
      ([k, v]) => sessionStorage.setItem(k, v),
      [key, value]
    );
  }

  async setAppMaintenance(value: '0' | '1' = '1') {
    await this.setSessionStorageItem('app-maintenance', value);
  }

  async setSourceChannel(value: string)
  {
    await this.setSessionStorageItem ('utm-source', value);
  }
    async setAppLive(value: '0' | '1' | string = '1') {
    await this.setSessionStorageItem('tc-liv', value);
  }

  async goto() {
    await this.page.goto('/cliente-digital/inicio');
  }

  async validarPortal() {
    await expect(this.page).toHaveTitle(/Tarjeta/i);
  }

  async esperarHeroCargado() {
    const heroImage = this.page.locator('img[alt="home-principal"]');

    // Asegura que está en el DOM y visible
    await expect(heroImage).toBeVisible();

    // Esperar a que la imagen termine de cargar
    await heroImage.evaluate((img: HTMLImageElement) => {
      if (!img.complete) {
        return new Promise((resolve) => {
          img.addEventListener('load', () => resolve(true));
          img.addEventListener('error', () => resolve(false));
        });
      }
      return img.complete;
    });
  }



  async empezarSolicitud() {
    await this.page.locator('#e2e_id_btn_empezarsol1').click();
  }

  async validarRedireccionFormulario() {
    await expect(this.page).toHaveURL(/\/cliente-digital\/inicio-flujo/);
  }
}
