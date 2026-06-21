import { Page, Expect } from "@playwright/test";
export class EncuestaSatisfaccionPage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async clickOmitirFinalizar() {
        const link = this.page.getByText('Omitir y finalizar');
        await link.waitFor({ state: 'visible', timeout: 10000 });
        await link.click();
    }

}