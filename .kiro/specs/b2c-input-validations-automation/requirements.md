# Documento de Requerimientos

## Introducción

Esta spec cubre la automatización de 51 casos de prueba del Excel de TDCGT para el flujo B2C (Comercios) de la plataforma Tarjeta Digital. Los casos abarcan seis historias de Jira (TDCGI-1649, TDCGI-1650, TDCGI-1676, TDCGI-1648, TDCGI-1651, TDCGI-1763, TDCGI-1761) y validan campos de entrada, labels de UI, contenido de modales, layout de formularios y manejo de errores en las pantallas de onboarding B2C.

Todos los tests siguen los patrones existentes del proyecto: Page Object Model con auto-inyección de fixtures, testing data-driven via archivos JSON, `ScreenshotHelper` para evidencia, y `ui-expected-values.json` para labels/placeholders/mensajes de error esperados. Los tests se organizan bajo `tests/validations/` con tags `@validation`, `@ui`, `@B2C`.

## Glosario

- **Suite_Automatización**: El proyecto de automatización E2E con Playwright + TypeScript para TDCGT
- **Formulario_Login**: La página de login B2C en `/comercio/sitio/inicio-sesion` con campos usuario y contraseña
- **Campo_DPI**: El input de Documento Personal de Identificación en la pantalla de nueva solicitud (`new-request-form-dpi`), acepta exactamente 13 dígitos numéricos
- **Campo_Email**: El input de correo electrónico en el formulario de datos generales (`general-information-form-email`)
- **Campo_NIT**: El input de Número de Identificación Tributaria en el formulario de datos generales (`general-information-form-nit`)
- **Campo_Telefono**: El input de número de celular en el formulario de datos generales (`general-information-form-phone-number`)
- **Modal_Instructivo**: El modal rediseñado que se muestra antes del onboarding biométrico con título, subtítulo, imagen e instrucciones en bullets
- **Modal_Error_FacePhi**: El modal que se muestra cuando el dispositivo/navegador no es compatible con la captura biométrica de FacePhi, con título "¡Lo sentimos!", texto descriptivo y botón "¡Listo!"
- **Formulario_Datos_Generales**: El formulario B2C en `/comercio/panel/formulario-precalificacion` con campos de email, teléfono, NIT y fecha de inicio laboral
- **Dashboard**: El panel de comercio B2C en `/comercio/panel/solicitudes`
- **Formulario_Negocio_Propio**: El formulario "Tengo negocio propio" en la sección de datos económicos con nombre comercial, fecha de inscripción y otros campos de negocio
- **Valores_Esperados_UI**: El archivo JSON (`data/ui-expected-values.json`) con labels, placeholders, testIds y mensajes de error esperados
- **Archivo_Spec**: Un archivo de test Playwright `.spec.ts` bajo `tests/validations/`
- **Page_Object**: Una clase TypeScript en `pages/` que encapsula locators y acciones para una pantalla específica
- **Input_Login_1676**: El input de login actualizado de la Parte 2 que acepta correo o CUI como identificador, alfanumérico, máximo 60 caracteres

## Requerimientos

### Requerimiento 1: Formulario Login — Validaciones del campo Usuario (TDCGI-1649)

**Historia de Usuario:** Como ingeniero QA, quiero tests automatizados para el campo usuario del login B2C, para que las restricciones de entrada (requerido, alfanumérico, máximo 30 caracteres) y labels de UI se verifiquen en cada ejecución de regresión.

#### Criterios de Aceptación

1. CUANDO se carga el Formulario_Login, la Suite_Automatización DEBE verificar que el label del campo usuario coincida con el valor esperado de Valores_Esperados_UI
2. CUANDO se carga el Formulario_Login, la Suite_Automatización DEBE verificar que el placeholder del campo usuario coincida con el valor esperado de Valores_Esperados_UI
3. CUANDO se hace click en el botón de login con el campo usuario vacío, la Suite_Automatización DEBE verificar que se muestre un mensaje de error de campo requerido que coincida con el texto esperado de Valores_Esperados_UI
4. CUANDO se ingresa texto alfanumérico en el campo usuario, la Suite_Automatización DEBE verificar que el campo acepta la entrada sin error
5. CUANDO se ingresan más de 30 caracteres en el campo usuario, la Suite_Automatización DEBE verificar que se muestre un mensaje de error de longitud máxima o que la entrada se trunque a 30 caracteres

