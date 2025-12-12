import fs from 'fs';
import { Page } from "@playwright/test";

export class OnboardingPage {
	readonly page: Page;
	constructor(page: Page) {
		this.page = page;
	}

	/**
	 * Realiza la petición de onboarding biométrico y actualiza sessionStorage.
	 * @param urlVideo URL del video
	 * @param templateRawPath Ruta del archivo TemplateRaw
	 * @param bestImageTokenizedPath Ruta del archivo BestImageTokenized
	 * @param requestContext Contexto de request de Playwright
	 */
	async consumirOnboarding(urlVideo: string, templateRawPath: string, bestImageTokenizedPath: string, bestImagePath: string, requestContext: any) {
		// 1. Obtener ApplicationUuid del sessionStorage
		let applicationUuid = await this.page.evaluate(() => sessionStorage.getItem('application-signature'));
		if (!applicationUuid) throw new Error('ApplicationUuid no encontrado en sessionStorage');
		applicationUuid = applicationUuid.replace(/^"|"$/g, '');

	// 2. Leer los archivos
	const templateRaw = fs.readFileSync(templateRawPath);
	const bestImageTokenized = fs.readFileSync(bestImageTokenizedPath);
	const bestImage = fs.readFileSync(bestImagePath);

		// 3. Consumir el endpoint de onboarding biométrico
		const response = await requestContext.post(
			'https://d1a0xvknet1ite.cloudfront.net/api/customer/v1/biometric/onboarding',
			{
				headers: {
					'recaptcha-token': ''
				},
				multipart: {
					ApplicationUuid: applicationUuid,
					UrlVideo: urlVideo,
					TemplateRaw: { name: 'templateRaw.txt', mimeType: 'text/plain', buffer: templateRaw },
					BestImageTokenized: { name: 'bestImageTokenized.txt', mimeType: 'text/plain', buffer: bestImageTokenized },
					BestImage: { name: 'bestImage.jpeg', mimeType: 'image/jpeg', buffer: bestImage }
				}
			}
		);
		if (!response.ok()) throw new Error('Error en la petición de onboarding biométrico');
		const onboardingData = await response.json();

		// 4. Guardar el authToken en sessionStorage como jwt y extraer datos
		if (onboardingData.data && onboardingData.data.authToken) {
			const authToken = onboardingData.data.authToken;
			
			// Decodificar el JWT para extraer la información
			const base64Payload = authToken.split('.')[1];
			const decodedPayload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());
			
			await this.page.evaluate((data) => {
				// Guardar el JWT completo
				sessionStorage.setItem('jwt', `"${data.authToken}"`);
				
				// Extraer y guardar variables específicas del JWT
				if (data.payload.dat) {
					if (data.payload.dat.Name) {
						sessionStorage.setItem('user', `"${data.payload.dat.Name}"`);
						localStorage.setItem('user', `"${data.payload.dat.Name}"`);
					}
					if (data.payload.dat.SessionUUID) {
						sessionStorage.setItem('session-code', `"${data.payload.dat.SessionUUID}"`);
					}
				}
			}, { authToken, payload: decodedPayload });
		}



	}

	async validarRedireccionFormulario() {
				await this.page.goto('https://qa-tarjetadigital.incubadorabi.com/cliente-digital/oferta');
	}
}
