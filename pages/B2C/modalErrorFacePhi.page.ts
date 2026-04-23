import { Page } from "@playwright/test";

export class ModalErrorFacePhiPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    async obtenerTituloModal(): Promise<string | null> {
        const titulo = this.page.getByTestId('facephi-error-modal-title');
        await titulo.waitFor({ state: 'visible', timeout: 10000 });
        return await titulo.textContent();
    }

    async obtenerTextoBody(): Promise<string | null> {
        const body = this.page.getByTestId('facephi-error-modal-body');
        await body.waitFor({ state: 'visible', timeout: 10000 });
        return await body.textContent();
    }

    async obtenerTextoBoton(): Promise<string | null> {
        const boton = this.page.getByTestId('facephi-error-modal-button');
        await boton.waitFor({ state: 'visible', timeout: 10000 });
        return await boton.textContent();
    }

    async clickBotonListo(): Promise<void> {
        const boton = this.page.getByTestId('facephi-error-modal-button');
        await boton.waitFor({ state: 'visible', timeout: 10000 });
        await boton.click();
    }

    async esVisibleModal(): Promise<boolean> {
        const titulo = this.page.getByTestId('facephi-error-modal-title');
        return await titulo.isVisible();
    }
}
