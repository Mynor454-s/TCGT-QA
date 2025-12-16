import { Page, Expect } from "@playwright/test";
export class DatosEconomicosPage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async ingresosMensuales(ingreso: string) {
        const input = this.page.getByPlaceholder('Ej: 3,500');
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await input.click();
        await input.fill(ingreso);
    }

    async gastosMensuales(gasto: string) {
        const input = this.page.getByPlaceholder('Ej: 1,500');
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await input.click();
        await input.fill(gasto);
    }

    async seleccionarOtrosIngresos() {
        const checkbox = this.page.getByText('Percibo otros ingresos');
        await checkbox.waitFor({ state: 'visible', timeout: 10000 });
        await checkbox.click();
    }

    async clickGuardarContinuar() {
        const btn = this.page.locator('#e2e_id_btn_form_economicos_guardar_continuar');
        await btn.waitFor({ state: 'visible', timeout: 10000 });
        await btn.click();
    }

}
