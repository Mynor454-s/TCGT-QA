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
├── pages/                        # Page Object Model classes (B2B flow)
│   ├── home.page.ts              # Landing page
│   ├── inicioFlujo.page.ts       # DPI entry
│   ├── seleccionTc.page.ts       # Card type selection (SeleccionTcPage)
│   ├── datosGenerales.page.ts    # General data form
│   ├── onboarding.page.ts        # Biometric onboarding
│   ├── aceptarOferta.page.ts     # Offer acceptance
│   ├── personalizacionTc.page.ts # Card personalization
│   ├── datosPersonales.page.ts   # Personal data
│   ├── datosEconomicos.page.ts   # Economic data
│   ├── otrosIngresos.page.ts     # Other income
│   ├── empresaIngresos.page.ts   # Company/employer data
│   ├── datosDeEnvio.page.ts      # Shipping data
│   ├── encuestaSatisfaccion.page.ts # Satisfaction survey
│   ├── creacionBel.page.ts       # Bi en Línea user creation
│   └── ocrPage.page.ts           # OCR document page
│
├── pages/B2C/                    # Page Objects (B2C/merchant flow)
│   ├── home.page.ts              # B2C login page
│   ├── dashboard.page.ts         # Merchant dashboard
│   ├── empezarSolicitud.page.ts  # Start application
│   ├── formDatosGenerales.page.ts
│   ├── instruccionOnboardingBusiness.page.ts
│   └── onboardingBusiness.page.ts
│
├── pages/TCJ/                    # Page Objects (TCJ card variant)
│   └── colores.page.ts
│
├── components/                   # Reusable UI component objects
│   └── footer.component.ts
│
├── tests/
│   ├── flows/happypath/          # E2E happy path tests
│   │   ├── flujoCompletoCliente.spec.ts
│   │   ├── flujoCompletoClienteMatrixDriven.spec.ts
│   │   ├── flujoCompletoClienteMovil.spec.ts
│   │   ├── flujoCompletoClienteTCJ.spec.ts
│   │   ├── B2C/                  # B2C happy path tests
│   │   └── TCJ/                  # TCJ data-driven tests
│   └── validations/              # Field and UI validation tests
│       ├── datosGenerales/
│       └── ui/
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
