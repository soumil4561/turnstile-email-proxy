import { Context } from 'hono';
import { validator } from '@/handlers/turnstile';
import ApiError from '@/utils/ApiError';
import { brevoService } from '@/email/brevo';
import { env } from 'cloudflare:workers';
import { status } from 'http-status';
import { sendResponse } from '@/utils/responses';
import { logger } from '@/utils/logger';

export async function handleContactEmail(c: Context) {
	const body = await c.req.json();

	//first check the turnstile thing
	const turnstileResult = await validator.validate(body.token, null, {});
	if (!turnstileResult.success) {
		logger.error('Turnstile error: ', turnstileResult);
		throw new ApiError(status.FORBIDDEN, 'turnstile captcha check failed');
	}

	logger.debug('Turnstile validation successul: ', turnstileResult);

	const textContent = `New Message from your portfolio:
     Sender Name: ${body.name}
     Email: ${body.email}
     Message: ${body.message}`;

	//then do the brevo send
	const brevoResult = await brevoService.sendEmail({
		recipientName: body.recipientName ?? env.RECIPIENT_NAME,
		recipientEmail: body.recipientEmail ?? env.RECIPIENT_EMAIL,
		subject: `New message from ${body.name}`,
		textContent: textContent,
	});

	logger.debug('Email Sent via brevo successully ', brevoResult);

	//then send back the response
	if (brevoResult.success) {
		return sendResponse(c, status.OK, brevoResult, 'EMAIL SENT SUCCESSFULLY');
	} else {
		return sendResponse(c, status.INTERNAL_SERVER_ERROR, brevoResult.error, 'UNABLE TO SEND EMAIL');
	}
}