### Requerimiento 2: Formulario Login — Validaciones del campo Contraseña (TDCGI-1649)

**Historia de Usuario:** Como ingeniero QA, quiero tests automatizados para el campo contraseña del login B2C, para que las restricciones de entrada (requerido, alfanumérico, máximo 60 caracteres) y labels de UI se verifiquen automáticamente.

#### Criterios de Aceptación

1. CUANDO se carga el Formulario_Login, la Suite_Automatización DEBE verificar que el label del campo contraseña coincida con el valor esperado de Valores_Esperados_UI
2. CUANDO se carga el Formulario_Login, la Suite_Automatización DEBE verificar que el placeholder del campo contraseña coincida con el valor esperado de Valores_Esperados_UI
3. CUANDO se ingresa texto alfanumérico en el campo contraseña, la Suite_Automatización DEBE verificar que el campo acepta la entrada sin error
4. CUANDO se ingresan más de 60 caracteres en el campo contraseña, la Suite_Automatización DEBE verificar que la entrada se trunque a 60 caracteres o se muestre un error de longitud máxima

### Requerimiento 3: Formulario Login — Estado del botón y navegación (TDCGI-1649)

**Historia de Usuario:** Como ingeniero QA, quiero tests automatizados para el comportamiento del botón de login B2C, para que los estados habilitado/deshabilitado y la redirección exitosa se verifiquen.

#### Criterios de Aceptación

1. CUANDO se carga el Formulario_Login con ambos campos vacíos, la Suite_Automatización DEBE verificar que el botón de login esté deshabilitado
2. CUANDO ambos campos usuario y contraseña se llenan con valores válidos, la Suite_Automatización DEBE verificar que el botón de login cambie a estado habilitado
3. CUANDO se renderiza el texto del botón de login, la Suite_Automatización DEBE verificar que coincida con el texto esperado de Valores_Esperados_UI
4. CUANDO se envían credenciales válidas mediante el botón de login, la Suite_Automatización DEBE verificar que la página redirija al patrón de URL del Dashboard `/comercio/panel/solicitudes`

### Requerimiento 4: Validaciones del campo DPI (TDCGI-1649)

**Historia de Usuario:** Como ingeniero QA, quiero tests automatizados para el campo DPI en la pantalla de nueva solicitud, para que las restricciones de solo números, validación de requerido y validación de formato se verifiquen.

#### Criterios de Aceptación

1. CUANDO se ingresan dígitos numéricos en el Campo_DPI, la Suite_Automatización DEBE verificar que el campo acepta la entrada y el valor contiene solo dígitos
2. CUANDO se ingresan caracteres alfabéticos en el Campo_DPI, la Suite_Automatización DEBE verificar que el campo rechaza la entrada (el valor del campo no contiene letras)
3. CUANDO se ingresan caracteres especiales en el Campo_DPI, la Suite_Automatización DEBE verificar que el campo rechaza la entrada (el valor del campo no contiene caracteres especiales)
4. CUANDO el Campo_DPI recibe foco y luego pierde foco sin entrada, la Suite_Automatización DEBE verificar que se muestre un error de campo requerido usando el errorTestId de Valores_Esperados_UI
5. CUANDO se hace click en el botón continuar con el Campo_DPI vacío, la Suite_Automatización DEBE verificar que se muestre un error de campo requerido que coincida con el texto esperado de Valores_Esperados_UI
6. CUANDO se navega a la pantalla de nueva solicitud, la Suite_Automatización DEBE verificar que el label y placeholder del Campo_DPI coincidan con los valores esperados de Valores_Esperados_UI
7. CUANDO se ingresa un DPI con menos de 13 dígitos, la Suite_Automatización DEBE verificar que se muestre un mensaje de error de formato inválido que coincida con el texto esperado de Valores_Esperados_UI
8. CUANDO se ingresa un DPI válido de 13 dígitos, la Suite_Automatización DEBE verificar que no se muestren mensajes de error para el Campo_DPI

