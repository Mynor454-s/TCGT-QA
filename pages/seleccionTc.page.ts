import { Page, expect } from "@playwright/test";

export class seleccionTc {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async seleccionarVisa() {
        await this.page.getByText("Visa", { exact: true }).click();
    }

    async seleccionarMC() {
        // Usar exact: true para evitar seleccionar "Mastercard Liv"
        await this.page.getByRole('button', { name: /^Mastercard card card$/ }).click();
    }

    async seleccionarTCJ() {
        await this.page.getByRole('button', { name: 'Mastercard Liv card card' }).click();
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
