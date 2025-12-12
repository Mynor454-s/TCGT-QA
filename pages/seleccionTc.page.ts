import { Page, expect } from "@playwright/test";

export class seleccionTc {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async seleccionarVisa() {
        await this.page.getByText("Visa").click();
    }

        async seleccionarMC() {
        await this.page.getByText("MasterCard").click();
    }

    async clickSiguiente() {
        const btn = this.page.locator('#e2e_id_btn_seleccionmarca_continuar');
        await expect(btn).toBeVisible();
        await expect(btn).not.toHaveClass(/_disabled/); // Espera que se quite la clase de deshabilitado
        await btn.click();
    }

    async validarRedireccionFormulario() {
        await expect(this.page).toHaveURL(/\/cliente-digital\/informacion-general/);
    }
}