### Requerimiento 5: Validaciones del campo Email (TDCGI-1649)

**Historia de Usuario:** Como ingeniero QA, quiero tests automatizados para el campo email en el Formulario_Datos_Generales, para que label, placeholder, validación de requerido y validación de formato se verifiquen.

#### Criterios de Aceptación

1. CUANDO se carga el Formulario_Datos_Generales, la Suite_Automatización DEBE verificar que el label y placeholder del Campo_Email coincidan con los valores esperados de Valores_Esperados_UI
2. CUANDO se ingresa una dirección de email válida (ej. `usuario@dominio.com`) en el Campo_Email, la Suite_Automatización DEBE verificar que no se muestren mensajes de error
3. CUANDO se ingresa un formato de email inválido (ej. `correo-invalido`) en el Campo_Email, la Suite_Automatización DEBE verificar que se muestre un mensaje de error de formato inválido que coincida con el texto esperado de Valores_Esperados_UI
4. CUANDO se hace click en el botón continuar con el Campo_Email vacío, la Suite_Automatización DEBE verificar que se muestre un mensaje de error de campo requerido que coincida con el texto esperado de Valores_Esperados_UI

### Requerimiento 6: Validaciones del campo NIT (TDCGI-1649)

**Historia de Usuario:** Como ingeniero QA, quiero tests automatizados para el campo NIT en el Formulario_Datos_Generales, para que label, placeholder, validación de requerido y validación de formato se verifiquen.

#### Criterios de Aceptación

1. CUANDO se carga el Formulario_Datos_Generales, la Suite_Automatización DEBE verificar que el label y placeholder del Campo_NIT coincidan con los valores esperados de Valores_Esperados_UI
2. CUANDO se ingresa un valor de NIT válido en el Campo_NIT, la Suite_Automatización DEBE verificar que no se muestren mensajes de error
3. CUANDO se ingresa un valor de NIT inválido en el Campo_NIT, la Suite_Automatización DEBE verificar que se muestre un mensaje de error de formato inválido que coincida con el texto esperado de Valores_Esperados_UI
4. CUANDO se hace click en el botón continuar con el Campo_NIT vacío, la Suite_Automatización DEBE verificar que se muestre un mensaje de error de campo requerido que coincida con el texto esperado de Valores_Esperados_UI

### Requerimiento 7: Validaciones del campo Teléfono (TDCGI-1649, TDCGI-1761)

**Historia de Usuario:** Como ingeniero QA, quiero tests automatizados para el campo de número de celular en el Formulario_Datos_Generales, para que label, placeholder, validación de requerido y manejo de errores post-mantenimiento se verifiquen.

#### Criterios de Aceptación

1. CUANDO se carga el Formulario_Datos_Generales, la Suite_Automatización DEBE verificar que el label y placeholder del Campo_Telefono coincidan con los valores esperados de Valores_Esperados_UI
2. CUANDO se hace click en el botón continuar con el Campo_Telefono vacío, la Suite_Automatización DEBE verificar que se muestre un mensaje de error de campo requerido que coincida con el texto esperado de Valores_Esperados_UI
3. CUANDO se ingresa un número de teléfono inválido en el Campo_Telefono, la Suite_Automatización DEBE verificar que se muestre el mensaje de error apropiado que coincida con el texto esperado de Valores_Esperados_UI

### Requerimiento 8: Rediseño del Modal Instructivo (TDCGI-1650)

