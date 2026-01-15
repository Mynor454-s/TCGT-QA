# 🚀 Automatización Playwright - TDCGT

Proyecto de automatización de pruebas E2E para Tarjeta Digital usando Playwright con TypeScript.

## 📋 Tabla de Contenidos

- [Prerequisitos](#prerequisitos)
- [Instalación](#instalación)
- [Configuración de Ambientes](#configuración-de-ambientes)
- [Ejecución de Tests](#ejecución-de-tests)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Buenas Prácticas](#buenas-prácticas)

---

## 🔧 Prerequisitos

- **Node.js**: v18 o superior
- **npm**: v9 o superior
- **Git**: Para clonar el repositorio

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Instalar navegadores de Playwright
npx playwright install
```

---

## 🌍 Configuración de Ambientes

El proyecto soporta múltiples ambientes: **QA** y **STG**

### Archivos de Configuración

- `.env.qa` - Configuración para ambiente QA (por defecto)
- `.env.stg` - Configuración para ambiente STG

### Variables de Ambiente

Cada archivo `.env.*` contiene:
- `BASE_URL` - URL base del ambiente
- `B2C_LOGIN_PATH` - Ruta del login B2C
- `BASIC_AUTH_USER` y `BASIC_AUTH_PASS` - Credenciales HTTP Basic Auth
- URLs de APIs (OCR, Onboarding)
- Credenciales de BrowserStack
- Configuración de Jira

---

## ▶️ Ejecución de Tests

### 🟢 Ejecutar en QA (por defecto)

```bash
# Todos los tests
npx playwright test

# Test específico
npx playwright test flujoCompletoCliente.spec.ts

# Solo Chrome
npx playwright test --project=Chrome

# Modo headed (ver el navegador)
npx playwright test --headed
```

### 🔵 Ejecutar en STG

#### En Git Bash (terminal bash):
```bash
ENV=stg npx playwright test

# Test específico
ENV=stg npx playwright test flujoCompletoB2CCliente.spec.ts --project=Chrome
```

#### En PowerShell:
```powershell
$env:ENV="stg"; npx playwright test

# Test específico
$env:ENV="stg"; npx playwright test flujoCompletoB2CCliente.spec.ts --project=Chrome
```

### 🎯 Tests Disponibles

#### Flujo B2B (Cliente Directo)
```bash
# QA
npx playwright test flujoCompletoCliente.spec.ts --project=Chrome

# STG
ENV=stg npx playwright test flujoCompletoCliente.spec.ts --project=Chrome
```

#### Flujo B2C (Comercios)
```bash
# QA
npx playwright test flujoCompletoB2CCliente.spec.ts --project=Chrome

# STG
ENV=stg npx playwright test flujoCompletoB2CCliente.spec.ts --project=Chrome
```

#### Tests de Validación
```bash
# Validación de DPI (7 test cases)
npx playwright test dpiValidation.spec.ts --project=Chrome
```

### 🔍 Modos de Ejecución

```bash
# Modo UI (interfaz interactiva)
npx playwright test --ui

# Modo debug (paso a paso)
npx playwright test --debug

# Ver reporte HTML
npx playwright show-report

# Ejecutar tests con tag específico
npx playwright test --grep @smoke
npx playwright test --grep @P0
```

---

## 🌐 BrowserStack

### Ejecutar en BrowserStack

```bash
# QA
npx browserstack-node-sdk playwright test

# STG
ENV=stg npx browserstack-node-sdk playwright test

# Test específico en STG
ENV=stg npx browserstack-node-sdk playwright test flujoCompletoB2CCliente.spec.ts
```

### Configuración BrowserStack

Ver configuración en `browserstack.yml`:
- Windows 11 + Firefox 119.0
- iOS 17 + iPhone 15 Pro (Safari)

---

## 📁 Estructura del Proyecto

```
Playwright/
├── .env.qa                      # Config ambiente QA
├── .env.stg                     # Config ambiente STG
├── playwright.config.ts         # Configuración Playwright
├── browserstack.yml            # Configuración BrowserStack
│
├── fixtures/
│   ├── baseTest.ts             # Fixtures con auto-inyección de pages
│   └── testHelpers.ts          # Helpers: TestSetup, Screenshot, Validation
│
├── pages/                      # Page Objects (B2B)
│   ├── home.page.ts
│   ├── inicioFlujo.page.ts
│   ├── seleccionTc.page.ts
│   ├── datosGenerales.page.ts
│   └── ...
│
├── pages/B2C/                  # Page Objects (B2C Comercios)
│   ├── home.page.ts
│   ├── dashboard.page.ts
│   ├── formDatosGenerales.page.ts
│   └── onboardingBusiness.page.ts
│
├── components/
│   └── footer.component.ts     # Componentes reutilizables
│
├── data/
│   ├── data_new_client.json    # Datos de prueba
│   ├── test-matrix.json        # Matriz de casos de prueba
│   └── validations/
│       └── dpi-validations.json
│
├── tests/
│   ├── flows/
│   │   └── happypath/
│   │       ├── flujoCompletoCliente.spec.ts      # E2E B2B
│   │       └── B2C/
│   │           └── flujoCompletoB2CCliente.spec.ts  # E2E B2C
│   └── validations/
│       └── datosGenerales/
│           └── dpiValidation.spec.ts
│
└── playwright-report/          # Reportes HTML generados
```

---

## ✨ Buenas Prácticas

### 1️⃣ Uso de Fixtures (Auto-inyección)

```typescript
import { test, expect } from '../fixtures/baseTest';

test('mi test', async ({ 
  page, 
  homePage,          // ✅ Auto-inyectado
  inicioPage,        // ✅ Auto-inyectado
  dashboardPageBusiness  // ✅ Auto-inyectado
}) => {
  await homePage.goto();
  // No necesitas hacer: const homePage = new HomePage(page)
});
```

### 2️⃣ Data-Driven Testing

```typescript
import datos from '../data/data_new_client.json';

// Usar datos del JSON
await formPage.llenadorFormulario(datos.cliente1);
```

### 3️⃣ Test Steps Organizados

```typescript
await test.step('1. Navegar a login', async () => {
  await page.goto('/login');
  await ScreenshotHelper.takeAndAttach(page, testInfo, 'Login page');
});
```

### 4️⃣ Tags para Organización

```typescript
test('flujo completo @smoke @e2e @P0', async ({ page }) => {
  // Test code
});

// Ejecutar solo smoke tests
// npx playwright test --grep @smoke
```

### 5️⃣ Helpers Reutilizables

```typescript
// Setup helpers
await TestSetup.irADatosGenerales(page, datos);

// Screenshot helpers
await ScreenshotHelper.takeAndAttach(page, testInfo, 'descripción');

// Validation helpers
await ValidationHelper.expectErrorMessage(errorMsg, expectedText);
```

---

## 📊 Reportes

Los reportes se generan automáticamente en:
- **HTML**: `playwright-report/index.html`
- **JSON**: `test-results/results.json`
- **JUnit**: `test-results/results.xml`

```bash
# Ver último reporte
npx playwright show-report
```

---

## 🐛 Troubleshooting

### Error: "BASE_URL is not defined"
- Verifica que el archivo `.env.qa` o `.env.stg` exista
- Ejecuta con la variable ENV correcta

### Error: "ApplicationUuid no encontrado"
- Verifica que el flujo previo haya completado correctamente
- El sessionStorage se limpia entre tests

### Error en BrowserStack iOS
- BrowserStack iOS no soporta `trace`
- BrowserStack iOS no soporta `ignoreHTTPSErrors: true`
- Usar autenticación mediante headers en lugar de httpCredentials

---

## 📞 Contacto

Para más información sobre el proyecto, contactar al equipo de QA.

---

## 📝 Notas Importantes

### Diferencias B2B vs B2C

| Característica | B2B (Cliente Directo) | B2C (Comercios) |
|----------------|----------------------|-----------------|
| **Login** | No requiere | Sí requiere (credenciales) |
| **Ruta inicio** | `/cliente-digital/inicio` | `/comercio/sitio/inicio-sesion` |
| **Onboarding** | Requiere setear sessionStorage | Solo envía JWT en headers |
| **Dashboard** | No aplica | Sí tiene dashboard |

### Ambientes

| Variable | QA | STG |
|----------|----|----|
| **BASE_URL** | `qa-tarjetadigital.incubadorabi.com` | `stg-tarjetadigital.incubadorabi.com` |
| **B2C_LOGIN_PATH** | `/cliente-digital/negocios/login` | `/comercio/sitio/inicio-sesion` |
| **AUTH_PASS** | `_cA=2&8(Om};HW2\`` | `ePzyn47?<od+v.YF` |

---

**Versión**: 1.0  
**Última actualización**: Enero 2026
