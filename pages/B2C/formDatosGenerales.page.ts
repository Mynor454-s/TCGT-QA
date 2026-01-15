import { Page, expect } from "@playwright/test";

export class FormDatosGeneralesPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    /**
     * Convierte fecha de formato dd/mm/aaaa a yyyy-mm-dd (formato ISO para inputs tipo date)
     * @param fecha - Fecha en formato dd/mm/aaaa (Ej: "15/01/2020")
     * @returns Fecha en formato yyyy-mm-dd (Ej: "2020-01-15")
     */
    private convertirFechaAISO(fecha: string): string {
        const [dia, mes, anio] = fecha.split('/');
        return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }
    
    async validarFDG() {
        await expect(this.page).toHaveURL(/.*\/comercio\/panel\/formulario-precalificacion/);
    }
    
    async llenadorFormulario(datos: { 
        dpi: string; 
        numeroCelular: string;  // Coincide con el JSON
        email: string;          // Coincide con el JSON
        nit: string;
        fechaInicioTrabajo: string; 
    }) {
        const emailInput = this.page.getByTestId('general-information-form-email');
        await emailInput.waitFor({ state: 'visible', timeout: 10000 });
        await emailInput.fill(datos.email);  // Cambio: correo -> email
        
        const phoneInput = this.page.getByTestId('general-information-form-phone-number');
        await phoneInput.waitFor({ state: 'visible', timeout: 10000 });
        await phoneInput.fill(datos.numeroCelular);  // Cambio: telefono -> numeroCelular
        
        const nitInput = this.page.getByTestId('general-information-form-nit');
        await nitInput.waitFor({ state: 'visible', timeout: 10000 });
        await nitInput.fill(datos.nit);
        
        // Llenar fecha convirtiendo al formato ISO
        const fechaInput = this.page.getByTestId('general-information-form-start-date-work');
        await fechaInput.waitFor({ state: 'visible', timeout: 10000 });
        const fechaISO = this.convertirFechaAISO(datos.fechaInicioTrabajo);
        await fechaInput.fill(fechaISO);
    }
    async clickContinuarFDG() {
        const btn = this.page.getByTestId('general-information-form-submit');
        await btn.waitFor({ state: 'visible', timeout: 10000 });
        await btn.click();
    }
}