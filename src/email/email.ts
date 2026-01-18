import { env } from 'cloudflare:workers';

import { BrevoEmailService } from './brevo';

export type EmailPayload = {
	toName: string;
	toEmail: string;
	subject: string;
	textContent?: string;
	htmlContent?: string;
};

export interface EmailResult {
	success: boolean;
	provider: string;
	messageId?: string;
	error?: string;
}

export interface EmailService {
	sendEmail(payload: EmailPayload): Promise<EmailResult>;
}

let instance: EmailService | null = null;

export default function getEmailService(): EmailService {
	if (!instance) {
		switch (env.EMAIL_PROVIDER) {
			case 'brevo':
				instance = new BrevoEmailService();
				break;
			default:
				throw new Error('email provider not set/set incorrectly, Pl check on the same and try again');
		}
	}
	return instance;
}
