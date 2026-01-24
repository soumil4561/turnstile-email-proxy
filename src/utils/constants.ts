export const codes = {
	Success: 'OPERATION_COMPLETED_SUCCESSFULLY',
	EmailSendSuccess: 'EMAIL_SENT_SUCCESSFULLY',

	InternalServerError: 'INTERNAL_SERVER_ERROR',
	EmailSendError: 'EMAIL_SEND_ERROR',
	NotFound: 'NOT_FOUND',
	TurnstileCaptchaFailed: 'TURNSTILE_CAPTCHA_FAILED',
};

export const messages = {
	Success: 'Operation completed successfully.',
	EmailSendSuccess: 'Email sent successfully.',

	InternalServerError: 'Something went wrong. Please try again later.',
	EmailSendError: 'Unable to send email. Please try again later.',
	NotFound: 'The requested resource was not found.',
	TurnstileCaptchaFailed: 'Captcha verification failed. Please refresh and try again.',
};
