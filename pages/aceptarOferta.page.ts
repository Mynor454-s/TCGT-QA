import { Page, expect } from "@playwright/test";
export class AceptarOfertaPage {
    readonly page: Page
    constructor(page: Page) {
        this.page = page;
    }

    async aceptarTerminos() {
        // Usar .first() porque hay 2 checkboxes con el mismo testId
        const checkbox = this.page.getByTestId('offer-terms-checkbox').first();
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
    async validarRedireccionTCJ() {
        await expect(this.page).toHaveURL(/.*\/cliente-digital\/tcj\/instruccion-onboarding$/);
    }
}