**Historia de Usuario:** Como ingeniero QA, quiero tests automatizados para el modal instructivo rediseñado, para que el título actualizado, subtítulo, imagen SVG y contenido de bullets se verifiquen.

#### Criterios de Aceptación

1. CUANDO se muestra el Modal_Instructivo, la Suite_Automatización DEBE verificar que el texto instructivo anterior ya no esté presente en el modal
2. CUANDO se muestra el Modal_Instructivo, la Suite_Automatización DEBE verificar que el nuevo texto del título coincida con el valor esperado de Valores_Esperados_UI
3. CUANDO se muestra el Modal_Instructivo, la Suite_Automatización DEBE verificar que el nuevo texto del subtítulo coincida con el valor esperado de Valores_Esperados_UI
4. CUANDO se muestra el Modal_Instructivo, la Suite_Automatización DEBE verificar que el elemento de imagen instructiva tenga un atributo `src` que termine en `.svg`
5. CUANDO se muestra el Modal_Instructivo, la Suite_Automatización DEBE verificar que los bullets actualizados coincidan con el contenido esperado de Valores_Esperados_UI

### Requerimiento 9: Input de Login Actualizado — Parte 2 (TDCGI-1676)

**Historia de Usuario:** Como ingeniero QA, quiero tests automatizados para el input de login B2C actualizado (Parte 2) que acepta email o CUI, para que las restricciones alfanuméricas, longitud máxima, label/placeholder y estados de diseño se verifiquen.

#### Criterios de Aceptación

1. CUANDO se ingresa texto alfanumérico en el Input_Login_1676, la Suite_Automatización DEBE verificar que el campo acepta la entrada sin error
2. CUANDO se ingresan más de 60 caracteres en el Input_Login_1676, la Suite_Automatización DEBE verificar que la entrada se trunque a 60 caracteres o se muestre un error de longitud máxima
3. CUANDO se ingresa una dirección de email en el Input_Login_1676, la Suite_Automatización DEBE verificar que el campo la acepta como entrada válida
4. CUANDO se ingresa un CUI (identificador numérico) en el Input_Login_1676, la Suite_Automatización DEBE verificar que el campo lo acepta como entrada válida
5. CUANDO el Input_Login_1676 transiciona entre estados vacío, enfocado, lleno y error, la Suite_Automatización DEBE verificar que se apliquen las clases CSS o estados visuales apropiados
6. CUANDO se carga el Formulario_Login, la Suite_Automatización DEBE verificar que el label y placeholder del Input_Login_1676 coincidan con los valores esperados de Valores_Esperados_UI
7. CUANDO se ingresan caracteres alfabéticos en el Input_Login_1676, la Suite_Automatización DEBE verificar que el campo acepta la entrada (campo alfanumérico permite letras)
8. CUANDO se ingresan caracteres numéricos en el Input_Login_1676, la Suite_Automatización DEBE verificar que el campo acepta la entrada
9. CUANDO se ingresa un solo dígito en el Input_Login_1676, la Suite_Automatización DEBE verificar que el campo acepta la entrada sin error
10. CUANDO se ingresan más de 6 dígitos numéricos en el Input_Login_1676, la Suite_Automatización DEBE verificar que el campo acepta la entrada sin error (sin restricción de longitud mínima)
11. CUANDO se dispara la acción de continuar o login con el Input_Login_1676 vacío, la Suite_Automatización DEBE verificar que se muestre un mensaje de error de campo requerido

### Requerimiento 10: Actualización Selphi 5.51 — Regresión de Onboarding (TDCGI-1648)

**Historia de Usuario:** Como ingeniero QA, quiero un test de regresión automatizado que confirme que el onboarding biométrico sigue funcionando después de la actualización de Selphi 5.51, para que la integración con el backend se verifique.

#### Criterios de Aceptación

1. CUANDO se ejecuta un flujo de onboarding B2C válido de extremo a extremo después de la actualización de Selphi 5.51, la Suite_Automatización DEBE verificar que el paso de onboarding se complete sin errores y el flujo avance a la siguiente pantalla

