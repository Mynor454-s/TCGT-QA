import { Page, expect } from "@playwright/test";
import fs from 'fs';
import { buildPresignedVideoUrl } from '../utils/s3SignedUrl';

export class ocrPage {
  readonly page: Page;
    constructor(page: Page) {
    this.page = page;
    }

  private async loadFileContent(filePath: string, requestContext: any): Promise<Buffer> {
    // Si es una URL (comienza con http), hacer fetch desde S3
    if (filePath.startsWith('http')) {
      const expiresIn = Number(process.env.S3_PRESIGN_EXPIRES_IN || 3600);
      const signedUrl = await buildPresignedVideoUrl(filePath, expiresIn);
      const response = await requestContext.get(signedUrl || filePath);
      if (!response.ok()) {
        throw new Error(
          `Error descargando archivo desde S3: ${filePath} - Status: ${response.status()}. ` +
          'Verifica permisos del objeto o vigencia de credenciales AWS en .env.qa'
        );
      }
      return await response.body();
    }
    // Si es una ruta local, leer con fs
    return fs.readFileSync(filePath);
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
    const frontFile = await this.loadFileContent(frontPath, requestContext);
    const backFile = await this.loadFileContent(backPath, requestContext);

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