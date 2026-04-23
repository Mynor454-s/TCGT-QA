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

    async obtenerTituloModal(): Promise<string | null> {
        const titulo = this.page.getByTestId('instruccion-onboarding-title');
        await titulo.waitFor({ state: 'visible', timeout: 10000 });
        return await titulo.textContent();
    }

    async obtenerSubtituloModal(): Promise<string | null> {
        const subtitulo = this.page.getByTestId('instruccion-onboarding-subtitle');
        await subtitulo.waitFor({ state: 'visible', timeout: 10000 });
        return await subtitulo.textContent();
    }

    async obtenerSrcImagenInstructiva(): Promise<string | null> {
        const imagen = this.page.getByTestId('instruccion-onboarding-image');
        await imagen.waitFor({ state: 'visible', timeout: 10000 });
        return await imagen.getAttribute('src');
    }

    async obtenerTextoBullets(): Promise<string[]> {
        const bullets = this.page.getByTestId('instruccion-onboarding-bullets');
        await bullets.waitFor({ state: 'visible', timeout: 10000 });
        const items = bullets.locator('li');
        const count = await items.count();
        const texts: string[] = [];
        for (let i = 0; i < count; i++) {
            const text = await items.nth(i).textContent();
            if (text) texts.push(text.trim());
        }
        return texts;
    }

    async esVisibleModalInstructivo(): Promise<boolean> {
        const titulo = this.page.getByTestId('instruccion-onboarding-title');
        return await titulo.isVisible();
    }
}