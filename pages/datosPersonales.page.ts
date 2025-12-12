import { Page, expect } from "@playwright/test";
export class DatosPersonalesPage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }


    async seleccionarNivelEstudios(textoOpcion: string) {
        const input = this.page.getByRole('textbox', { name: 'Nivel de estudios' });
        await input.click();
        await this.page.waitForTimeout(500);
        const opcion = this.page.getByRole('button', { name: textoOpcion, exact: true });
        await opcion.click();
    }

    async seleccionarOcupacion(textoOpcion: string) {
        const input = this.page.getByRole('textbox', { name: '¿A qué te dedicas?' });
        await input.click();
        await this.page.waitForTimeout(500);
        const opcion = this.page.getByRole('button', { name: textoOpcion, exact: true });
        await opcion.click();
    }

    async seleccionarDepartamento(textoOpcion: string) {
        const input = this.page.getByRole('textbox', { name: 'Departamento de residencia' });
        await input.click();
        await this.page.waitForTimeout(500);
        const opcion = this.page.getByRole('button', { name: textoOpcion, exact: true });
        await opcion.click();
    }

    async seleccionarMunicipio(textoOpcion: string) {
        const input = this.page.getByRole('textbox', { name: 'Municipio de residencia' });
        await input.click();
        await this.page.waitForTimeout(500);
        const opcion = this.page.getByRole('button', { name: textoOpcion, exact: true });
        await opcion.click();
    }

    async ingresarDependientes(numero: number) {
        const input = this.page.getByRole('textbox', { name: '¿Cuántas personas dependen de' }).first();
        await input.fill(numero.toString());
    }
}