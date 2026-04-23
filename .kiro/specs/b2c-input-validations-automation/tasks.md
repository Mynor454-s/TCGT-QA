# Plan de Implementación: Automatización de Validaciones de Inputs B2C

## Resumen

Implementar ~51 casos de prueba automatizados para validaciones de campos de entrada, labels de UI, contenido de modales y layout de formularios en el flujo B2C. Se crean 4 archivos JSON de validación, se extiende `ui-expected-values.json`, se agregan métodos a 3 Page Objects existentes, se crea 1 Page Object nuevo (`ModalErrorFacePhiPage`), se registra en fixtures, se crean 10 archivos spec nuevos + se extiende 1 existente, y se actualiza `test-matrix.json`.

## Tareas

- [x] 1. Crear archivos JSON de datos de validación
  - [x] 1.1 Crear `data/validations/login-validations.json`
    - Definir casos de prueba para el campo usuario login B2C: alfanumérico válido, límite 30 caracteres, excede límite
    - Estructura: `description`, `field`, `page`, `loginCases[]` con `name`, `testId`, `input`, `shouldFail`, `expectedError`, `priority`
    - _Requerimientos: 1.4, 1.5, 13.2_
  - [x] 1.2 Crear `data/validations/email-validations.json`
    - Definir casos de prueba para el campo email: válido, inválido sin arroba, vacío
    - Estructura: `description`, `field`, `page`, `emailCases[]` con `name`, `testId`, `input`, `shouldFail`, `expectedError`, `errorTestId`, `priority`
    - _Requerimientos: 5.2, 5.3, 5.4, 13.2_
  - [x] 1.3 Crear `data/validations/nit-validations.json`
    - Definir casos de prueba para el campo NIT: válido, inválido, vacío
    - Estructura: `description`, `field`, `page`, `nitCases[]` con `name`, `testId`, `input`, `shouldFail`, `expectedError`, `errorTestId`, `priority`
    - _Requerimientos: 6.2, 6.3, 6.4, 13.2_
  - [x] 1.4 Crear `data/validations/telefono-validations.json`
    - Definir casos de prueba para el campo teléfono: válido 8 dígitos, inválido menos de 8, vacío
    - Estructura: `description`, `field`, `page`, `telefonoCases[]` con `name`, `testId`, `input`, `shouldFail`, `expectedError`, `errorTestId`, `priority`
    - _Requerimientos: 7.2, 7.3, 13.2_

- [x] 2. Extender `data/ui-expected-values.json` con secciones nuevas
  - Agregar sección `loginActualizado` con `inputLogin`: label, placeholder, testId, errorTestId, invalidErrorTestId, maxLength (60), errorMessages (required, maxLength)
  - Agregar sección `modalInstructivo` con `titulo`, `subtitulo`, `imagen`, `bullets`, `textoAnterior`
  - Agregar sección `modalErrorFacePhi` con `titulo`, `body`, `boton`, `redirectPattern`
  - Agregar sección `negocioPropio` con `nombreComercial` y `fechaInscripcion` (testId, label)
  - Los testIds y textos exactos deben confirmarse inspeccionando la app en QA; usar placeholders del diseño inicialmente
  - _Requerimientos: 8.1–8.5, 9.6, 11.1, 12.1–12.4, 13.1_

- [x] 3. Checkpoint — Verificar estructura de datos
  - Asegurar que todos los archivos JSON son válidos (parseo sin errores)
  - Verificar que `ui-expected-values.json` mantiene las secciones existentes intactas
  - Preguntar al usuario si hay dudas sobre testIds o textos esperados

- [x] 4. Agregar métodos de validación a Page Objects existentes
  - [x] 4.1 Extender `pages/B2C/home.page.ts` — `HomePageBusiness`
    - Agregar métodos: `obtenerValorCampoUsuario()`, `obtenerValorCampoPassword()`, `obtenerPlaceholderUsuario()`, `obtenerPlaceholderPassword()`, `estaBotonLoginHabilitado()`, `obtenerClasesCampoUsuario()`, `obtenerEstadoVisualCampo(testId)`
    - Usar locators existentes (`getByTestId`) consistentes con los métodos actuales
    - _Requerimientos: 1.1, 1.2, 1.4, 2.1, 2.2, 2.3, 3.1, 3.2, 9.5, 14.4_
  - [x] 4.2 Extender `pages/B2C/formDatosGenerales.page.ts` — `FormDatosGeneralesPage`
    - Agregar métodos: `obtenerPlaceholderEmail()`, `obtenerPlaceholderNit()`, `obtenerPlaceholderTelefono()`, `llenarEmail(email)`, `llenarNit(nit)`, `llenarTelefono(telefono)`, `limpiarCampo(testId)`
    - Reutilizar testIds de `ui-expected-values.json` sección `datosGenerales`
    - _Requerimientos: 5.1, 6.1, 7.1, 14.4_
  - [x] 4.3 Extender `pages/B2C/instruccionOnboardingBusiness.page.ts` — `InstruccionOnboardingBusinessPage`
    - Agregar métodos: `obtenerTituloModal()`, `obtenerSubtituloModal()`, `obtenerSrcImagenInstructiva()`, `obtenerTextoBullets()`, `esVisibleModalInstructivo()`
    - Usar testIds de la sección `modalInstructivo` de `ui-expected-values.json`
    - _Requerimientos: 8.1–8.5, 14.4_

