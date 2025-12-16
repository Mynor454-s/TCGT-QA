import { Page, expect } from "@playwright/test";
import fs from 'fs';

export class ocrPage {
  readonly page: Page;
    constructor(page: Page) {
    this.page = page;
    }

  /**
   * Realiza la petición OCR y actualiza sessionStorage con la respuesta.
   * @param frontPath Ruta del archivo frontal (relativa a assets)
   * @param backPath Ruta del archivo trasero (relativa a assets)
   * @param requestContext Contexto de request de Playwright
   */
  async consumirOCR(frontPath: string, backPath: string, requestContext: any) {
    // 1. Obtener ApplicationUuid del sessionStorage
  let applicationUuid = await this.page.evaluate(() => sessionStorage.getItem('application-signature'));
  if (!applicationUuid) throw new Error('ApplicationUuid no encontrado en sessionStorage');
  // Eliminar comillas dobles extra si existen
  applicationUuid = applicationUuid.replace(/^"|"$/g, '');

    // 2. Leer los archivos desde la carpeta assets
    const frontFile = fs.readFileSync(frontPath);
    const backFile = fs.readFileSync(backPath);

    // 3. Consumir el endpoint OCR con los nombres de campo correctos
    const ocrApiUrl = process.env.OCR_API_URL || 'https://d1a0xvknet1ite.cloudfront.net/api/customer/v1/biometric/ocr';
    const response = await requestContext.post(
      ocrApiUrl,
      {
        headers: {
          'recaptcha-token': ''
        },
        multipart: {
          ApplicationUuid: applicationUuid,
          FrontImage: { name: 'front.jpg', mimeType: 'image/jpeg', buffer: frontFile },
          BackImage: { name: 'back.jpg', mimeType: 'image/jpeg', buffer: backFile }
        }
      }
    );
    if (!response.ok()) throw new Error('Error en la petición OCR');
    const ocrData = await response.json();

    // 4. Actualizar sessionStorage con la respuesta del OCR
    await this.page.evaluate(() => {
      sessionStorage.setItem('ocr-done', '"true"');
    });
    // Redireccionar a la URL indicada
    const redirectUrl = process.env.OCR_REDIRECT_URL || 'https://qa-tarjetadigital.incubadorabi.com/cliente-digital/rostro-autenticacion';
    await this.page.goto(redirectUrl);
  }
}