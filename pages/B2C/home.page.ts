import { Page, Expect } from "@playwright/test";
export class HomePageBusiness {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async IngresarUsuarioB2C(UsuarioB2C: string) {
        const input = this.page.getByTestId('login-page-business-card-form-user');
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await input.fill(UsuarioB2C);
    }
    async IngresarPasswordB2C(PasswordB2C: string) {
        const input = this.page.getByTestId('login-page-business-card-form-password');
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await input.fill(PasswordB2C);
    }
    async ClicBotonIngresarB2C() {
        const btn = this.page.getByTestId('login-page-business-form-btn-login');
        await btn.waitFor({ state: 'visible', timeout: 10000 });
        await btn.click();
    }

    async obtenerValorCampoUsuario(): Promise<string> {
        const input = this.page.getByTestId('login-page-business-card-form-user');
        return await input.inputValue();
    }

    async obtenerValorCampoPassword(): Promise<string> {
        const input = this.page.getByTestId('login-page-business-card-form-password');
        return await input.inputValue();
    }

    async obtenerPlaceholderUsuario(): Promise<string | null> {
        const input = this.page.getByTestId('login-page-business-card-form-user');
        return await input.getAttribute('placeholder');
    }

    async obtenerPlaceholderPassword(): Promise<string | null> {
        const input = this.page.getByTestId('login-page-business-card-form-password');
        return await input.getAttribute('placeholder');
    }

    async estaBotonLoginHabilitado(): Promise<boolean> {
        const btn = this.page.getByTestId('login-page-business-form-btn-login');
        return await btn.isEnabled();
    }

    async obtenerClasesCampoUsuario(): Promise<string | null> {
        const input = this.page.getByTestId('login-page-business-card-form-user');
        return await input.getAttribute('class');
    }

    async obtenerEstadoVisualCampo(testId: string): Promise<{ focused: boolean; filled: boolean; error: boolean }> {
        const input = this.page.getByTestId(testId);
        const classes = await input.getAttribute('class') || '';
        const value = await input.inputValue();
        return {
            focused: await input.evaluate(el => el === document.activeElement),
            filled: value.length > 0,
            error: classes.includes('ng-invalid') || classes.includes('error')
        };
    }
}