- [x] 5. Crear nuevo Page Object `ModalErrorFacePhiPage`
  - [x] 5.1 Crear `pages/B2C/modalErrorFacePhi.page.ts`
    - Implementar clase `ModalErrorFacePhiPage` con constructor que recibe `Page`
    - Métodos: `obtenerTituloModal()`, `obtenerTextoBody()`, `obtenerTextoBoton()`, `clickBotonListo()`, `esVisibleModal()`
    - Usar testIds de la sección `modalErrorFacePhi` de `ui-expected-values.json`
    - _Requerimientos: 12.1–12.4, 14.4_
  - [x] 5.2 Registrar `ModalErrorFacePhiPage` en `fixtures/baseTest.ts`
    - Agregar import de `ModalErrorFacePhiPage`
    - Agregar tipo `modalErrorFacePhiPage: ModalErrorFacePhiPage` a `CustomFixtures`
    - Agregar fixture: `modalErrorFacePhiPage: async ({ page }, use) => { await use(new ModalErrorFacePhiPage(page)); }`
    - _Requerimientos: 14.4_

- [x] 6. Checkpoint — Verificar Page Objects y fixtures
  - Asegurar que todos los tests existentes siguen compilando (`npx playwright test --list`)
  - Verificar que los nuevos métodos de PO no rompen los existentes
  - Preguntar al usuario si hay dudas

- [x] 7. Implementar specs de validación del Login (Req 1, 2, 3)
  - [x] 7.1 Extender `tests/validations/ui/validateLabelsB2C.spec.ts` con test de aceptación alfanumérica
    - Agregar test `VAL-UI-B2C-008: Validar aceptación de texto alfanumérico en campo usuario @P1`
    - Ingresar texto alfanumérico → verificar que el campo acepta la entrada sin error
    - Usar `ScreenshotHelper.takeAndAttach()` para evidencia
    - _Requerimientos: 1.4_
  - [x] 7.2 Crear `tests/validations/ui/validatePasswordB2C.spec.ts`
    - Test `VAL-UI-PWD-001`: Validar label y placeholder del campo contraseña
    - Test `VAL-UI-PWD-002`: Validar aceptación de texto alfanumérico
    - Test `VAL-UI-PWD-003`: Validar truncamiento o error a 60 caracteres
    - Importar desde `@playwright/test` (no necesita fixtures custom)
    - Leer valores esperados de `ui-expected-values.json` sección `loginB2C.password`
    - Tags: `@validation @ui @B2C @P1`
    - _Requerimientos: 2.1, 2.2, 2.3, 2.4, 14.1, 14.2, 14.3_
  - [x] 7.3 Crear `tests/validations/ui/validateBotonLoginB2C.spec.ts`
    - Test `VAL-UI-BTN-001`: Validar estado deshabilitado con campos vacíos
    - Test `VAL-UI-BTN-002`: Validar estado habilitado con campos llenos
    - Test `VAL-UI-BTN-003`: Validar texto del botón
    - Test `VAL-UI-BTN-004`: Validar redirección exitosa al dashboard
    - Leer valores esperados de `ui-expected-values.json` sección `loginB2C.loginButton`
    - Tags: `@validation @ui @B2C @P1`
    - _Requerimientos: 3.1, 3.2, 3.3, 3.4, 14.1, 14.2, 14.3_

