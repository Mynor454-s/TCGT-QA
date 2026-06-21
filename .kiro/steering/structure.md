# Project Structure

```
├── playwright.config.ts          # Playwright config (environments, reporters, browser)
├── package.json                  # Dependencies and npm scripts
├── tsconfig.json                 # TypeScript config (strict, ES2020, CommonJS)
├── .env.qa / .env.stg            # Environment-specific variables (gitignored)
│
├── fixtures/
│   ├── baseTest.ts               # Custom fixtures — auto-injects all page objects
│   └── testHelpers.ts            # Helpers: TestSetup, ScreenshotHelper, ValidationHelper
│
├── pages/
│   ├── E2E/                      # Page Objects (B2B / E2E flow)
│   │   ├── home.page.ts          # Landing page
│   │   ├── inicioFlujo.page.ts   # DPI entry
│   │   ├── seleccionTc.page.ts   # Card type selection
│   │   ├── datosGenerales.page.ts # General data form
│   │   ├── onboarding.page.ts    # Biometric onboarding
│   │   ├── aceptarOferta.page.ts # Offer acceptance
│   │   ├── personalizacionTc.page.ts # Card personalization
│   │   ├── datosPersonales.page.ts # Personal data
│   │   ├── datosEconomicos.page.ts # Economic data
│   │   ├── otrosIngresos.page.ts # Other income
│   │   ├── empresaIngresos.page.ts # Company/employer data
│   │   ├── negocioPropio.page.ts # Own business data
│   │   ├── datosDeEnvio.page.ts  # Shipping data
│   │   ├── encuestaSatisfaccion.page.ts # Satisfaction survey
│   │   ├── creacionBel.page.ts   # Bi en Línea user creation
│   │   ├── ocrPage.page.ts      # OCR document page
│   │   └── TCJ/                  # TCJ card variant pages
│   │       └── colores.page.ts   # Color selection
│   └── B2C/                      # Page Objects (B2C/merchant flow)
│       ├── home.page.ts          # B2C login page
│       ├── dashboard.page.ts     # Merchant dashboard
│       ├── empezarSolicitud.page.ts # Start application
│       ├── formDatosGenerales.page.ts
│       ├── instruccionOnboardingBusiness.page.ts
│       ├── onboardingBusiness.page.ts
│       └── modalErrorFacePhi.page.ts
│
├── components/                   # Reusable UI component objects
│   └── footer.component.ts
│
├── tests/
│   ├── E2E/                      # Tests del flujo B2B (cliente directo)
│   │   ├── regression/           # Flujos completos — se corren en cada deploy
│   │   │   ├── flujoCompletoCliente.spec.ts
│   │   │   ├── flujoCompletoClienteMatrixDriven.spec.ts
│   │   │   ├── flujoCompletoClienteMovil.spec.ts
│   │   │   └── TCJ/
│   │   │       ├── flujoCompletoClienteTCJ.spec.ts
│   │   │       └── flujoCompletoClienteTCJMatrixDriven.spec.ts
│   │   ├── stories/              # Tests de historias puntuales del sprint activo
│   │   │   └── TDCGI-2205.spec.ts
│   │   └── validations/          # Validaciones de campos y formularios
│   │       └── datosGenerales/
│   │           └── dpiValidation.spec.ts
│   └── B2C/                      # Tests del flujo B2C (comercios)
│       ├── regression/           # Flujos completos — se corren en cada deploy
│       │   ├── flujoCompletoB2CCliente.spec.ts
│       │   ├── flujoCompletoB2CClienteMatrixDriven.spec.ts
│       │   └── regresionSelphi551.spec.ts
│       └── validations/          # Validaciones UI del flujo B2C
│           ├── modal/
│           └── ui/
│
├── data/
│   ├── data_new_client.json      # Client datasets (keys: Marcos, Monther)
│   ├── data_new_client_TCJ.json  # TCJ client datasets
│   ├── test-matrix.json          # Central scenario registry + data-provider config
│   ├── ui-expected-values.json   # Expected UI labels, placeholders, error messages
│   ├── emails_test.json          # Test email addresses
│   └── validations/              # Validation-specific test data
│
├── utils/
│   ├── testConfig.ts             # Shared types (ClienteTestData) and constants (OFERTA_URL)
│   ├── testMatrixRunner.ts       # Data-driven utilities (reads test-matrix.json)
│   ├── jiraHelper.ts             # Jira test run status updates (not actively used)
│   └── s3SignedUrl.ts            # AWS S3 presigned URL generation for onboarding videos
│
├── assets/                       # Biometric test assets (gitignored, fetched from S3)
├── docs/                         # Project documentation
├── playwright-report/            # Generated HTML report (gitignored)
└── test-results/                 # JSON, JUnit, trace output (gitignored)
```

## Test Organization Philosophy

Tests are organized by **purpose**, not by when they were created:

| Carpeta | Propósito | Cuándo se corre | Mantenimiento |
|---------|-----------|-----------------|---------------|
| `regression/` | Flujos completos que validan el producto | Cada deploy | Alto — se actualiza si la app cambia |
| `stories/` | Tests de historias puntuales del sprint | Solo durante el sprint activo | Bajo — se promueve, archiva o elimina al cerrar sprint |
| `validations/` | Validaciones de campos, UI, formularios | Bajo demanda | Medio — mientras los campos existan |

### Ciclo de vida de un test en `stories/`

1. Se crea cuando la historia entra al sprint
2. Se ejecuta durante el sprint para validar el fix/feature
3. Al cerrar el sprint:
   - Si debe mantenerse siempre → se promueve a `regression/`
   - Si ya no es relevante → se elimina o se deja sin correr
