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



    /**
     * Marca uno o varios checkboxes en la sección de datos económicos.
     * Recibe un array de textos tal y como aparecen en pantalla.
     * Esto permite alimentar la selección desde el data provider.
     */
    async seleccionarCheckboxes(labels: string[]) {
        for (const label of labels) {
            const checkbox = this.page.getByText(label);
            await checkbox.waitFor({ state: 'visible', timeout: 10000 });
            await checkbox.click();
        }
    }

    // métodos antiguos mantenidos por compatibilidad, delegan en el genérico
    async seleccionarOtrosIngresos() {
        await this.seleccionarCheckboxes(['Percibo otros ingresos']);
    }

    async seleccionarTrabajoEmpresa() {
        await this.seleccionarCheckboxes(['Trabajo en una empresa']);
    }

    async clickGuardarContinuar() {
        const btn = this.page.locator('#e2e_id_btn_form_economicos_guardar_continuar');
        await btn.waitFor({ state: 'visible', timeout: 10000 });
        await btn.click();
    }

}