- [x] 8. Implementar specs de validación de Datos Generales (Req 5, 6, 7)
  - [x] 8.1 Crear `tests/validations/ui/validateEmailB2C.spec.ts`
    - `beforeEach`: Login → Dashboard → Nueva Solicitud → DPI válido → Datos Generales
    - Test `VAL-UI-EMAIL-001`: Validar label y placeholder del campo email
    - Test `VAL-UI-EMAIL-002`: Validar email válido sin errores
    - Test `VAL-UI-EMAIL-003`: Validar email inválido con mensaje de error
    - Test `VAL-UI-EMAIL-004`: Validar campo requerido
    - Leer valores de `ui-expected-values.json` sección `datosGenerales.email` y `data/validations/email-validations.json`
    - Tags: `@validation @ui @B2C @P1`
    - _Requerimientos: 5.1, 5.2, 5.3, 5.4, 13.3, 14.1, 14.2, 14.3_
  - [x] 8.2 Crear `tests/validations/ui/validateNitB2C.spec.ts`
    - `beforeEach`: Login → Dashboard → Nueva Solicitud → DPI válido → Datos Generales
    - Test `VAL-UI-NIT-001`: Validar label y placeholder del campo NIT
    - Test `VAL-UI-NIT-002`: Validar NIT válido sin errores
    - Test `VAL-UI-NIT-003`: Validar NIT inválido con mensaje de error
    - Test `VAL-UI-NIT-004`: Validar campo requerido
    - Leer valores de `ui-expected-values.json` sección `datosGenerales.nit` y `data/validations/nit-validations.json`
    - Tags: `@validation @ui @B2C @P1`
    - _Requerimientos: 6.1, 6.2, 6.3, 6.4, 13.3, 14.1, 14.2, 14.3_
  - [x] 8.3 Crear `tests/validations/ui/validateTelefonoB2C.spec.ts`
    - `beforeEach`: Login → Dashboard → Nueva Solicitud → DPI válido → Datos Generales
    - Test `VAL-UI-TEL-001`: Validar label y placeholder del campo teléfono
    - Test `VAL-UI-TEL-002`: Validar campo requerido
    - Test `VAL-UI-TEL-003`: Validar teléfono inválido con mensaje de error
    - Leer valores de `ui-expected-values.json` sección `datosGenerales.telefono` y `data/validations/telefono-validations.json`
    - Tags: `@validation @ui @B2C @P1`
    - _Requerimientos: 7.1, 7.2, 7.3, 13.3, 14.1, 14.2, 14.3_

- [x] 9. Checkpoint — Verificar specs de login y datos generales
  - Asegurar que todos los archivos spec compilan sin errores (`npx playwright test --list`)
  - Verificar que los imports y paths a JSON son correctos
  - Preguntar al usuario si hay dudas

- [x] 10. Implementar specs de modales (Req 8, 12)
  - [x] 10.1 Crear `tests/validations/modal/validateModalInstructivo.spec.ts`
    - `beforeEach`: Login → Dashboard → Nueva Solicitud → DPI → Datos Generales → Instrucción Onboarding
    - Test `VAL-MODAL-INST-001`: Validar ausencia de texto instructivo anterior
    - Test `VAL-MODAL-INST-002`: Validar nuevo título del modal
    - Test `VAL-MODAL-INST-003`: Validar nuevo subtítulo del modal
    - Test `VAL-MODAL-INST-004`: Validar imagen SVG (atributo `src` termina en `.svg`)
    - Test `VAL-MODAL-INST-005`: Validar contenido de bullets
    - Leer valores de `ui-expected-values.json` sección `modalInstructivo`
    - Tags: `@validation @modal @B2C @P1`
    - _Requerimientos: 8.1, 8.2, 8.3, 8.4, 8.5, 13.3, 14.1, 14.2, 14.3_
  - [x] 10.2 Crear `tests/validations/modal/validateModalErrorFacePhi.spec.ts`
    - `beforeEach`: Login → Dashboard → Nueva Solicitud → DPI → Datos Generales → Instrucción (con dispositivo incompatible)
    - Test `VAL-MODAL-FP-001`: Validar título "¡Lo sentimos!"
    - Test `VAL-MODAL-FP-002`: Validar texto del cuerpo
    - Test `VAL-MODAL-FP-003`: Validar texto del botón "¡Listo!"
    - Test `VAL-MODAL-FP-004`: Validar redirección al hacer click en botón
    - Leer valores de `ui-expected-values.json` sección `modalErrorFacePhi`
    - Usar `ModalErrorFacePhiPage` via fixture o instanciación directa
    - Tags: `@validation @modal @B2C @P1`
    - _Requerimientos: 12.1, 12.2, 12.3, 12.4, 13.3, 14.1, 14.2, 14.3_

