import fs from 'fs';
import { Page, expect } from '@playwright/test';

export class OnboardingPage {
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

    applicationUuid = applicationUuid.replace(/^"|"$/g, '');

    const templateRaw = fs.readFileSync(templateRawPath);
    const bestImageTokenized = fs.readFileSync(bestImageTokenizedPath);
    const bestImage = fs.readFileSync(bestImagePath);

    // URL dinámica según el ambiente (QA o STG)
    const onboardingUrl = process.env.API_ONBOARDING_URL || 
      'https://api-qa-tarjetadigital.incubadorabi.com/api/customer/v1/biometric/onboarding';

    const response = await requestContext.post(
      onboardingUrl,
      {
        headers: { 'recaptcha-token': '' },
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
      throw new Error('Error en la petición de onboarding biométrico');
    }

    const onboardingData = await response.json();

    if (onboardingData?.data?.authToken) {
      const authToken = onboardingData.data.authToken;
      const base64Payload = authToken.split('.')[1];
      const decodedPayload = JSON.parse(
        Buffer.from(base64Payload, 'base64').toString()
      );

      await this.page.evaluate((data) => {
        sessionStorage.setItem('jwt', `"${data.authToken}"`);

        if (data.payload?.dat?.Name) {
          sessionStorage.setItem('user', `"${data.payload.dat.Name}"`);
          localStorage.setItem('user', `"${data.payload.dat.Name}"`);
        }

        if (data.payload?.dat?.SessionUUID) {
          sessionStorage.setItem(
            'session-code',
            `"${data.payload.dat.SessionUUID}"`
          );
        }
      }, { authToken, payload: decodedPayload });
    }
  }

async irAFormularioOferta(ofertaUrl: string) {
  const ofertaUrlFinal = ofertaUrl ||
    'https://qa-tarjetadigital.incubadorabi.com/cliente-digital/oferta';
  await this.page.evaluate((url) => {
    window.location.href = url;
  }, ofertaUrlFinal);

  // 🔑 sincronización REAL (no evento de navegador)
  await this.page.waitForURL(/cliente-digital\/oferta/, {
    timeout: 30_000,
  });
}


}
