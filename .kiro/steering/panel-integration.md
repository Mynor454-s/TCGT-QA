# Integración con TCGT-QA-Panel

## Contexto

TCGT-QA-Panel es un panel web (Angular 21) que gestiona y ejecuta las automatizaciones de este proyecto. El panel necesita descubrir, listar y ejecutar los tests de TCGT-QA.

## Relación entre Proyectos

```
TCGT-QA (este proyecto)          TCGT-QA-Panel (panel web)
├── tests/                       ├── src/app/
├── pages/                       │   ├── core/services/mock/
├── data/                        │   └── features/
├── fixtures/                    └── ...
└── playwright.config.ts
```

- **TCGT-QA** contiene las automatizaciones (tests, page objects, data)
- **TCGT-QA-Panel** es el frontend que gestiona y ejecuta esas automatizaciones
- En v1, el panel usa datos mock. En el futuro, consumirá TCGT-QA directamente vía API o filesystem

## Cómo el Panel Descubre Tests

El panel ejecuta `npx playwright test --list` en el directorio de TCGT-QA y parsea la salida para obtener:
- Nombre del test
- Archivo .spec.ts
- Tags (@smoke, @e2e, @P0, @B2B, etc.)
- Prioridad (extraída del tag @P0-@P3)
- Flujo (extraído del tag @B2B/@B2C o ruta del archivo)

### Requisitos para que el Panel Detecte Tests Correctamente

1. **Cada test DEBE tener tags en el título** — El panel extrae metadata de los tags
2. **Tags obligatorios**: prioridad (@P0-@P3) + tipo (@e2e/@validation/@smoke) + flujo (@B2B/@B2C)
3. **El título debe ser descriptivo** — Se muestra directamente en el panel
4. **Los archivos deben estar en `tests/`** — El panel busca solo en ese directorio

## Cómo el Panel Ejecuta Tests

El panel construye comandos de Playwright basados en la selección del usuario:

```bash
# Por archivo
npx playwright test flujoCompletoCliente.spec.ts

# Por tag
npx playwright test --grep "@smoke"
npx playwright test --grep "@P0|@P1"

# Con ambiente
ENV=stg npx playwright test --grep "@smoke"

# Con BrowserStack
npx browserstack-node-sdk playwright test --grep "@smoke"
```

## Cómo el Panel Consume Data Providers

El panel lee directamente los archivos JSON de `data/`:
- `data/data_new_client.json` — Datasets de clientes
- `data/data_new_client_TCJ.json` — Datasets TCJ
- `data/test-matrix.json` — Registro de escenarios

### Formato Esperado de data_new_client.json
```json
{
  "NombreDataset": {
    "dpi": "string",
    "nombre": "string",
    "apellido": "string",
    "email": "string",
    "telefono": "string",
    ...
  }
}
```

### Formato Esperado de test-matrix.json
```json
{
  "scenarios": [
    {
      "id": "E2E-001",
      "name": "Descripción del escenario",
      "tags": ["@e2e", "@P0", "@B2B"],
      "dataProvider": "data_new_client.json",
      "datasets": ["Marcos", "Monther"]
    }
  ]
}
```

## Convenciones para Mantener Compatibilidad con el Panel

### Al Crear Nuevos Tests
1. Incluir tags completos en el título: `test('descripción @tipo @prioridad @flujo', ...)`
2. Registrar en `test-matrix.json` si es data-driven
3. Usar datasets existentes o crear nuevos en `data/`

### Al Modificar Data Providers
1. Mantener la estructura de objeto plano por key
2. No cambiar nombres de keys existentes sin actualizar test-matrix.json
3. Nuevos campos son aditivos (no rompen compatibilidad)

### Al Agregar Nuevos Flujos
1. Crear directorio en `tests/flows/happypath/NuevoFlujo/`
2. Crear page objects en `pages/NuevoFlujo/`
3. Usar un tag de flujo nuevo (ej: `@NuevoFlujo`)
4. El panel detectará automáticamente el nuevo tag

## Reportes

El panel espera encontrar reportes de Playwright en:
- `playwright-report/` — Reporte HTML
- `test-results/results.json` — Resultados JSON
- `test-results/results.xml` — Resultados JUnit

Estos se generan automáticamente por la configuración de `playwright.config.ts`.

## Variables de Ambiente Relevantes para el Panel

| Variable | Uso |
|----------|-----|
| `ENV` | Selecciona ambiente (qa/stg) |
| `BASE_URL` | URL base del ambiente |
| `BROWSERSTACK_USERNAME` | Credenciales BrowserStack |
| `BROWSERSTACK_ACCESS_KEY` | Credenciales BrowserStack |

## Futuro: API Backend

Cuando se implemente el backend del panel, TCGT-QA necesitará:
1. Un endpoint o script que retorne la lista de tests en formato JSON
2. Un endpoint para disparar ejecuciones y retornar el ID de run
3. Un endpoint para consultar estado de ejecución
4. Acceso a los reportes generados (servir archivos estáticos o subir a S3)
