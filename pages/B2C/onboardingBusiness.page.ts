import fs from 'fs';
import { Page, expect } from '@playwright/test';
import { buildPresignedVideoUrl } from '../../utils/s3SignedUrl';

export class OnboardingBusinessPage {
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

  async consumirOnboarding(
    urlVideo: string,
    templateRawPath: string,
    bestImageTokenizedPath: string,
    bestImagePath: string,
    requestContext: any
  ) {
    let applicationUuid = await this.page.evaluate(() =>
      sessionStorage.getItem('application-signature')
    );

    if (!applicationUuid) {
      throw new Error('ApplicationUuid no encontrado en sessionStorage');
    }

    // Obtener JWT del sessionStorage para autenticación
    let jwt = await this.page.evaluate(() =>
      sessionStorage.getItem('jwt')
    );

    if (!jwt) {
      throw new Error('JWT no encontrado en sessionStorage');
    }

    // Limpiar comillas si vienen en el formato
    applicationUuid = applicationUuid.replace(/^"|"$/g, '');
    jwt = jwt.replace(/^"|"$/g, '');

    const templateRaw = await this.loadFileContent(templateRawPath, requestContext);
    const bestImageTokenized = await this.loadFileContent(bestImageTokenizedPath, requestContext);
    const bestImage = await this.loadFileContent(bestImagePath, requestContext);

    const response = await requestContext.post(
      'https://d3qkhb3w3dyw1r.cloudfront.net/api/business/v1/biometric/onboarding',
      {
        headers: { 
          'recaptcha-token': '',
          'Authorization': `Bearer ${jwt}`
        },
        multipart: {
          ApplicationUuid: applicationUuid,
          UrlVideo: urlVideo,
          TemplateRaw: {
            name: 'templateRaw.txt',
            mimeType: 'text/plain',
            buffer: templateRaw,
          },
          BestImageTokenized: {
            name: 'bestImageTokenized.txt',
            mimeType: 'text/plain',
            buffer: bestImageTokenized,
          },
          BestImage: {
            name: 'bestImage.jpeg',
            mimeType: 'image/jpeg',
            buffer: bestImage,
          },
        },
      }
    );

    if (!response.ok()) {
      const errorBody = await response.text();
      throw new Error(
        `Error en la petición de onboarding biométrico B2C:\n` +
        `Status: ${response.status()} ${response.statusText()}\n` +
        `Response: ${errorBody}`
      );
    }

    // Para B2C no se necesita setear nada en sessionStorage ni localStorage
    // La navegación se maneja automáticamente por la aplicación
  }

}
