import { env } from 'cloudflare:workers';
import status from 'http-status';
import { ContentfulStatusCode } from 'hono/utils/http-status';

import { EmailPayload, EmailResult, EmailService } from './email';
import ApiError from '@/utils/ApiError';
import { logger } from '@/utils/logger';

export type BrevoPayload = EmailPayload & {
	params?: Record<string, string>;
};

export type BrevoSendResponse = {
	messageId: string;
};

export type BrevoResult = EmailResult &
	(
		| {
				success: true;
				provider: 'brevo';
				messageId: string;
		  }
		| {
				success: false;
				provider: 'brevo';
				error: string;
				status?: number;
		  }
	);

export class BrevoEmailService implements EmailService {
	private BREVO_HOST = env.BREVO_HOST!;
	private BREVO_API_KEY = env.BREVO_API_KEY!;
	private SENDER_NAME = env.SENDER_NAME!;
	private SENDER_EMAIL = env.SENDER_EMAIL!;

	async sendEmail(payload: EmailPayload): Promise<EmailResult> {
		const brevoPayload = payload as BrevoPayload;
		try {
			const response = await fetch(this.BREVO_HOST, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'api-key': this.BREVO_API_KEY,
				},
				body: JSON.stringify({
					sender: {
						name: this.SENDER_NAME,
						email: this.SENDER_EMAIL,
					},
					to: [
						{
							email: brevoPayload.toEmail,
							name: brevoPayload.toName,
						},
					],
					subject: brevoPayload.subject,
					textContent: brevoPayload.textContent,
					htmlContent: brevoPayload.htmlContent,
					params: brevoPayload.params,
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				logger.error('Brevo sendEmail failed:', errorText);
				throw new ApiError(response.status as ContentfulStatusCode, errorText || 'Brevo API failure');
			}

			const data = (await response.json()) as BrevoSendResponse;

			return {
				success: true,
				provider: 'brevo',
				messageId: data.messageId,
			} as BrevoResult;
		} catch (error) {
			logger.error('Brevo sendEmail failed:', error);
			throw new ApiError(status.INTERNAL_SERVER_ERROR, String(error));
		}
	}
}

export const brevoService = new BrevoEmailService();
