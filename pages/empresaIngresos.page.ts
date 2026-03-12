import { Page, Expect } from "@playwright/test";
export class EmpresaIngresosPage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async llenarNombreEmpresa(nombre: string) {
        // el placeholder real es diferente al usado originalmente
        const input = this.page.getByPlaceholder('Ingresa el nombre de la empresa');
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await input.click();
        await input.fill(nombre);
    }

    /**
     * Completa el campo de número de empresa (formato "0000 - 0000").
     * Se basa en el placeholder ya que no hay data-testid.
     */
    async llenarNumeroEmpresa(numero: string) {
        const input = this.page.getByPlaceholder('0000 - 0000');
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await input.click();
        await input.fill(numero);
    }

    /**
     * Completa el campo del puesto en la sección de datos de la empresa.
     * Usa el placeholder porque el input no tiene identificadores propios.
     */
    async llenarPuesto(puesto: string) {
        const input = this.page.getByPlaceholder('Escribe tu puesto');
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await input.click();
        await input.fill(puesto);
    }
    
    /**
     * Selecciona una opción de un dropdown tipo catálogo.
     * Hace click en el input (placeholder "Selecciona una opción"),
     * espera el menú y elige la opción por texto exacto.
     */
    /**
     * Selecciona una opción de un dropdown tipo catálogo.
     *
     * @param fieldLabel Nombre accesible del campo (ej. 'Giro de negocio de la empresa',
     *                    'Departamento', 'Municipio').
     * @param opcion Valor que se desea elegir dentro del menú.
     */
    async seleccionarCatalogo(fieldLabel: string, opcion: string) {
        // Usar el role 'textbox' + nombre accesible para distinguir entre varios inputs.
        const dropdownInput = this.page.getByRole('textbox', { name: fieldLabel });
        await dropdownInput.waitFor({ state: 'visible', timeout: 10000 });
        await dropdownInput.click();
        // algunos catálogos despliegan una lista no construida con botones; buscamos
        // cualquier elemento de texto visible que contenga la opción exacta.
        const item = this.page.getByText(opcion, { exact: true });
        await item.waitFor({ state: 'visible', timeout: 10000 });
        // si está fuera de vista (scroll), movemos antes de hacer click
        await item.scrollIntoViewIfNeeded();
        await item.click();
    }

    /**
     * Llena el campo de actividad de la empresa.
     */
    async llenarActividadEmpresa(actividad: string) {
        const input = this.page.getByPlaceholder('Escribe la actividad');
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await input.click();
        await input.fill(actividad);
    }

    /**
     * Llena el campo de zona (input numérico).
     */
    async llenarZona(zona: string) {
        const input = this.page.getByPlaceholder('Ingresa un número');
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await input.click();
        await input.fill(zona);
    }

    /**
     * Llena el campo de dirección.
     */
    async llenarDireccion(direccion: string) {
        const input = this.page.getByPlaceholder('Ingresa la dirección');
        await input.waitFor({ state: 'visible', timeout: 10000 });
        await input.click();
        await input.fill(direccion);
    }

    /**
     * Clic en el botón "Guardar y continuar" de la sección Depencia/Empresa.
     */
    async clickGuardarEmpresa() {
        const btn = this.page.locator('#e2e_id_btn_form_economicos_dependencia_guardar_continuar');
        await btn.waitFor({ state: 'visible', timeout: 10000 });
        await btn.click();
    }

}
