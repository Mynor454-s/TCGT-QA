import { Page, expect } from "@playwright/test";

export class DashboardPageBusiness {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    // Ejemplo de métodos - ajusta según tu aplicación
    async validarDashboard() {
        await expect(this.page).toHaveURL(/.*\/comercio\/panel\/solicitudes/);
    }

    async clickNuevaSolicitud() {
        const btn = this.page.getByTestId('panel-card-btn-new-request');
        await btn.waitFor({ state: 'visible', timeout: 10000 });
        await btn.click();
    }

    // Agrega más métodos según las interacciones del dashboard
}
