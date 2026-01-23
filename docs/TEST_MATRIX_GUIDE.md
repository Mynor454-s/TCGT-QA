# Test Matrix - Data-Driven Testing Guide

## Concepto

En lugar de hardcodear datos en los tests, usamos `test-matrix.json` como fuente central de configuración. Esto permite:

- **Centralización**: Todos los datasets están en la matriz
- **Escalabilidad**: Agregar nuevos datos no requiere cambios en el código
- **Mantenibilidad**: Un solo lugar para gestionar configuraciones
- **Trazabilidad**: Cada escenario tiene su configuración documentada

## Estructura del Data Provider

### Formato en test-matrix.json

```json
{
  "id": "E2E-001",
  "dataProvider": "data/data_new_client.json:cliente1"
}
```

**Formato**: `path/to/file.json:key`

- `path/to/file.json` - Ruta relativa al archivo de datos
- `key` - Llave específica dentro del JSON (opcional)

### Opciones de configuración

#### 1. Dataset único
```json
"dataProvider": "data/data_new_client.json:cliente1"
```
Ejecuta el test con solo `cliente1`

#### 2. Todos los datasets (wildcard)
```json
"dataProvider": "data/data_new_client.json:*"
```
Ejecuta el test con **todos** los clientes del archivo (`cliente1`, `cliente2`, etc.)

#### 3. Sin data provider
```json
"dataProvider": null
```
El test no requiere datos externos

## Uso en Tests

### Importar utilidad

```typescript
import { getTestDatasets } from '../../../utils/testMatrixRunner';
```

### Obtener datasets por scenario ID

```typescript
// Obtiene todos los datasets configurados para E2E-001
const datasets = getTestDatasets('E2E-001');

// Si dataProvider es "data/data_new_client.json:*"
// Retorna: [
//   { name: 'cliente1', data: {...} },
//   { name: 'cliente2', data: {...} }
// ]

// Si dataProvider es "data/data_new_client.json:cliente1"
// Retorna: [
//   { name: 'cliente1', data: {...} }
// ]
```

### Crear tests data-driven

```typescript
datasets.forEach(({ name, data }) => {
  test(`flujo completo - ${name}`, async ({ page, homePage }) => {
    // Usar data.Usuario, data.dpi, etc.
    await homePage.IngresarUsuario(data.Usuario);
  });
});
```

## Ejemplos Prácticos

### Ejemplo 1: Validaciones de DPI

```json
{
  "id": "VAL-001",
  "name": "Validaciones de DPI",
  "dataProvider": "data/validations/dpi-validations.json:*",
  "cases": 5
}
```

**Archivo**: `data/validations/dpi-validations.json`
```json
{
  "caso_vacio": {
    "input": "",
    "expectedError": "El DPI es requerido"
  },
  "caso_corto": {
    "input": "123456",
    "expectedError": "Debe tener 13 dígitos"
  },
  "caso_letras": {
    "input": "123ABC7890123",
    "expectedError": "Solo se permiten números"
  },
  "caso_especiales": {
    "input": "1234-567890-12",
    "expectedError": "No se permiten caracteres especiales"
  },
  "caso_valido": {
    "input": "2933870952212",
    "expectedError": null
  }
}
```

**Test**:
```typescript
import { getTestDatasets } from '../../../utils/testMatrixRunner';

const datasets = getTestDatasets('VAL-001');

datasets.forEach(({ name, data }) => {
  test(`DPI validation - ${name}`, async ({ datosGeneralesPage }) => {
    await datosGeneralesPage.IngresarDpi(data.input);
    
    if (data.expectedError) {
      await expect(page.getByText(data.expectedError)).toBeVisible();
    } else {
      await expect(page.getByText('Error')).not.toBeVisible();
    }
  });
});
```

### Ejemplo 2: Flujos E2E con múltiples clientes

```json
{
  "id": "E2E-001",
  "name": "Flujo completo - Cliente nuevo exitoso",
  "dataProvider": "data/data_new_client.json:*",
  "notes": "Ejecuta con todos los clientes disponibles"
}
```

Genera automáticamente:
- ✅ flujo completo - cliente1
- ✅ flujo completo - cliente2
- ✅ flujo completo - clienteN

### Ejemplo 3: Combinaciones económicas

```json
{
  "id": "EC-001",
  "name": "Ingresos altos - Gastos bajos",
  "dataProvider": "data/economic-combinations.json:alto_bajo"
}
```

