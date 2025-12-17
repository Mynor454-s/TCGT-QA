import { expect, Page, BrowserContext } from '@playwright/test';

export class FooterComponent {
  constructor(
    private page: Page,
    private context: BrowserContext
  ) {}

  // Getters para locators (mejor práctica que propiedades)
  private get logo() {
    // Selector más específico para el logo del footer
    return this.page.locator('img[alt="logo"][src*="logo-banco-industrial-blanco.svg"]').last();
  }

  private get termsLink() {
    return this.page.getByText('Términos y condiciones');
  }

  private get copyright() {
    return this.page.locator('text=/© \\d{4} Corporación Bi\\./');
  }

  async validateVisible() {
    await expect(this.logo).toBeVisible();
    await expect(this.termsLink).toBeVisible();
    await expect(this.copyright).toBeVisible();
  }

  async validateTermsLinkOpensNewTab() {
    const [newPage] = await Promise.all([
      this.context.waitForEvent('page', { timeout: 10000 }),
      this.termsLink.click(),
    ]);

    await newPage.waitForLoadState('domcontentloaded', { timeout: 30000 });

    // Validación de URL
    await expect(newPage).toHaveURL(/terminos|condiciones/i);

    // Validar contenido
    await expect(
      newPage.getByText(/términos y condiciones/i)
    ).toBeVisible({ timeout: 10000 });

    await newPage.close();
  }
}
