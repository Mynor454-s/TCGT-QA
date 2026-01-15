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
}