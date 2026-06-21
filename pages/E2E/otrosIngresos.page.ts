import { Page, Expect } from "@playwright/test";
export class DatosEconomicosOtrosIngresosPage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async tipoDeFuenteOtros(textoOpcion: string) {
        const dropdown = this.page.locator('a .icon-TCGTDrowdown_mobile').locator('..');
        await dropdown.waitFor({ state: 'visible', timeout: 10000 });
        await dropdown.click();
        await this.page.waitForTimeout(500);
        const opcion = this.page.getByRole('button', { name: textoOpcion, exact: true });
        await opcion.click();
    }

    async clickGuardarOtrosIngresos() {
        const btn = this.page.locator('#e2e_id_btn_form_economicos_otros_guardar_continuar');
        await btn.waitFor({ state: 'visible', timeout: 10000 });
        await btn.click();
    }
}