- [x] 11. Implementar specs de login actualizado, layout y regresión (Req 9, 11, 10)
  - [x] 11.1 Crear `tests/validations/ui/validateLoginActualizadoB2C.spec.ts`
    - Test `VAL-UI-LOGIN2-001`: Validar aceptación alfanumérica
    - Test `VAL-UI-LOGIN2-002`: Validar truncamiento a 60 caracteres
    - Test `VAL-UI-LOGIN2-003`: Validar aceptación de email como entrada
    - Test `VAL-UI-LOGIN2-004`: Validar aceptación de CUI como entrada
    - Test `VAL-UI-LOGIN2-005`: Validar estados visuales (CSS) — vacío, enfocado, lleno, error
    - Test `VAL-UI-LOGIN2-006`: Validar label y placeholder actualizados
    - Test `VAL-UI-LOGIN2-007`: Validar aceptación de caracteres alfabéticos
    - Test `VAL-UI-LOGIN2-008`: Validar aceptación de caracteres numéricos
    - Test `VAL-UI-LOGIN2-009`: Validar aceptación de un solo dígito
    - Test `VAL-UI-LOGIN2-010`: Validar aceptación de más de 6 dígitos
    - Test `VAL-UI-LOGIN2-011`: Validar error de campo requerido
    - Leer valores de `ui-expected-values.json` sección `loginActualizado` y `data/validations/login-validations.json`
    - Tags: `@validation @ui @B2C @P1`
    - _Requerimientos: 9.1–9.11, 13.3, 14.1, 14.2, 14.3_
  - [x] 11.2 Crear `tests/validations/ui/validateLayoutNegocioPropio.spec.ts`
    - `beforeEach`: Navegar hasta sección datos económicos con "negocio propio" seleccionado
    - Test `VAL-UI-LAYOUT-001`: Validar posición vertical de campos fecha inscripción y nombre comercial
    - Obtener `boundingBox()` de ambos elementos → comparar coordenada `y` con tolerancia de 10px
    - Verificar que `boundingBox()` no retorne null antes de comparar
    - Leer testIds de `ui-expected-values.json` sección `negocioPropio`
    - Tags: `@validation @ui @B2C @P2`
    - _Requerimientos: 11.1, 13.3, 14.1, 14.2, 14.3_
  - [x] 11.3 Crear `tests/validations/regression/regresionSelphi551.spec.ts`
    - Importar `test` y `expect` desde `fixtures/baseTest.ts` (test E2E que usa fixtures)
    - Ejecutar flujo completo B2C: Login → Dashboard → Nueva Solicitud → DPI → Datos Generales → Onboarding
    - Verificar que el paso de onboarding se complete sin errores y el flujo avance
    - Usar datos de `data/data_new_client.json`
    - Tags: `@validation @regression @B2C @P0`
    - _Requerimientos: 10.1, 14.1, 14.2, 14.3_

- [x] 12. Actualizar `data/test-matrix.json` con nuevos escenarios
  - Agregar 10 escenarios nuevos a `scenarios.validations.scenarios[]`:
    - `VAL-UI-PWD-001`: Validaciones UI - Contraseña B2C
    - `VAL-UI-BTN-001`: Validaciones UI - Botón Login B2C
    - `VAL-UI-EMAIL-001`: Validaciones UI - Email B2C
    - `VAL-UI-NIT-001`: Validaciones UI - NIT B2C
    - `VAL-UI-TEL-001`: Validaciones UI - Teléfono B2C
    - `VAL-MODAL-INST-001`: Validaciones Modal Instructivo
    - `VAL-MODAL-FP-001`: Validaciones Modal Error FacePhi
    - `VAL-UI-LOGIN2-001`: Validaciones Login Actualizado Parte 2
    - `VAL-UI-LAYOUT-001`: Validaciones Layout Negocio Propio
    - `VAL-REG-SELPHI-001`: Regresión Selphi 5.51
  - Actualizar contadores `total`, `implemented` en `scenarios.validations`
  - Actualizar `summary` con totales actualizados
  - _Requerimientos: 13.4, 14.1, 14.2_

- [x] 13. Checkpoint final — Verificar suite completa
  - Ejecutar `npx playwright test --list` para confirmar que todos los specs se detectan
  - Verificar que no hay errores de compilación TypeScript
  - Confirmar que la estructura de directorios coincide con el diseño
  - Preguntar al usuario si hay dudas o ajustes necesarios

## Notas

- Los tests de validación importan desde `@playwright/test` directamente (excepción documentada en conventions.md) excepto el test de regresión Selphi que usa fixtures custom
- Los testIds y textos exactos de `modalInstructivo`, `modalErrorFacePhi` y `loginActualizado` deben confirmarse inspeccionando la aplicación en QA — los valores iniciales son placeholders del diseño
- Cada test usa `ScreenshotHelper.takeAndAttach()` al final para capturar evidencia
- Los datos de validación se leen de archivos JSON, nunca se hardcodean en los specs
- El Requerimiento 4 (DPI) ya está completamente cubierto por `validateDpiB2C.spec.ts` existente — no requiere cambios
