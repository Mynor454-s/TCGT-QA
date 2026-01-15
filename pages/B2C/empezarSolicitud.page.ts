import { Page, expect } from "@playwright/test";
export class EmpezarSolicitudBusinessPage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async validarEmpezarSolicitudB2C() {
        await expect(this.page).toHaveURL(/.*\/comercio\/panel\/inicio-solicitud/);
    }

    async ingresarDPI(dpi: string) {
        await this.page.getByTestId('new-request-form-dpi').fill(dpi);
    }

    async clickEmpezarSolicitudB2C() {
        const btn = this.page.getByTestId('new-request-form-submit');
        await btn.waitFor({ state: 'visible', timeout: 10000 });
        await btn.click();
    }
    
}