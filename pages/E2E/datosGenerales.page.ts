import { Page, expect } from "@playwright/test";

type DatosGeneralesInput = {
  email: string;
  numeroCelular: string;
  nit: string;
  // Puede ser 'DD/MM/YYYY', 'DD-MM-YYYY' o un Date
  fecha: string | Date;
};

export class DatosGeneralesPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickSiguiente() {
    // Ajusta el selector si el id difiere en tu vista real
    const btn = this.page.locator('#e2e_id_btn_requisitos_siguiente');
    await expect(btn).toBeVisible();
    await btn.click();
  }

  async llenarFormulario(datos: DatosGeneralesInput) {
    // --- Parseo de fecha seguro ---
    let dd: string, mm: string, yyyy: string;

    if (datos.fecha instanceof Date) {
      dd = String(datos.fecha.getDate()).padStart(2, '0');
      mm = String(datos.fecha.getMonth() + 1).padStart(2, '0'); // meses 0-11
      yyyy = String(datos.fecha.getFullYear());
    } else {
      const fechaStr = String(datos.fecha ?? '').trim();
      const partes = fechaStr.split(/[\/\-]/); // admite DD/MM/YYYY o DD-MM-YYYY
      if (partes.length !== 3) {
        throw new Error(`Formato de fecha inválido: "${fechaStr}". Usa "DD/MM/YYYY" o "DD-MM-YYYY".`);
      }
      const [d, m, y] = partes;
      dd = d.padStart(2, '0');
      mm = m.padStart(2, '0');
      yyyy = y.length === 2 ? (Number(y) >= 50 ? `19${y}` : `20${y}`) : y; // por si viene 'YY'
    }

    // --- Llenado de campos ---
    await this.page.getByLabel('Correo electrónico').fill(datos.email);
    await this.page.getByLabel('Número de celular').fill(datos.numeroCelular);
    await this.page.getByLabel('N.I.T.').fill(datos.nit);

    // Fecha por placeholders: DD / MM / YYYY
    await this.page.getByPlaceholder('DD').fill(dd);
    await this.page.getByPlaceholder('MM').fill(mm);
    await this.page.getByPlaceholder('YYYY').fill(yyyy);
  }

  async clickContinuar() {
    const btn = this.page.locator('#e2e_id_btn_preca_continuar');
    await expect(btn).toBeVisible();
    await btn.click();
  }
  async validarRedireccionFormulario() {
    await expect(this.page).toHaveURL(/.*\/instruccion-onboarding$/);
    }   
}