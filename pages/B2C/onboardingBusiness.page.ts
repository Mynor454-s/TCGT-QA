import fs from 'fs';
import { Page, expect } from '@playwright/test';

export class OnboardingBusinessPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
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

    const templateRaw = fs.readFileSync(templateRawPath);
    const bestImageTokenized = fs.readFileSync(bestImageTokenizedPath);
    const bestImage = fs.readFileSync(bestImagePath);

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
