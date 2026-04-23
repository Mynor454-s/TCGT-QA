import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ScreenshotHelper } from '../../../fixtures/testHelpers';

// Cargar los valores esperados
const uiExpectedValues = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../data/ui-expected-values.json'), 'utf-8')
);

test.describe('Validación de Layout - Negocio Propio B2C @validation @ui @B2C', () => {
  test.beforeEach(async ({ page }) => {
    // TODO: La navegación completa hasta la sección de datos económicos con "negocio propio"
    // requiere completar el flujo de onboarding biométrico. Ajustar según el flujo real.
    // Por ahora, este test asume que se navega manualmente hasta la sección.
    
    const urlBase = process.env.BASE_URL || 'https://qa-url.com';
    await page.goto(`${urlBase}/comercio/sitio/inicio-sesion`);
    
    // Login
    const usuarioInput = page.getByTestId('login-page-business-card-form-user');
    await usuarioInput.waitFor({ state: 'visible', timeout: 10000 });
    await usuarioInput.fill('2933870952212');
    
    const passwordInput = page.getByTestId('login-page-business-card-form-password');
    await passwordInput.fill('21.Digital24.');
    
    const loginButton = page.getByTestId('login-page-business-form-btn-login');
    await loginButton.click();
    
    await page.waitForTimeout(3000);
    
    // NOTE: Navigation to negocio propio section requires completing the full B2C flow
    // including biometric onboarding. This test may need to be run after the full flow
    // or with a direct URL if available.
  });

  test('VAL-UI-LAYOUT-001: Validar posición vertical de campos fecha inscripción y nombre comercial @P2', async ({ page }, testInfo) => {
    const negocioData = uiExpectedValues.negocioPropio;
    
    // Obtener bounding box del campo nombre comercial
    const nombreComercial = page.getByTestId(negocioData.nombreComercial.testId);
    await nombreComercial.waitFor({ state: 'visible', timeout: 10000 });
    const boxNombre = await nombreComercial.boundingBox();
    expect(boxNombre).not.toBeNull();
    
    // Obtener bounding box del campo fecha inscripción
    const fechaInscripcion = page.getByTestId(negocioData.fechaInscripcion.testId);
    await fechaInscripcion.waitFor({ state: 'visible', timeout: 10000 });
    const boxFecha = await fechaInscripcion.boundingBox();
    expect(boxFecha).not.toBeNull();
    
    // Comparar coordenada Y con tolerancia de 10px
    const yDifference = Math.abs(boxNombre!.y - boxFecha!.y);
    expect(yDifference).toBeLessThanOrEqual(10);
    
    await ScreenshotHelper.takeAndAttach(page, testInfo, 'Layout Negocio Propio - Posición Vertical');
  });
});
