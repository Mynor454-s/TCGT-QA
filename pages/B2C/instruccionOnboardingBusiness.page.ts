import { Page, expect } from "@playwright/test";
export class InstruccionOnboardingBusinessPage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async clickIniciarEscaneo() {
        const btn = this.page.getByRole('button', { name: 'Iniciar escaneo' });
        await this.page.waitForTimeout(10000);
        await expect(btn).toBeVisible();
        await btn.click();
    }
    async validarRedireccionFormulario() {
        await expect(this.page).toHaveURL(/.*\/comercio\/panel\/instruccion-onboarding/);
    }
}