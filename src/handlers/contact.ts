import { Context } from 'hono';
import { env } from 'cloudflare:workers';
import { status } from 'http-status';

import { validator } from '@/handlers/turnstile';
import ApiError from '@/utils/ApiError';
import getEmailService from '@/email/email';
import { sendResponse } from '@/utils/responses';
import { logger } from '@/utils/logger';

export async function handleContactEmail(c: Context) {
	const emailService = getEmailService();
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

	//then do the email send
	const emailResult = await emailService.sendEmail({
		toName: body.recipientName ?? env.RECIPIENT_NAME,
		toEmail: body.recipientEmail ?? env.RECIPIENT_EMAIL,
		subject: `New message from ${body.name}`,
		textContent: textContent,
	});

	logger.debug('Email Sent via brevo successully ', emailResult);

	//then send back the response
	if (emailResult.success) {
		return sendResponse(c, status.OK, emailResult, 'EMAIL SENT SUCCESSFULLY');
	} else {
		return sendResponse(c, status.INTERNAL_SERVER_ERROR, emailResult.error, 'UNABLE TO SEND EMAIL');
	}
}