### Requerimiento 11: Layout del Formulario Negocio Propio (TDCGI-1651)

**Historia de Usuario:** Como ingeniero QA, quiero un test automatizado que verifique el layout del formulario de negocio propio, para que el campo de fecha de inscripción esté posicionado en el mismo renglón que el campo de nombre comercial.

#### Criterios de Aceptación

1. CUANDO se muestra el Formulario_Negocio_Propio, la Suite_Automatización DEBE verificar que el input "fecha de inscripción" y el input "nombre comercial" comparten la misma posición vertical (mismo renglón) comparando sus coordenadas `y` del bounding box con una tolerancia de 10 píxeles

### Requerimiento 12: Contenido del Modal de Error FacePhi (TDCGI-1763)

**Historia de Usuario:** Como ingeniero QA, quiero tests automatizados para el modal de error de hardware de FacePhi, para que el título, texto del cuerpo, texto del botón y comportamiento de redirección se verifiquen.

#### Criterios de Aceptación

1. CUANDO se muestra el Modal_Error_FacePhi, la Suite_Automatización DEBE verificar que el texto del título coincida con "¡Lo sentimos!" de Valores_Esperados_UI
2. CUANDO se muestra el Modal_Error_FacePhi, la Suite_Automatización DEBE verificar que el texto del cuerpo contenga "Tu dispositivo o navegador no es compatible" de Valores_Esperados_UI
3. CUANDO se muestra el Modal_Error_FacePhi, la Suite_Automatización DEBE verificar que el texto del botón de acción coincida con "¡Listo!" de Valores_Esperados_UI
4. CUANDO se hace click en el botón "¡Listo!" del Modal_Error_FacePhi, la Suite_Automatización DEBE verificar que la página redirija al patrón de URL de la pantalla home B2C

### Requerimiento 13: Gestión de Datos de Prueba y Valores Esperados

**Historia de Usuario:** Como ingeniero QA, quiero que todos los valores esperados de UI (labels, placeholders, mensajes de error, testIds) estén externalizados en archivos JSON, para que los tests sean data-driven y mantenibles sin cambios de código.

#### Criterios de Aceptación

1. La Suite_Automatización DEBE almacenar todos los labels, placeholders, mensajes de error y testIds esperados en `data/ui-expected-values.json`
2. La Suite_Automatización DEBE almacenar los casos de prueba de validación por campo (entradas válidas/inválidas, errores esperados) en archivos JSON bajo `data/validations/`
3. CUANDO se crea un nuevo Archivo_Spec de validación, la Suite_Automatización DEBE leer los valores esperados de los archivos JSON en vez de hardcodearlos en el test
4. CUANDO se implementa un nuevo escenario de validación, la Suite_Automatización DEBE registrarlo en `data/test-matrix.json` con el ID de escenario, tags, prioridad y referencia al data provider apropiados

### Requerimiento 14: Organización de Tests y Etiquetado

**Historia de Usuario:** Como ingeniero QA, quiero que todos los nuevos tests de validación estén organizados bajo `tests/validations/` con tags apropiados, para que se integren con la test matrix existente y se puedan filtrar por prioridad y tipo.

#### Criterios de Aceptación

1. La Suite_Automatización DEBE colocar todos los nuevos Archivos_Spec de validación B2C bajo `tests/validations/` en subdirectorios apropiados (ej. `ui/`, `datosGenerales/`, `modal/`)
2. La Suite_Automatización DEBE etiquetar cada nuevo test con al menos `@validation`, `@B2C` y un tag de prioridad (`@P0` o `@P1`)
3. La Suite_Automatización DEBE usar `ScreenshotHelper.takeAndAttach()` al final de cada test para capturar evidencia
4. CUANDO se necesiten nuevos métodos de Page_Object para los tests, la Suite_Automatización DEBE agregarlos a los Page_Objects existentes siguiendo las convenciones de naming del proyecto (nombres de métodos en español, nombres de clases en PascalCase)
