import { test, expect } from '../../../fixtures/baseTest';
import { TestSetup, ValidationHelper } from '../../../fixtures/testHelpers';
import validations from '../../../data/validations/dpi-validations.json';

/**
 * Tests de validaciones del campo DPI
 * Data-driven: Itera sobre múltiples casos de prueba desde JSON
 * 
 * Ejecutar solo estos tests:
 * npx playwright test dpiValidation.spec.ts
 * 
 * Ejecutar solo validaciones:
 * npx playwright test --grep @validation
 */
test.describe('Validaciones de DPI @validation @dpi @P0', () => {
  
  // Pre-condición: Navegar a la página antes de cada test
  test.beforeEach(async ({ page }) => {
    await TestSetup.irAInicioFormulario(page);
  });
  
  // Iterar sobre cada caso de validación
  validations.dpiCases.forEach(({ name, testId, input, expectedError, errorTestId, shouldFail, notes }) => {
    
    test(`${testId} - ${name}`, async ({ page, inicioPage }) => {
      
      // Llenar el campo DPI con el valor de prueba
      await inicioPage.ingresarDPI(input);
      
      // Intentar continuar
      await inicioPage.clicContinuar();
      
      if (shouldFail && expectedError && errorTestId) {
        // Caso negativo: Debe mostrar error y NO avanzar
        
        // 1. Validar que el mensaje de error sea visible (usa el testId del JSON)
        const errorMessage = page.getByTestId(errorTestId);
        await expect(errorMessage).toBeVisible({ timeout: 5000 });
        
        // 2. Validar el texto del mensaje
        await expect(errorMessage).toHaveText(expectedError);
        
        // 3. Validar que el input tenga clase de error
        const dpiInput = page.getByTestId('new-request-form-dpi');
        await expect(dpiInput).toHaveClass(/ng-invalid|invalid/);
        
        // 4. Verificar que sigue en la misma página
        await expect(page).toHaveURL(/inicio-flujo/);
        
      } else {
        // Caso positivo: Debe avanzar a la siguiente página
        await expect(page).toHaveURL(/seleccion-tarjeta/, { timeout: 10000 });
      }
    });
  });
});