**Archivo**: `data/economic-combinations.json`
```json
{
  "alto_bajo": {
    "ingreso": "15000",
    "gasto": "5000",
    "expectedOffer": "high"
  },
  "bajo_alto": {
    "ingreso": "5000",
    "gasto": "15000",
    "expectedOffer": "rejected"
  },
  "medio_medio": {
    "ingreso": "8000",
    "gasto": "7000",
    "expectedOffer": "medium"
  }
}
```

## Ventajas vs forEach Hardcodeado

### ❌ Antes (No mantenible)
```typescript
const clientes = [
  { nombre: 'Cliente 1', data: datos.cliente1, dpi: datos.cliente1.dpi },
  { nombre: 'Cliente 2', data: datos.cliente2, dpi: datos.cliente2.dpi }
];

clientes.forEach(({ nombre, data, dpi }) => {
  test(`flujo completo ${nombre}`, async ({ page }) => {
    // ...
  });
});
```

**Problemas**:
- Datos hardcodeados en el test
- Agregar cliente requiere modificar código
- No hay trazabilidad con la matriz

### ✅ Ahora (Mantenible)
```typescript
const datasets = getTestDatasets('E2E-001');

datasets.forEach(({ name, data }) => {
  test(`flujo completo - ${name}`, async ({ page }) => {
    // ...
  });
});
```

**Ventajas**:
- Solo modificar `data_new_client.json` para agregar clientes
- No tocar el código del test
- Centralizado en test-matrix.json
- Documentado y trazable

## Funciones Disponibles

### `getTestDatasets(scenarioId)`
Obtiene todos los datasets configurados para un escenario.

```typescript
const datasets = getTestDatasets('E2E-001');
// Retorna: Array<{ name: string, data: any }>
```

### `getScenarioById(scenarioId)`
Obtiene la configuración completa de un escenario.

```typescript
const scenario = getScenarioById('E2E-001');
// Retorna: { id, name, priority, dataProvider, tags, ... }
```

### `getScenariosByCategory(category)`
Obtiene todos los escenarios de una categoría.

```typescript
const e2eTests = getScenariosByCategory('e2e-flows');
// Retorna: Array de escenarios E2E
```

### `getScenariosByTags(tags)`
Filtra escenarios por tags.

```typescript
const smokeTests = getScenariosByTags(['@smoke', '@P0']);
// Retorna: Todos los tests con esos tags
```

### `loadTestData(dataProvider)`
Carga datos directamente desde un dataProvider string.

```typescript
const data = loadTestData('data/data_new_client.json:cliente1');
// Retorna: Objeto con datos de cliente1
```

## Migrando Tests Existentes

### Paso 1: Actualizar test-matrix.json
```json
{
  "id": "E2E-001",
  "dataProvider": "data/data_new_client.json:*"
}
```

### Paso 2: Reemplazar forEach hardcodeado
```typescript
// Eliminar esto:
// const clientes = [...]

// Agregar esto:
import { getTestDatasets } from '../../../utils/testMatrixRunner';
const datasets = getTestDatasets('E2E-001');
```

### Paso 3: Adaptar el forEach
```typescript
datasets.forEach(({ name, data }) => {
  test(`flujo completo - ${name}`, async ({ ... }) => {
    // Código del test sin cambios
  });
});
```

## Best Practices

1. **Usar wildcard (*) para tests repetitivos**: Si el test debe ejecutarse con todos los datos
2. **Usar key específica para casos únicos**: Si el test necesita un dataset particular
3. **Documentar en notes**: Explicar qué hace cada dataProvider
4. **Mantener datos en archivos separados**: No mezclar validaciones con datos de E2E
5. **Nombres descriptivos**: `cliente1`, `caso_vacio`, `alto_bajo` son más claros que `c1`, `v1`

## Troubleshooting

### Error: "Data file not found"
- Verificar que la ruta en `dataProvider` sea correcta
- Las rutas son relativas a la raíz del proyecto

### Error: "Key not found in file"
- Verificar que la key existe en el JSON
- Usar `*` si quieres todos los keys

### No se generan tests
- Verificar que `getTestDatasets()` retorna datos
- Console.log para debuggear: `console.log(datasets)`

### Ejecuta solo un cliente cuando debería ejecutar todos
- Verificar que uses `:*` en el dataProvider
- Ejemplo: `data/data_new_client.json:*`
