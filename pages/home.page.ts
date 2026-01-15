// pages/home.page.ts
import { Page, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
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
