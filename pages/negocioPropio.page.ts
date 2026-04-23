import { Page } from '@playwright/test';

/**
 * Page Object para el formulario de "Tengo negocio propio"
 * en la sección de datos económicos.
 *
 * Campos:
 * - Nombre comercial
 * - Fecha de inscripción (DD/MM/YYYY)
 * - Giro de negocio de la empresa (dropdown)
 * - Actividad
 * - Departamento (dropdown)
 * - Municipio (dropdown)
 * - Zona
 * - Dirección
 */
export class NegocioPropioPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async llenarNombreComercial(nombre: string) {
    const input = this.page.getByPlaceholder('Ingresa nombre de la empresa');
    await input.waitFor({ state: 'visible', timeout: 10000 });
    await input.click();
    await input.fill(nombre);
  }

  async llenarFechaInscripcion(fecha: string) {
    const partes = fecha.split(/[\/\-]/);
    if (partes.length !== 3) {
      throw new Error(`Formato de fecha inválido: "${fecha}". Usa "DD/MM/YYYY".`);
    }
    const [dd, mm, yyyy] = partes;

    // Usar el contenedor del campo de fecha para evitar ambigüedad con otros placeholders DD/MM/YYYY
    const fechaContainer = this.page.getByRole('textbox', { name: 'Fecha de inscripción de la' }).locator('..');
    await fechaContainer.getByPlaceholder('DD').fill(dd.padStart(2, '0'));
    await fechaContainer.getByPlaceholder('MM').fill(mm.padStart(2, '0'));
    await fechaContainer.getByPlaceholder('YYYY').fill(yyyy);
  }

  async seleccionarCatalogo(fieldLabel: string, opcion: string) {
    const dropdownInput = this.page.getByRole('textbox', { name: fieldLabel });
    await dropdownInput.waitFor({ state: 'visible', timeout: 10000 });
    await dropdownInput.click();

    const item = this.page.getByText(opcion, { exact: true });
    await item.waitFor({ state: 'visible', timeout: 10000 });
    await item.scrollIntoViewIfNeeded();
    await item.click();
  }

  async llenarActividad(actividad: string) {
    const input = this.page.getByPlaceholder('Escribe la actividad');
    await input.waitFor({ state: 'visible', timeout: 10000 });
    await input.click();
    await input.fill(actividad);
  }

  async llenarZona(zona: string) {
    const input = this.page.getByPlaceholder('Ingresa un número');
    await input.waitFor({ state: 'visible', timeout: 10000 });
    await input.click();
    await input.fill(zona);
  }

  async llenarDireccion(direccion: string) {
    const input = this.page.getByPlaceholder('Ingresa la dirección');
    await input.waitFor({ state: 'visible', timeout: 10000 });
    await input.click();
    await input.fill(direccion);
  }

  async clickGuardarContinuar() {
    const btn = this.page.locator('#e2e_id_btn_form_economicos_propio_guardar_continuar');
    await btn.waitFor({ state: 'visible', timeout: 10000 });
    await btn.click();
  }
}
