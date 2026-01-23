# Data-Driven Testing con Test Matrix - Resumen Ejecutivo

## 🎯 Problema Identificado

El enfoque de forEach con datos hardcodeados no es mantenible:

```typescript
// ❌ NO MANTENIBLE
const clientes = [
  { nombre: 'Cliente 1', data: datos.cliente1, dpi: datos.cliente1.dpi },
  { nombre: 'Cliente 2', data: datos.cliente2, dpi: datos.cliente2.dpi }
];
```

**Problemas**:
- Agregar clientes requiere modificar el código del test
- No hay centralización de configuración
- Difícil de escalar a decenas o cientos de casos

## ✅ Solución Implementada

### 1. Utilidad Test Matrix Runner
**Archivo**: `utils/testMatrixRunner.ts`

Funciones principales:
- `getTestDatasets(scenarioId)` - Obtiene datasets configurados en test-matrix.json
- `loadTestData(dataProvider)` - Carga datos desde archivo JSON
- `getScenarioById(id)` - Obtiene configuración de escenario
- `getScenariosByTags(tags)` - Filtra por tags (@smoke, @P0, etc.)

### 2. Configuración en Test Matrix
**Archivo**: `data/test-matrix.json`

```json
{
  "id": "E2E-001",
  "dataProvider": "data/data_new_client.json:*",
  "notes": "Usa * para ejecutar con todos los clientes"
}
```

**Formatos soportados**:
- `:cliente1` - Dataset específico
- `:*` - Todos los datasets del archivo
- `null` - Sin datos externos

### 3. Implementación en Tests
**Archivo**: `tests/flows/happypath/flujoCompletoClienteMatrixDriven.spec.ts`

```typescript
import { getTestDatasets } from '../../../utils/testMatrixRunner';

const datasets = getTestDatasets('E2E-001');

datasets.forEach(({ name, data }) => {
  test(`flujo completo - ${name}`, async ({ page, homePage }) => {
    // Usar data sin cambios
    await homePage.IngresarUsuario(data.Usuario);
  });
});
```

## 📊 Comparativa

| Aspecto | forEach Hardcodeado | Test Matrix Runner |
|---------|---------------------|-------------------|
| **Mantenibilidad** | ❌ Baja - Cambios en código | ✅ Alta - Solo JSON |
| **Escalabilidad** | ❌ Difícil para >10 casos | ✅ Fácil para 100+ casos |
| **Centralización** | ❌ Datos dispersos | ✅ test-matrix.json |
| **Trazabilidad** | ❌ No documentado | ✅ Cada escenario documentado |
| **Agregar datos** | ❌ Modificar código | ✅ Solo agregar a JSON |

## 🚀 Ventajas

### 1. Mantenibilidad
Para agregar un nuevo cliente:
1. Agregar cliente3 a `data/data_new_client.json`
2. Listo - El test lo detecta automáticamente (si usa `:*`)

### 2. Centralización
Todo configurado en un solo lugar:
```json
{
  "id": "E2E-001",
  "name": "Flujo completo - Cliente nuevo exitoso",
  "dataProvider": "data/data_new_client.json:*",
  "tags": ["@smoke", "@P0"],
  "priority": "P0",
  "status": "implemented"
}
```

### 3. Flexibilidad
```typescript
// Todos los datasets
const datasets = getTestDatasets('E2E-001'); // cliente1, cliente2, ...

// Solo smoke tests
const smokeTests = getScenariosByTags(['@smoke']);

// Solo P0
const criticalTests = getScenariosByPriority(['P0']);
```

### 4. Reutilización
La misma utilidad sirve para:
- Flujos E2E completos
- Validaciones de campos
- Combinaciones económicas
- Tests de componentes

## 📝 Archivos Creados

1. **utils/testMatrixRunner.ts** - Utilidad principal
2. **tests/flows/happypath/flujoCompletoClienteMatrixDriven.spec.ts** - Ejemplo E2E
3. **docs/TEST_MATRIX_GUIDE.md** - Documentación completa
4. **README.md** - Actualizado con sección de Data-Driven Testing

## 🔄 Migración desde forEach

### Paso 1: Configurar test-matrix.json
```json
{
  "id": "E2E-001",
  "dataProvider": "data/data_new_client.json:*"
}
```

### Paso 2: Reemplazar en el test
```typescript
// Eliminar
// const clientes = [...]

// Agregar
import { getTestDatasets } from '../../../utils/testMatrixRunner';
const datasets = getTestDatasets('E2E-001');
```

### Paso 3: Adaptar forEach
```typescript
// Cambiar
// clientes.forEach(({ nombre, data, dpi }) => {

// Por
datasets.forEach(({ name, data }) => {
  test(`flujo completo - ${name}`, async ({ ... }) => {
    // Código sin cambios
  });
});
```

## 📖 Uso Avanzado

### Ejemplo 1: Validaciones de DPI
```json
{
  "id": "VAL-001",
  "dataProvider": "data/validations/dpi-validations.json:*"
}
```

```typescript
const datasets = getTestDatasets('VAL-001');

datasets.forEach(({ name, data }) => {
  test(`DPI validation - ${name}`, async ({ page }) => {
    await datosGeneralesPage.IngresarDpi(data.input);
    
    if (data.shouldFail) {
      await expect(page.getByText(data.expectedError)).toBeVisible();
    }
  });
});
```

### Ejemplo 2: Combinaciones Económicas
```json
{
  "id": "EC-001",
  "dataProvider": "data/economic-combinations.json:*"
}
```

### Ejemplo 3: Solo un dataset específico
```json
{
  "id": "E2E-TCJ",
  "dataProvider": "data/data_new_client.json:cliente1"
}
```

## 🎓 Best Practices

1. **Usar `:*` para tests repetitivos** - Ejecuta con todos los datos
2. **Nombres descriptivos** - `cliente1`, `caso_vacio`, `alto_bajo`
3. **Documentar en notes** - Explicar propósito del dataProvider
4. **Separar archivos de datos** - validations/, clients/, economic/
5. **Tags consistentes** - @smoke, @P0, @validation

## 🔍 Troubleshooting

### No se generan tests
```typescript
// Debug
const datasets = getTestDatasets('E2E-001');
console.log('Datasets encontrados:', datasets.length);
console.log('Datos:', datasets);
```

### Error "Data file not found"
- Verificar ruta en dataProvider
- Las rutas son relativas a la raíz del proyecto

### Solo ejecuta un cliente cuando debería ejecutar todos
- Verificar que uses `:*` en el dataProvider
- Ejemplo correcto: `data/data_new_client.json:*`

## 📚 Documentación Adicional

- **Guía completa**: [docs/TEST_MATRIX_GUIDE.md](docs/TEST_MATRIX_GUIDE.md)
- **README principal**: [README.md](README.md) - Sección "Data-Driven Testing"
- **Archivo matriz**: [data/test-matrix.json](data/test-matrix.json)

## 🎉 Conclusión

Esta solución te permite:
- ✅ Escalar a cientos de casos sin tocar código
- ✅ Mantener todo centralizado en test-matrix.json
- ✅ Agregar datos solo modificando JSON
- ✅ Documentar y trazar cada escenario
- ✅ Ejecutar por tags, prioridades o categorías
