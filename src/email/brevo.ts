import { env } from 'cloudflare:workers';
import { EmailService } from './email';
import ApiError from '@/utils/ApiError';
import status from 'http-status';

interface BrevoPayload {
	recipientName: string;
	recipientEmail: string;
	subject: string;
	textContent?: string;
	htmlContent?: string;
	params?: Record<string, string>;
}

export type BrevoSendResponse = {
	messageId: string;
};

export type EmailSendResult =
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
	  };

export class BrevoEmailService implements EmailService<BrevoPayload, EmailSendResult> {
	private BREVO_HOST = env.BREVO_HOST!;
	private BREVO_API_KEY = env.BREVO_API_KEY!;
	private SENDER_NAME = env.SENDER_NAME!;
	private SENDER_EMAIL = env.SENDER_EMAIL!;

	async sendEmail(payload: BrevoPayload): Promise<EmailSendResult> {
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
							email: payload.recipientEmail,
							name: payload.recipientName,
						},
					],
					subject: payload.subject,
					textContent: payload.textContent,
					htmlContent: payload.htmlContent,
					params: payload.params,
				}),
			});

			if (!response.ok) {
                const errorText = await response.text();
				throw new ApiError(response.status, errorText|| "Brevo API failure")
			}

			const data = (await response.json()) as BrevoSendResponse;

			return {
				success: true,
				provider: 'brevo',
				messageId: data.messageId,
			};
		} catch (error) {
			console.error('Brevo sendEmail failed:', error);
			throw new ApiError(status.INTERNAL_SERVER_ERROR, String(error))
		}
	}
}

export const brevoService = new BrevoEmailService();
