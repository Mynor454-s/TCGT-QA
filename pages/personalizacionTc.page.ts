import {   expect, Page } from '@playwright/test';
import datos from '../data/data_new_client.json';
export class PersonalizacionTcPage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async llenarFormulario(datos: { alias: string; }) {
        const input = this.page.getByPlaceholder('Ej: Mynor').first();
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await input.fill(datos.alias);
    }
    async clickContinuar() {
        const btn = this.page.locator('#e2e_id_btn_customtc_continuar');
        await expect(btn).toBeVisible();
        await btn.click();
    }
    async validarRedireccionFormulario() {
        await expect(this.page).toHaveURL(/.*\/datos-personales$/);
    }
}