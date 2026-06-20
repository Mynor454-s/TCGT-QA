import { Page, Expect } from "@playwright/test";
export class DatosEnviosPage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async clickContinuarEnvio() {
        const btn = this.page.locator('#e2e_id_btn_form_envio_guardar_continuar');
        await btn.waitFor({ state: 'visible', timeout: 30000 });
        await btn.click();
    }
}
