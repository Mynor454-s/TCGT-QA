import { Page, expect } from "@playwright/test";
export class AceptarOfertaPage {
    readonly page: Page
    constructor(page: Page) {
        this.page = page;
    }

    async aceptarTerminos() {
        const checkbox = this.page.locator('#credit-application-term-and-conditions-checkbox.border-aqua-digital-300').first();
        await checkbox.waitFor({ state: 'visible', timeout: 20000 });
        await checkbox.click();
    }
    async clickAceptarOferta() {
        const btn = this.page.getByRole('button', { name: 'Siguiente' })
        await btn.click({ force: true });
    }
    async validarRedireccionFormulario() {
        await expect(this.page).toHaveURL(/.*\/personalizar-tarjeta$/);
    }
}
