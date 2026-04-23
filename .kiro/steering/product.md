# Product Overview

**Tarjeta Digital (TDCGT)** is a digital credit card onboarding platform for Banco Industrial (Guatemala). It allows customers to apply for credit cards through a web-based flow that includes identity verification, biometric onboarding, and form completion.

## Business Flows

- **B2B (Cliente Directo)**: End customers apply directly. No login required. Entry point: `/cliente-digital/inicio`.
- **B2C (Comercios)**: Merchants/businesses apply on behalf of customers. Requires login with credentials. Entry point: `/comercio/sitio/inicio-sesion`.
- **TCJ**: A variant card type (Mastercard Liv) with its own flow, color selection, and loyalty program.

## Onboarding Steps (B2B Happy Path)

1. Landing page → Start application
2. Enter DPI (national ID number)
3. Select card type (MasterCard, Visa, TCJ)
4. Fill general data (email, phone, NIT, employment start date)
5. Biometric onboarding (video, facial recognition, document scan via API)
6. Accept credit offer
7. Personalize card (alias, and for TCJ: color, loyalty, categories)
8. Personal data (education, occupation, address)
9. Economic data (income, expenses, other income sources or employer data)
10. Shipping data confirmation
11. Optional: Create Bi en Línea (BEL) user
12. Satisfaction survey

## Test Data

Client datasets live in `data/data_new_client.json`. Current keys: `Marcos`, `Monther`. TCJ datasets in `data/data_new_client_TCJ.json`. Always reference datasets by their actual key names.

## Environments

- **QA** (default): `qa-tarjetadigital.incubadorabi.com`
- **STG**: `stg-tarjetadigital.incubadorabi.com`

Environment is selected via the `ENV` variable (e.g., `ENV=stg`).

## Language

The application UI and codebase use **Spanish** for user-facing text, page names, method names, and test descriptions. Follow this convention.
