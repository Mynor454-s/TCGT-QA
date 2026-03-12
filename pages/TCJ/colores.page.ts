import { Page, expect } from "@playwright/test";
export class ColoresPage {
    readonly page: Page
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Selecciona un color en la paleta.
     * Acepta un identificador (para data-testid) o un valor de color (rgb/hex).
     */
    async seleccionarColor(color: string) {
        // primer intento: buscar por testid si existe
        const testIdLocator = this.page.getByTestId(`color-option-${color.toLowerCase()}`);
        if (await testIdLocator.count()) {
            await testIdLocator.waitFor({ state: 'visible', timeout: 10000 });
            await testIdLocator.click();
            return;
        }

        // imagen sin data-testid: construimos selector usando el estilo interno
        const rgb = this.normalizeColor(color);
        const buttonLocator = this.page.locator(
            `button:has(div.color-inner-shadow[style*="background-color: ${rgb}"])`
        );
        await buttonLocator.waitFor({ state: 'visible', timeout: 10000 });
        await buttonLocator.click();
    }


    async clickSiguienteColor() {
        const siguienteButton = this.page.locator('#e2e_id_btn_customtj_color_siguiente');
        await siguienteButton.waitFor({ state: 'visible', timeout: 10000 });
        await siguienteButton.click();
    }


    async llenarAlias(alias: string) {
        // preferimos placeholder si está presente
        const aliasInput = this.page.locator(
            'input[placeholder="Elige el alias para tu tarjeta"]'
        );
        // fallback genérico por clase si no existe el placeholder
        if (!(await aliasInput.count())) {
            const byClass = this.page.locator(
                'input.bi-text-input-box-transparent'
            );
            await byClass.waitFor({ state: 'visible', timeout: 10000 });
            await byClass.fill(alias);
            return;
        }

        await aliasInput.waitFor({ state: 'visible', timeout: 10000 });
        await aliasInput.fill(alias);
    }

    async clickSiguienteAlias() {
        const siguiente = this.page.locator('#e2e_id_btn_customtj_alias_siguiente');
        await siguiente.waitFor({ state: 'visible', timeout: 10000 });
        await siguiente.click();
    }

    /**
     * Selecciona una opción de pago/radio-button por el texto visible dentro del botón.
     * Útil para botones que no tienen atributos id o testid, como el caso de "Reembolso".
     *
     * @param label Texto que aparece en el div interno (e.g. "Reembolso").
     */
    async seleccionarOpcionPorTexto(label: string) {
        const button = this.page.locator(`button:has-text("${label}")`);
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await button.click();
    }

    async seleccionarCategorias(categorias: string[]) {
        for (const cat of categorias) {
            const option = this.page.locator(`app-form-checkbox:has-text("${cat}")`);
            await option.waitFor({ state: 'visible', timeout: 10000 });
            // click en el propio elemento <a> para activar el checkbox
            await option.click();
        }
    }
    async clickSiguienteLealtad() {
        const siguiente = this.page.locator('#e2e_id_btn_customtj_beneficios_siguiente');
        await siguiente.waitFor({ state: 'visible', timeout: 10000 });
        await siguiente.click();
    }

    async clickSiguienteBeneficios() {
        const siguiente = this.page.locator('#e2e_id_btn_customtj_multiplicador_siguiente');
        await siguiente.waitFor({ state: 'visible', timeout: 10000 });
        await siguiente.click();
    }




    private normalizeColor(color: string): string {
        color = color.trim();
        if (color.startsWith('#')) {
            const hex = color.substring(1);
            const bigint = parseInt(hex, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return `rgb(${r}, ${g}, ${b})`;
        }
        return color;
    }
}